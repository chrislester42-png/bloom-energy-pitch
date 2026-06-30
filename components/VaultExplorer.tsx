"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { t } from "./tokens";

/* ---- data shapes (baked by scripts/build_vault.py) ---------------------- */
type GNode = { id: string; title: string; type: string; tags: string[]; deg: number };
type GLink = { source: string; target: string };
type Graph = { nodes: GNode[]; links: GLink[]; counts: Record<string, number> };
type Note = {
  title: string; type: string; tags: string[]; path: string;
  html: string; sources: string[]; backlinks: string[];
};
type Notes = Record<string, Note>;

/* ---- node-type palette (tuned for the light warm-gray stage) ------------ */
const TYPE_META: Record<string, { color: string; label: string }> = {
  atomic:   { color: "#0f8a4d", label: "Atomic note" },
  source:   { color: "#2563eb", label: "Source" },
  question: { color: "#d97706", label: "Open question" },
  draft:    { color: "#7c3aed", label: "Draft" },
  map:      { color: "#db2777", label: "Map / home" },
  final:    { color: "#0a0a0a", label: "Deliverable" },
  daily:    { color: "#0891b2", label: "Daily note" },
  template: { color: "#94a3b8", label: "Template" },
  other:    { color: "#9ca3af", label: "Other" },
};
const metaOf = (ty: string) => TYPE_META[ty] ?? TYPE_META.other;

/* ---- simulation node (mutable, lives in a ref) -------------------------- */
type SimNode = GNode & { x: number; y: number; vx: number; vy: number; fx?: number; fy?: number; r: number };

export default function VaultExplorer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // graph state held in refs for the animation loop
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<{ s: SimNode; t: SimNode }[]>([]);
  const adjRef = useRef<Map<string, Set<string>>>(new Map());
  const byIdRef = useRef<Map<string, SimNode>>(new Map());
  const camRef = useRef({ x: 0, y: 0, scale: 1 });
  const alphaRef = useRef(1);
  const hoverRef = useRef<string | null>(null);
  const selRef = useRef<string | null>(null);
  const searchRef = useRef("");
  const activeTypesRef = useRef<Set<string>>(new Set());
  const dprRef = useRef(1);

  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Notes | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

  /* ---- load baked data -------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const g: Graph = await fetch("/vault/graph.json").then((r) => {
          if (!r.ok) throw new Error("graph.json " + r.status);
          return r.json();
        });
        if (cancelled) return;

        // seed positions on a circle so the layout opens cleanly
        const N = g.nodes.length;
        const sim: SimNode[] = g.nodes.map((n, i) => {
          const a = (i / N) * Math.PI * 2;
          const rad = 260 + Math.random() * 60;
          return {
            ...n,
            x: Math.cos(a) * rad + (Math.random() - 0.5) * 40,
            y: Math.sin(a) * rad + (Math.random() - 0.5) * 40,
            vx: 0, vy: 0,
            r: 3.2 + Math.sqrt(n.deg) * 1.7,
          };
        });
        const byId = new Map(sim.map((n) => [n.id, n]));
        const links = g.links
          .map((l) => ({ s: byId.get(l.source)!, t: byId.get(l.target)! }))
          .filter((l) => l.s && l.t);
        const adj = new Map<string, Set<string>>();
        sim.forEach((n) => adj.set(n.id, new Set()));
        links.forEach(({ s, t }) => { adj.get(s.id)!.add(t.id); adj.get(t.id)!.add(s.id); });

        nodesRef.current = sim;
        linksRef.current = links;
        byIdRef.current = byId;
        adjRef.current = adj;
        alphaRef.current = 1;
        setCounts(g.counts);
        setLoaded(true);

        const ns: Notes = await fetch("/vault/notes.json").then((r) => r.json());
        if (!cancelled) setNotes(ns);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // mirror selected/search/types into refs (used inside the rAF loop)
  useEffect(() => { selRef.current = selId; alphaRef.current = Math.max(alphaRef.current, 0.3); }, [selId]);
  useEffect(() => { searchRef.current = search.trim().toLowerCase(); }, [search]);
  useEffect(() => { activeTypesRef.current = activeTypes; }, [activeTypes]);

  /* ---- physics + render loop ------------------------------------------- */
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      const wrap = wrapRef.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      canvas.style.width = wrap.clientWidth + "px";
      canvas.style.height = wrap.clientHeight + "px";
    };
    resize();
    // center camera
    camRef.current = { x: canvas.width / (2 * dprRef.current), y: canvas.height / (2 * dprRef.current), scale: 1 };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    const tick = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      let alpha = alphaRef.current;

      if (alpha > 0.005) {
        const k = alpha;
        // repulsion (O(n^2) — fine for a few hundred nodes)
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            let dx = a.x - b.x, dy = a.y - b.y;
            let d2 = dx * dx + dy * dy;
            if (d2 < 0.01) { d2 = 0.01; dx = Math.random(); dy = Math.random(); }
            const rep = (1400 * k) / d2;
            const d = Math.sqrt(d2);
            const fx = (dx / d) * rep, fy = (dy / d) * rep;
            a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
          }
        }
        // link springs
        const target = 70;
        for (const { s, t: tt } of links) {
          let dx = tt.x - s.x, dy = tt.y - s.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const f = ((d - target) * 0.045 * k);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          s.vx += fx; s.vy += fy; tt.vx -= fx; tt.vy -= fy;
        }
        // gravity to origin + integrate
        for (const n of nodes) {
          n.vx += -n.x * 0.012 * k;
          n.vy += -n.y * 0.012 * k;
          if (n.fx !== undefined) { n.x = n.fx; n.y = n.fy!; n.vx = 0; n.vy = 0; continue; }
          n.vx *= 0.82; n.vy *= 0.82;
          n.x += n.vx; n.y += n.vy;
        }
        alphaRef.current = alpha * 0.985;
      }

      draw(ctx);
      raf = requestAnimationFrame(tick);
    };

    const draw = (c: CanvasRenderingContext2D) => {
      const dpr = dprRef.current;
      const cam = camRef.current;
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const adj = adjRef.current;
      const hover = hoverRef.current;
      const sel = selRef.current;
      const focus = sel ?? hover;
      const focusSet = focus ? adj.get(focus) : null;
      const q = searchRef.current;
      const types = activeTypesRef.current;
      const typeFilterOn = types.size > 0;

      c.save();
      c.scale(dpr, dpr);
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.translate(cam.x, cam.y);
      c.scale(cam.scale, cam.scale);

      const dimmed = (id: string) => {
        if (focus) return !(id === focus || (focusSet && focusSet.has(id)));
        return false;
      };
      const filteredOut = (n: SimNode) => {
        if (typeFilterOn && !types.has(n.type)) return true;
        if (q && !n.title.toLowerCase().includes(q)) return true;
        return false;
      };

      // links
      c.lineWidth = 1 / cam.scale;
      for (const { s, t: tt } of links) {
        const related = focus && (s.id === focus || tt.id === focus);
        if (focus && !related) c.strokeStyle = "rgba(10,10,10,0.03)";
        else if (related) c.strokeStyle = "rgba(15,138,77,0.45)";
        else c.strokeStyle = "rgba(10,10,10,0.10)";
        c.beginPath();
        c.moveTo(s.x, s.y);
        c.lineTo(tt.x, tt.y);
        c.stroke();
      }

      // nodes
      const labelEvery = cam.scale > 1.3;
      for (const n of nodes) {
        const m = metaOf(n.type);
        const dim = dimmed(n.id) || filteredOut(n);
        const isFocus = n.id === focus;
        c.beginPath();
        c.arc(n.x, n.y, n.r + (isFocus ? 2 : 0), 0, Math.PI * 2);
        c.fillStyle = dim ? "rgba(10,10,10,0.10)" : m.color;
        c.globalAlpha = dim ? 0.35 : 1;
        c.fill();
        if (isFocus) {
          c.lineWidth = 2 / cam.scale; c.strokeStyle = "#0a0a0a"; c.stroke();
        }
        c.globalAlpha = 1;

        const showLabel =
          !dim && (isFocus || (focusSet && focusSet.has(n.id)) || labelEvery || n.r > 7 ||
          (q && n.title.toLowerCase().includes(q)));
        if (showLabel) {
          c.font = `${isFocus ? "600 " : ""}${11 / cam.scale}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          c.fillStyle = "rgba(10,10,10,0.78)";
          c.textAlign = "center";
          c.textBaseline = "top";
          const label = n.title.length > 42 ? n.title.slice(0, 41) + "…" : n.title;
          c.fillText(label, n.x, n.y + n.r + 2 / cam.scale);
        }
      }
      c.restore();
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [loaded]);

  /* ---- pointer interaction (zoom / pan / drag / click) ------------------ */
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current!;
    const toWorld = (sx: number, sy: number) => {
      const cam = camRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = sx - rect.left, y = sy - rect.top;
      return { x: (x - cam.x) / cam.scale, y: (y - cam.y) / cam.scale };
    };
    const hit = (sx: number, sy: number): SimNode | null => {
      const { x, y } = toWorld(sx, sy);
      let best: SimNode | null = null, bestD = Infinity;
      for (const n of nodesRef.current) {
        const dx = n.x - x, dy = n.y - y;
        const d = dx * dx + dy * dy;
        const rr = (n.r + 6) * (n.r + 6);
        if (d < rr && d < bestD) { best = n; bestD = d; }
      }
      return best;
    };

    let dragNode: SimNode | null = null;
    let panning = false;
    let downX = 0, downY = 0, moved = 0;

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      downX = e.clientX; downY = e.clientY; moved = 0;
      const n = hit(e.clientX, e.clientY);
      if (n) { dragNode = n; alphaRef.current = Math.max(alphaRef.current, 0.4); n.fx = n.x; n.fy = n.y; }
      else panning = true;
    };
    const onMove = (e: PointerEvent) => {
      moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      if (dragNode) {
        const w = toWorld(e.clientX, e.clientY);
        dragNode.fx = w.x; dragNode.fy = w.y; dragNode.x = w.x; dragNode.y = w.y;
        alphaRef.current = Math.max(alphaRef.current, 0.25);
      } else if (panning) {
        camRef.current.x += e.movementX; camRef.current.y += e.movementY;
      } else {
        hoverRef.current = hit(e.clientX, e.clientY)?.id ?? null;
        canvas.style.cursor = hoverRef.current ? "pointer" : "grab";
      }
    };
    const onUp = (e: PointerEvent) => {
      if (dragNode) { dragNode.fx = undefined; dragNode.fy = undefined; }
      if (moved < 5) {
        const n = hit(e.clientX, e.clientY);
        setSelId(n ? n.id : null);
      }
      dragNode = null; panning = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const wx = (mx - cam.x) / cam.scale, wy = (my - cam.y) / cam.scale;
      const factor = Math.exp(-e.deltaY * 0.0014);
      cam.scale = Math.max(0.25, Math.min(5, cam.scale * factor));
      cam.x = mx - wx * cam.scale;
      cam.y = my - wy * cam.scale;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [loaded]);

  /* ---- focus the camera on a node (used when navigating via links) ------ */
  const focusNode = useCallback((id: string) => {
    const n = byIdRef.current.get(id);
    const canvas = canvasRef.current;
    if (!n || !canvas) return;
    const dpr = dprRef.current;
    const cam = camRef.current;
    cam.scale = Math.max(cam.scale, 1.4);
    cam.x = canvas.width / (2 * dpr) - n.x * cam.scale;
    cam.y = canvas.height / (2 * dpr) - n.y * cam.scale;
  }, []);

  const openNote = useCallback((id: string) => {
    if (!byIdRef.current.get(id)) return;
    setSelId(id);
    focusNode(id);
  }, [focusNode]);

  // intercept clicks on wiki-links inside the rendered note
  const onNoteClick = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest("a.wl") as HTMLElement | null;
    if (el && el.dataset.note) { e.preventDefault(); openNote(el.dataset.note); }
  };

  const toggleType = (ty: string) =>
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(ty)) next.delete(ty);
      else next.add(ty);
      return next;
    });

  const note = selId && notes ? notes[selId] : null;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: t.bg }}>
      {/* top bar */}
      <header
        className="flex items-center justify-between gap-4 border-b px-5 py-3 sm:px-7"
        style={{ borderColor: t.line, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/bloom.png" alt="Bloom Energy" style={{ height: 18, width: "auto" }} />
            <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: t.fgMute }}>· BE</span>
          </a>
          <span className="hidden h-4 w-px sm:block" style={{ background: t.lineStrong }} />
          <div className="hidden sm:block">
            <div className="text-[14px] font-semibold tracking-tight" style={{ color: t.ink }}>
              Knowledge Bank
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.fgMute }}>
              {total} notes · {linksRef.current.length || ""} links · the research vault
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="h-9 w-40 rounded-full border px-4 text-[13px] outline-none sm:w-56"
            style={{ borderColor: t.line, background: t.surface, color: t.ink }}
          />
          <a
            href="/"
            className="inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-white"
            style={{ background: t.inkGrad }}
          >
            ← Back to pitch
          </a>
        </div>
      </header>

      {/* body: graph + reading pane */}
      <div className="relative flex min-h-0 flex-1">
        <div ref={wrapRef} className="relative min-w-0 flex-1">
          <canvas ref={canvasRef} className="vault-canvas" />

          {!loaded && !err && (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-mono text-[12px]" style={{ color: t.fgMute }}>
                Loading the vault…
              </span>
            </div>
          )}
          {err && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <span className="text-[13px]" style={{ color: "var(--color-hot)" }}>
                Couldn’t load the graph data ({err}). Run{" "}
                <code>npm run vault</code> to rebuild it.
              </span>
            </div>
          )}

          {/* legend */}
          {loaded && (
            <div
              className="absolute bottom-4 left-4 rounded-xl border p-3"
              style={{ borderColor: t.line, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}
            >
              <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: t.fgMute }}>
                Node type · click to filter
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.entries(TYPE_META)
                  .filter(([ty]) => (counts[ty] ?? 0) > 0)
                  .map(([ty, m]) => {
                    const on = activeTypes.size === 0 || activeTypes.has(ty);
                    return (
                      <button
                        key={ty}
                        onClick={() => toggleType(ty)}
                        className="flex items-center gap-2 text-left text-[12px] transition-opacity"
                        style={{ opacity: on ? 1 : 0.4, color: t.ink2 }}
                      >
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                        {m.label}
                        <span className="tabular-nums" style={{ color: t.fgMute }}>{counts[ty]}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* hint */}
          {loaded && !selId && (
            <div
              className="pointer-events-none absolute right-4 top-4 max-w-[230px] rounded-xl border px-3 py-2 text-[12px]"
              style={{ borderColor: t.line, background: "rgba(255,255,255,0.9)", color: t.fgDim }}
            >
              Scroll to zoom · drag to pan · drag a node to move it · <b>click a node</b> to read it.
            </div>
          )}
        </div>

        {/* reading pane */}
        {note && (
          <aside
            className="flex w-full max-w-full flex-col border-l sm:w-[460px]"
            style={{ borderColor: t.line, background: t.surface }}
          >
            <div className="flex items-start justify-between gap-3 border-b px-6 py-4" style={{ borderColor: t.line }}>
              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{ background: metaOf(note.type).color + "1a", color: metaOf(note.type).color }}
                >
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: metaOf(note.type).color }} />
                  {metaOf(note.type).label}
                </span>
                <div className="mt-2 truncate font-mono text-[10.5px]" style={{ color: t.fgMute }}>
                  {note.path}
                </div>
              </div>
              <button
                onClick={() => setSelId(null)}
                className="shrink-0 rounded-full border px-2.5 py-1 text-[12px]"
                style={{ borderColor: t.line, color: t.fgDim }}
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="vault-note" onClick={onNoteClick} dangerouslySetInnerHTML={{ __html: note.html }} />

              {note.sources.length > 0 && (
                <LinkList title="Cites these sources" ids={note.sources} notes={notes!} onOpen={openNote} />
              )}
              {note.backlinks.length > 0 && (
                <LinkList title={`Referenced by (${note.backlinks.length})`} ids={note.backlinks} notes={notes!} onOpen={openNote} />
              )}
              {note.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {note.tags.map((tg) => (
                    <span key={tg} className="rounded-full px-2 py-0.5 font-mono text-[10.5px]"
                      style={{ background: t.bgDeep, color: t.fgDim }}>#{tg}</span>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function LinkList({
  title, ids, notes, onOpen,
}: { title: string; ids: string[]; notes: Notes; onOpen: (id: string) => void }) {
  return (
    <div className="mt-6 border-t pt-4" style={{ borderColor: t.line }}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {ids.map((id) => {
          const n = notes[id];
          const m = metaOf(n?.type ?? "other");
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-[var(--color-bg-deep)]"
              style={{ color: t.ink2 }}
            >
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: m.color }} />
              <span className="truncate">{n?.title ?? id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
