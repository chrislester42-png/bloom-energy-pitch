"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "./tokens";

export type Cited = { id: string; title: string; type: string; status?: string };
type Msg = { role: "user" | "assistant"; content: string; cited?: Cited[] };

const TYPE_COLOR: Record<string, string> = {
  atomic: "#0f8a4d", source: "#2563eb", question: "#d97706", draft: "#7c3aed",
  map: "#db2777", final: "#0a0a0a", daily: "#0891b2", template: "#94a3b8", other: "#9ca3af",
};
const colorOf = (ty: string) => TYPE_COLOR[ty] ?? TYPE_COLOR.other;

// Safety net: the model is told not to, but strip stray Markdown so answers
// render as clean plain text (keeps "- " bullets). Leaves single "*" alone.
function tidyMarkdown(s: string): string {
  return s
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // leading headers: ##, ###, …
    .replace(/\*\*(.+?)\*\*/g, "$1")    // bold **text**
    .replace(/\*\*/g, "")               // any leftover ** markers
    .replace(/__(.+?)__/g, "$1")        // bold __text__
    .trim();
}

const SUGGESTIONS = [
  "What's the bear case in one paragraph?",
  "How exposed is Bloom to the ITC?",
  "Is the related-party revenue a problem?",
  "Why is Bloom faster than a gas turbine?",
];

export default function AskChat({
  onCite,
  onOpenNote,
  compact = false,
}: {
  onCite?: (ids: string[]) => void;
  onOpenNote?: (id: string) => void;
  compact?: boolean;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || loading) return;
    const history = msgs.map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, history }),
      });
      const d = await r.json().catch(() => ({ ok: false, reason: "bad-json" }));
      let content: string;
      let cited: Cited[] = [];
      if (d?.ok) {
        content = d.answer || "(no answer)";
        cited = Array.isArray(d.cited) ? d.cited : [];
      } else if (d?.reason === "no-key") {
        content = "The research assistant isn't switched on yet — an Anthropic API key still needs to be added to the site's settings.";
      } else if (d?.reason === "rate-limited") {
        content = "A lot of questions just came through — give it a few seconds and try again.";
      } else {
        const why = [d?.reason, d?.status, d?.detail].filter(Boolean).join(" · ");
        content = "The research assistant hit a problem" + (why ? ` (${why})` : "") + ". Please try again in a moment.";
      }
      setMsgs((m) => [...m, { role: "assistant", content, cited }]);
      if (cited.length && onCite) onCite(cited.map((c) => c.id));
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Couldn't reach the research assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {msgs.length === 0 && (
          <div className="flex h-full flex-col items-start justify-center gap-3">
            <p className="text-[14px] leading-relaxed" style={{ color: t.fgDim }}>
              Ask anything about Bloom Energy. I answer <b>only</b> from this project&apos;s research vault —
              and I&apos;ll tell you when something isn&apos;t in it yet.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border px-3 py-1.5 text-left text-[12.5px] transition-colors hover:bg-[var(--color-bg-deep)]"
                  style={{ borderColor: t.line, color: t.ink2 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              <div
                className="max-w-[92%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed"
                style={
                  m.role === "user"
                    ? { background: t.inkGrad, color: "#fff" }
                    : { background: t.surface, border: `1px solid ${t.line}`, color: t.ink2 }
                }
              >
                <div className="whitespace-pre-wrap">{m.role === "assistant" ? tidyMarkdown(m.content) : m.content}</div>
                {m.cited && m.cited.length > 0 && (
                  <div className="mt-3 border-t pt-2.5" style={{ borderColor: t.line }}>
                    <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
                      From these notes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.cited.map((c) => {
                        const chip = (
                          <>
                            <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: colorOf(c.type) }} />
                            <span className="truncate">{c.title}</span>
                            {c.status && c.status !== "confirmed" && (
                              <span className="font-mono text-[9px] uppercase" style={{ color: "var(--color-warm)" }}>{c.status}</span>
                            )}
                          </>
                        );
                        const cls = "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-left text-[11.5px] max-w-full";
                        return onOpenNote ? (
                          <button key={c.id} onClick={() => onOpenNote(c.id)} className={cls + " transition-colors hover:bg-[var(--color-bg-deep)]"}
                            style={{ borderColor: t.line, color: t.ink2 }}>{chip}</button>
                        ) : (
                          <a key={c.id} href="/vault" className={cls} style={{ borderColor: t.line, color: t.ink2 }}>{chip}</a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1.5 px-1" style={{ color: t.fgMute }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: t.accent }} />
              <span className="text-[12.5px]">Reading the research…</span>
            </div>
          )}
        </div>
      </div>

      {/* input */}
      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="flex items-center gap-2 border-t px-3 py-3"
        style={{ borderColor: t.line, background: "rgba(255,255,255,0.6)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={compact ? "Ask the research…" : "Ask anything about Bloom Energy…"}
          className="h-10 min-w-0 flex-1 rounded-full border px-4 text-[14px] outline-none"
          style={{ borderColor: t.line, background: t.surface, color: t.ink }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[13px] font-medium text-white disabled:opacity-40"
          style={{ background: t.inkGrad }}
        >
          Ask
        </button>
      </form>
      <div className="px-4 pb-2 text-[10.5px]" style={{ color: t.fgMute }}>
        Educational research, grounded in this project&apos;s vault — not investment advice.
      </div>
    </div>
  );
}
