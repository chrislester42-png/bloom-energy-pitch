import { t } from "./tokens";
import {
  scorecard,
  postPrintVerdict,
  PRINT_DATE,
  COMMITTED,
  REPO_URL,
} from "@/data/scorecard";

/**
 * Scorecard — pre-registered predictions, graded in public.
 *
 * The ranges render from data/scorecard.ts, which was committed to public
 * git history BEFORE the Q2 2026 print. After the print, only `reported`
 * and `verdict` are filled in; the predictions are never edited. The git
 * log is the proof either way.
 */

const TH = "px-3.5 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em]";

function Pill({ verdict }: { verdict: "pending" | "hit" | "miss" }) {
  const map = {
    pending: { c: "#92400e", bg: "rgba(146,64,14,0.10)", label: "pending" },
    hit: { c: "#166534", bg: "rgba(22,101,52,0.12)", label: "hit" },
    miss: { c: "var(--color-hot, #dc2626)", bg: "rgba(220,38,38,0.10)", label: "miss" },
  }[verdict];
  return (
    <span
      className="inline-block rounded-full px-3 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em]"
      style={{ color: map.c, background: map.bg }}
    >
      {map.label}
    </span>
  );
}

export function Scorecard() {
  const graded = scorecard.filter((r) => r.verdict !== "pending");
  const hits = scorecard.filter((r) => r.verdict === "hit").length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
        The earnings scorecard · pre-registered
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: t.ink }}>
        We predict first. Then we grade ourselves in public.
      </h1>
      <p className="mt-5 max-w-3xl text-[16px] leading-relaxed" style={{ color: t.fgDim }}>
        Before Bloom&apos;s Q2 2026 print ({PRINT_DATE}), we committed the ranges
        below to this site&apos;s public git history. After the print, each row is
        graded — hit or miss, no edits, no hindsight. A thesis that can&apos;t say
        what would surprise it isn&apos;t a thesis.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className="rounded-xl border px-4 py-2.5 font-mono text-[11px] font-medium"
          style={{ borderColor: t.accent, background: "var(--color-accent-soft)", color: t.accent }}
        >
          ✓ COMMITTED BEFORE THE PRINT · {COMMITTED}
        </span>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-dashed px-4 py-2.5 font-mono text-[11px] underline-offset-2 hover:underline"
          style={{ borderColor: t.lineStrong, color: t.fgMute }}
        >
          proof: public commit history — the commit adding these ranges predates the release
        </a>
        {graded.length > 0 && (
          <span
            className="rounded-xl border px-4 py-2.5 font-mono text-[11px] font-semibold"
            style={{ borderColor: t.lineStrong, color: t.ink }}
          >
            score: {hits} / {scorecard.length} inside pre-registered ranges
          </span>
        )}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line" style={{ background: t.surface }}>
        <table className="w-full min-w-[960px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "17%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "38%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead>
            <tr style={{ color: t.fgMute, background: t.sunken }}>
              <th className={TH}>Metric</th>
              <th className={TH}>Our pre-registered range</th>
              <th className={TH}>Why it matters to the thesis</th>
              <th className={TH}>Reported</th>
              <th className={TH}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.map((r) => (
              <tr key={r.metric} className="border-t border-line align-top">
                <td className="px-3.5 py-3.5">
                  <div className="text-[14px] font-semibold leading-snug" style={{ color: t.ink }}>{r.metric}</div>
                  <div className="mt-1 font-mono text-[10.5px]" style={{ color: t.fgMute }}>{r.street}</div>
                </td>
                <td className="px-3.5 py-3.5 font-mono text-[13.5px] font-semibold leading-snug" style={{ color: t.accent }}>
                  {r.range}
                </td>
                <td className="px-3.5 py-3.5 text-[13px] leading-relaxed" style={{ color: t.fgDim }}>
                  {r.falsifier && (
                    <span className="mr-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#92400e" }}>
                      Tripwire №{r.falsifier} —
                    </span>
                  )}
                  {r.why}
                </td>
                <td className="px-3.5 py-3.5 font-mono text-[13px] leading-snug" style={{ color: r.reported ? t.ink : t.fgMute }}>
                  {r.reported ?? "—"}
                </td>
                <td className="px-3.5 py-3.5"><Pill verdict={r.verdict} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-4xl text-[13px] leading-relaxed" style={{ color: t.fgMute }}>
        Grading rule, fixed in advance: a row is a <b>hit</b> if the reported
        figure lands inside the range, a <b>miss</b> otherwise — no partial
        credit, no re-interpretation. If two or more tripwire rows break
        against us, the call gets formally revisited on the{" "}
        <a href="/process" className="underline underline-offset-2" style={{ color: t.accent }}>Process</a>{" "}
        page, in writing. Tripwire numbers refer to the five commitments
        published there (the formal term is &quot;falsifiers&quot;).
        Educational research, not investment advice.
      </p>

      {postPrintVerdict && (
        <div
          className="mt-8 rounded-2xl border-l-[3px] p-6 text-[15px] leading-relaxed"
          style={{ borderColor: t.accent, background: t.surface, color: t.ink2 }}
        >
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.accent }}>
            The verdict, after the print
          </div>
          {postPrintVerdict}
        </div>
      )}
    </div>
  );
}
