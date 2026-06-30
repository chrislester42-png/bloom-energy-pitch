#!/usr/bin/env python3
"""Bake the Obsidian vault into graph.json + notes.json for the website.

Reads every markdown file in the vault, parses YAML-ish frontmatter and
[[wiki-links]] (both frontmatter `sources:` and inline body links), renders
the body to HTML, and emits into the site's public/vault folder:
  - graph.json : { nodes:[{id,title,type,tags,deg}], links:[{source,target}], counts:{} }
  - notes.json : { <id>: {title,type,tags,html,sources,backlinks,path} }

The graph never needs live vault access at runtime; it is fully baked.

Usage:
  python3 scripts/build_vault.py [VAULT_DIR] [OUT_DIR]

Defaults assume this lives at <repo>/scripts and the vault is the
grandparent of the repo (…/Bloom Energy).
"""
import os, re, sys, json, html, time

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
DEFAULT_VAULT = os.path.abspath(os.path.join(REPO, "..", ".."))  # …/Bloom Energy
DEFAULT_OUT = os.path.join(REPO, "public", "vault")

VAULT = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_VAULT
OUT = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUT
os.makedirs(OUT, exist_ok=True)

# Folder (top-level) -> node type
TYPE_BY_PREFIX = [
    ("01 Sources", "source"),
    ("02 Atomic Notes", "atomic"),
    ("03 Drafts", "draft"),
    ("04 Final Deliverables", "final"),
    ("05 Questions", "question"),
    ("06 Templates", "template"),
    ("07 Daily", "daily"),
]
# folders we never want in the public graph
SKIP_DIRS = {".obsidian", ".git", "08 Website", "node_modules"}

# Files to exclude from the PUBLIC website vault. Any note whose filename
# matches one of these (case-insensitive) substrings is dropped entirely:
# it becomes neither a graph node nor a readable note, and links pointing
# to it are silently dropped. Add more markers here to hide other notes.
EXCLUDE_NAME_MARKERS = ["(internal)", "(internal v2)", "(internal v", "(confidential)"]


def is_excluded(rel):
    name = os.path.basename(rel).lower()
    return any(m.lower() in name for m in EXCLUDE_NAME_MARKERS)


def read_text(path, tries=5):
    for i in range(tries):
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                return f.read()
        except OSError:
            if i == tries - 1:
                raise
            time.sleep(0.4 * (i + 1))
    return ""


def node_type(rel):
    for prefix, t in TYPE_BY_PREFIX:
        if rel == prefix or rel.startswith(prefix + "/"):
            return t
    if rel in ("00 Project Home.md",):
        return "map"
    return "other"


# ---- collect files ---------------------------------------------------------
files = []
excluded = []
for root, dirs, names in os.walk(VAULT):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
    for n in names:
        if n.lower().endswith(".md"):
            ab = os.path.join(root, n)
            rel = os.path.relpath(ab, VAULT)
            if is_excluded(rel):
                excluded.append(rel)
                continue
            files.append((rel, ab))


def to_id(rel):
    return rel[:-3] if rel.lower().endswith(".md") else rel


by_basename = {}
by_id = {}
for rel, ab in files:
    nid = to_id(rel)
    by_id[nid] = (rel, ab)
    by_basename.setdefault(os.path.basename(nid), nid)

WIKILINK = re.compile(r"\[\[([^\]\|]+?)(?:\|([^\]]+))?\]\]")


def resolve(target):
    t = target.strip()
    if t.lower().endswith(".md"):
        t = t[:-3]
    t = t.split("#")[0].strip().strip("/")
    if t in by_id:
        return t
    base = os.path.basename(t)
    if base in by_basename:
        return by_basename[base]
    if t in by_basename:
        return by_basename[t]
    return None


def split_frontmatter(text):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[3:end].strip("\n"), text[end + 4:]
    return "", text


def first_heading(body, fallback):
    for line in body.splitlines():
        s = line.strip()
        if s.startswith("# "):
            return s[2:].strip()
    return fallback


def parse_tags(fm):
    m = re.search(r"^tags:\s*\[(.*?)\]", fm, re.MULTILINE)
    if m:
        return [x.strip().strip('"\'') for x in m.group(1).split(",") if x.strip()]
    tags = []
    m2 = re.search(r"^tags:\s*$", fm, re.MULTILINE)
    if m2:
        for line in fm[m2.end():].splitlines():
            if re.match(r"\s*-\s+", line):
                tags.append(re.sub(r"\s*-\s+", "", line).strip().strip('"\''))
            elif line.strip() and not line.startswith(" "):
                break
    return tags


# ---- minimal markdown -> HTML ---------------------------------------------
def md_to_html(body):
    def wl(m):
        tgt, alias = m.group(1), m.group(2)
        rid = resolve(tgt)
        label = alias or os.path.basename(tgt.split("#")[0].strip())
        if rid:
            return f'\x00LINK:{rid}\x01{label}\x02'
        return html.escape(label)
    body = WIKILINK.sub(wl, body)

    out, in_ul = [], False

    def close_ul():
        nonlocal in_ul
        if in_ul:
            out.append("</ul>"); in_ul = False

    def inline(s):
        s = html.escape(s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", s)
        s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
        s = re.sub(r"\[([^\]]+)\]\((https?://[^\)]+)\)",
                   r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
        s = re.sub(r"\x00LINK:(.+?)\x01(.+?)\x02",
                   lambda m: f'<a class="wl" data-note="{html.escape(m.group(1), quote=True)}">{m.group(2)}</a>', s)
        return s

    for line in body.splitlines():
        st = line.strip()
        if not st:
            close_ul(); continue
        h = re.match(r"^(#{1,6})\s+(.*)$", st)
        if h:
            close_ul(); lvl = len(h.group(1))
            out.append(f"<h{lvl}>{inline(h.group(2))}</h{lvl}>"); continue
        if re.match(r"^[-*+]\s+", st):
            if not in_ul:
                out.append("<ul>"); in_ul = True
            item = inline(re.sub(r"^[-*+]\s+", "", st))
            out.append(f"<li>{item}</li>"); continue
        if re.match(r"^>\s?", st):
            close_ul()
            quote = inline(re.sub(r"^>\s?", "", st))
            out.append(f"<blockquote>{quote}</blockquote>"); continue
        if re.match(r"^(---|\*\*\*|___)$", st):
            close_ul(); out.append("<hr/>"); continue
        close_ul(); out.append(f"<p>{inline(st)}</p>")
    close_ul()
    return "\n".join(out)


# ---- main pass -------------------------------------------------------------
nodes, edges, notes = {}, set(), {}
for rel, ab in files:
    nid = to_id(rel)
    text = read_text(ab)
    fm, body = split_frontmatter(text)
    title = first_heading(body, os.path.basename(nid))
    typ = node_type(rel)
    tags = parse_tags(fm)

    fm_links = [r for r in (resolve(m.group(1)) for m in WIKILINK.finditer(fm)) if r]
    body_links = [r for r in (resolve(m.group(1)) for m in WIKILINK.finditer(body)) if r]
    htmlbody = md_to_html(body)

    targets = (set(fm_links) | set(body_links)) - {nid}
    for t in targets:
        edges.add((nid, t))

    nodes[nid] = {"id": nid, "title": title, "type": typ, "tags": tags}
    notes[nid] = {"title": title, "type": typ, "tags": tags, "path": rel,
                  "html": htmlbody, "sources": sorted(set(fm_links))}

backlinks = {nid: set() for nid in nodes}
for s, t in edges:
    if t in backlinks:
        backlinks[t].add(s)
for nid in notes:
    notes[nid]["backlinks"] = sorted(backlinks.get(nid, set()))

deg = {nid: 0 for nid in nodes}
for s, t in edges:
    deg[s] = deg.get(s, 0) + 1
    deg[t] = deg.get(t, 0) + 1

node_list = []
for nid, n in nodes.items():
    n2 = dict(n); n2["deg"] = deg.get(nid, 0); node_list.append(n2)
node_list.sort(key=lambda x: (-x["deg"], x["title"]))

link_list = [{"source": s, "target": t} for (s, t) in sorted(edges)
             if s in nodes and t in nodes]

graph = {"nodes": node_list, "links": link_list,
         "counts": {t: sum(1 for n in node_list if n["type"] == t)
                    for t in sorted(set(n["type"] for n in node_list))}}

with open(os.path.join(OUT, "graph.json"), "w") as f:
    json.dump(graph, f, separators=(",", ":"))
with open(os.path.join(OUT, "notes.json"), "w") as f:
    json.dump(notes, f, separators=(",", ":"))

print(f"nodes={len(node_list)} links={len(link_list)}")
print("by type:", json.dumps(graph["counts"]))
if excluded:
    print(f"EXCLUDED {len(excluded)} internal file(s) from public vault:")
    for e in excluded:
        print(f"  - {e}")
for n in node_list[:8]:
    print(f"  [{n['type']:8}] deg={n['deg']:>3}  {n['title'][:58]}")
print(f"graph.json={os.path.getsize(os.path.join(OUT,'graph.json'))/1024:.0f}KB "
      f"notes.json={os.path.getsize(os.path.join(OUT,'notes.json'))/1024:.0f}KB")
