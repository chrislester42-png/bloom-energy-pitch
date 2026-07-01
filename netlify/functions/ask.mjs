// Netlify serverless function — "Ask the research" RAG endpoint.
// Answers strictly from the baked knowledge bank (kb.json) using Claude Haiku.
// The API key stays server-side. Set ANTHROPIC_API_KEY in Netlify → Env vars.
// Endpoint: /.netlify/functions/ask   (POST { question, history? })
import kb from "./kb.json";

const MODEL = "claude-haiku-4-5-20251001"; // fast + cheap; update the string if needed
const MAX_NOTES = 28; // how many notes to retrieve into context
const MAX_OUTPUT_TOKENS = 700;
const MAX_Q_LEN = 1000;

// ---- best-effort in-memory rate limit (resets on cold start) --------------
const HITS = new Map(); // ip -> [timestamps]
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
function rateLimited(ip) {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

const STOP = new Set(("a an and are as at be by for from has have how in is it its of on or that " +
  "the to was what when where which who why with does do did will would can could bloom energy be " +
  "company stock this these those about into over under vs").split(" "));

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9$%.]+/g) || []).filter((w) => w.length > 1 && !STOP.has(w));
}

// keyword-overlap retrieval; title matches weighted higher
function retrieve(query) {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const scored = kb.map((n) => {
    const title = n.title.toLowerCase();
    const text = n.text.toLowerCase();
    let s = 0;
    for (const t of terms) {
      if (title.includes(t)) s += 4;
      const m = text.split(t).length - 1;
      s += Math.min(m, 5);
    }
    return { n, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, MAX_NOTES).map((x) => x.n);
}

const SYSTEM = `You are the research assistant for an independent equity-research project on Bloom Energy (NYSE: BE). You answer STRICTLY from the provided research notes — the analyst's own knowledge bank — and nothing else.

Rules:
- Use ONLY the notes provided in the user message. Never use outside knowledge or make up facts, figures, or sources.
- If the notes don't contain the answer, say plainly: "That isn't in the research yet." Then, if relevant, point to the closest related note by title. Do not guess.
- Respect provenance: many notes have a status of "confirmed", "partial", or "unverified"/estimate. When you rely on an unverified or estimated figure, say so (e.g., "per an unverified estimate"). Prefer confirmed notes.
- Be concise and plain-spoken — a smart non-expert (e.g., a teacher) should understand. Explain energy jargon in plain words. Keep answers to a few short paragraphs.
- Write in plain sentences and short paragraphs. Do NOT use Markdown headers (#, ##, ###) or bold (**). For lists, use simple hyphen bullets ("- "). No other markup.
- This is educational research, not investment advice. Do not tell the user to buy or sell.
- Cite the notes you used inline by their title in the prose.
- On the LAST line of your reply, output exactly one machine-readable tag listing the ids of every note you used, ids copied verbatim, pipe-separated: <<CITE:id one||id two>>. If you used none, output <<CITE:>>. Nothing after that tag.`;

function titleIndex() {
  // compact map of the full corpus so the model knows the full scope
  return "FULL NOTE INDEX (id — title [type/status]):\n" +
    kb.map((n) => `- ${n.id} — ${n.title} [${n.type}${n.status ? "/" + n.status : ""}]`).join("\n");
}

function notesBlock(notes) {
  return notes.map((n) =>
    `### ${n.id}\nTitle: ${n.title}\nType: ${n.type}${n.status ? " · Status: " + n.status : ""}\n${n.text}`
  ).join("\n\n");
}

export default async (req, context) => {
  const headers = { "content-type": "application/json" };
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, reason: "method" }), { status: 405, headers });
  }
  // accept common env-var names so the key works however it was labelled
  const key = (process.env.CLAUDE_API || process.env.ANTHROPIC_API_KEY ||
               process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_KEY || "").trim();
  if (!key) {
    return new Response(JSON.stringify({ ok: false, reason: "no-key" }), { status: 200, headers });
  }
  const ip = req.headers.get("x-nf-client-connection-ip") || context?.ip || "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, reason: "rate-limited" }), { status: 429, headers });
  }

  let body;
  try { body = await req.json(); } catch { body = {}; }
  const question = String(body.question || "").slice(0, MAX_Q_LEN).trim();
  if (!question) {
    return new Response(JSON.stringify({ ok: false, reason: "empty" }), { status: 400, headers });
  }
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

  // retrieve using the current question plus the last user turn for context
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const retrieved = retrieve(question + " " + (lastUser?.content || ""));

  const userContent =
    `Answer the question using only these research notes.\n\n` +
    `=== RETRIEVED NOTES ===\n${notesBlock(retrieved) || "(no notes matched the query)"}\n\n` +
    `=== QUESTION ===\n${question}`;

  const messages = [
    ...history.filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
    { role: "user", content: userContent },
  ];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.2,
        system: SYSTEM + "\n\n" + titleIndex(),
        messages,
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return new Response(JSON.stringify({ ok: false, reason: "api", status: r.status, detail: detail.slice(0, 300) }),
        { status: 200, headers });
    }
    const data = await r.json();
    let answer = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();

    // parse + strip the <<CITE:...>> tag
    let cited = [];
    const m = answer.match(/<<CITE:([^>]*)>>/);
    if (m) {
      const ids = m[1].split("||").map((s) => s.trim()).filter(Boolean);
      const byId = new Map(kb.map((n) => [n.id, n]));
      cited = ids.map((id) => byId.get(id)).filter(Boolean)
        .map((n) => ({ id: n.id, title: n.title, type: n.type, status: n.status }));
      answer = answer.replace(/<<CITE:[^>]*>>\s*$/, "").trim();
    }

    return new Response(JSON.stringify({ ok: true, answer, cited }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: "fetch-failed" }), { status: 200, headers });
  }
};
