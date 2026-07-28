import { t } from "./tokens";
import { TierLegend } from "./ui";

/**
 * Process, the audit trail, published.
 *
 * Research is only as good as its willingness to show corrections. This page
 * publishes the discipline behind the numbers: how sources are frozen and
 * tiered, what the v5 audit changed in the model (and in which direction),
 * the decision log with rationale, the open flags and their status, and the
 * falsifiers we committed to in advance.
 *
 * Static server component, everything here is a matter of record.
 */

const CHANGELOG = [
  { id: "A", sheet: "DCF", cells: "E21:I21", change: "Forecast tax-rate negation removed, the sign error was crediting a phantom tax benefit; rate now +5%", dir: "Value DOWN", src: "[D] convention fix" },
  { id: "B", sheet: "DCF", cells: "C40", change: "Gordon terminal FCF normalized: ΔNWC at terminal growth × terminal NWC, not the 18%-growth-level −$363M", dir: "Value UP (terminal value rises materially)", src: "[D] reinvestment consistency" },
  { id: "C", sheet: "DCF", cells: "C69, D69", change: "Per-share divisor: basic 284,440k → diluted 319,700k shares", dir: "Value DOWN ~11% per share", src: "[R] Q1 2026 10-Q, accn 0001628280-26-028021" },
  { id: "D", sheet: "DCF", cells: "D9", change: "Valuation date =TODAY() → pinned 2026-06-27 (the price date)", dir: "Stability, not level", src: "protocol" },
  { id: "E", sheet: "FSM", cells: "H90", change: "FY2025 actual capex 0 → −$56,759k restored", dir: "Base year only", src: "[R] FY2025 10-K, accn 0001628280-26-006516" },
  { id: "F", sheet: "CAPM data", cells: "N10, N11, B7", change: "Return-range alignment; stale beta label rewritten", dir: "None (cosmetic)", src: "–" },
  { id: "G", sheet: "Reverse DCF", cells: "new tab", change: "CFA implied-expectations solve: price → EV → implied revenue path via goal-seek on year-one growth at the model WACC", dir: "Diagnostic (drives the frontier)", src: "[D] built on the v5 bridge" },
];

const DECISIONS = [
  { n: 1, d: "Valuation date pinned 2026-07-14 for the macro work; the workbook pins 2026-06-27 to its price date", why: "Latest complete Treasury print; all primaries aligned; one refresh before final delivery." },
  { n: 2, d: "Professional register throughout; \"in-the-model\" wiring boxes retained", why: "Per instruction, the wiring is the deliverable, not decoration." },
  { n: 3, d: "Empirical case-setting for gas: bull = 20th percentile of trailing-decade annual means, base = STEO forecast, bear = worst realized annual mean", why: "Reproducible and primary-sourced, not vibes." },
  { n: 4, d: "Joint-project protocol with the CEG team: shared pin, shared primitives, shared scenario coordinates, exposed pie shares", why: "The two teams' claimed gigawatts must fit inside one demand pie, the mesh double-count check." },
  { n: 5, d: "Fuel arithmetic re-anchored to the datasheet HHV heat-rate band", why: "Gas is billed on HHV; stating the basis removes a ~10% wedge that flatters cross-vendor comparisons." },
  { n: 6, d: "ERP: Damodaran implied, July 2026 (4.45%)", why: "Forward-looking, named, dated; January's 4.23% verified as fallback: 22bp is immaterial." },
  { n: 7, d: "Beta: our 60-month regression (3.77) primary; bottom-up peer beta disclosed as sensitivity; four provider betas exposed as presets in the lab", why: "Neither estimate is innocent. The dispute is settled empirically by the rate-robustness experiment, not by silent choice." },
  { n: 8, d: "Cleanview's measured 14% behind-the-meter OEM share adopted as the win-rate anchor", why: "Converts the model's most subjective input into one with an independent empirical reference." },
  { n: 9, d: "Scandium flag resolved by exclusion: the deliverables carry only the 10-K's own supply-chain language", why: "The filing does not disclose specific materials; we do not claim more than the record shows." },
  { n: 10, d: "Analytic bounds for the experiments; the workbook re-run is the arbiter; the verdict is framed as a rate–growth frontier", why: "Bounds with stated formulas beat false precision, the overvaluation finding is not rate-robust, and we say so." },
];

const FLAGS = [
  { flag: "Two-sided call under formal review (triggered by the Q2 2026 print)", status: "OPEN. Falsifiers №1 and №2 triggered on Jul 28 (see Scorecard: 2/8 in pre-registered ranges, all misses bullish). Per the rule fixed in advance, the model re-runs on the raised $3.9–4.2B guidance before the call is restated." },
  { flag: "Related-party revenue: substance vs classification", status: "PARTIAL: the earnings call supplied the mechanism. The CFO confirmed the financing layer rotated to independent financiers (IDF, with Oaktree/MUFG/Morgan Stanley, was \"a meaningful contributor to the quarter\"), so the funded-buyer structure moved to arm's-length institutions rather than vanishing. The 10-Q's concentration note still sets the magnitudes." },
  { flag: "Q2 2026 earnings-call transcript", status: "RESOLVED. Ingested Jul 28: the financier-vs-end-customer revenue model explained on the record, backlog growing faster than revenue, a \"very high 90s\" data-center share claim (denominator flagged), service margin 22% vs −21% at IPO, CFOA baseline reset to $375M+, and guidance declared independent of any single project." },
  { flag: "Project Jupiter fuel-pipeline block", status: "RESOLVED. Confirmed on primary: NM land commissioner denied Energy Transfer's reconsideration Jul 14, 2026 (second rejection); 30-day appeal window; state air-quality hearing on the fuel cells set for October." },
  { flag: "Hyperscaler capex figures (press-compiled)", status: "OPEN. Tie out to 10-Qs at the next model session." },
  { flag: "HY OAS beyond the verified 5/12 print", status: "OPEN: 2.69% (7/10) is aggregator-sourced; confirm at the final pin re-pull." },
  { flag: "Damodaran July 2026 workbook", status: "PARTIAL: January figure verified on the author's blog; pull the workbook when reachable." },
  { flag: "LBNL Queued Up PDFs", status: "OPEN. Figures cited from the lab's pages; freeze local copies." },
  { flag: "If-converted share counts", status: "OPEN. Computed from carrying values; reconcile to the 10-K maximum-share table." },
  { flag: "Market snapshot", status: "RESOLVED. Re-pulled at the 2026-07-14 pin ($243.40; $69.2B cap; EV $69.4B)." },
];

const FALSIFIERS = [
  "Sustained arm's-length revenue growth above the mid-teens (vs ~17% ex-affiliate in Q1 2026).",
  "A quarter of operating cash flow not carried by affiliate collections.",
  "MACR certification evidence on 2026-start projects (FEOC compliance demonstrated, not asserted).",
  "Primary-source resolution of the Jupiter pipeline path (now: October air-permit hearing).",
  "The next gigawatt of factory capacity landing near the claimed ~$100M.",
];

const TH = "px-3 py-2 text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em]";
const TD = "px-3 py-2.5 align-top text-[13px] leading-snug";

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-line p-6 sm:p-8" style={{ background: t.surface }}>
      <h2 className="text-[19px] font-semibold tracking-tight" style={{ color: t.ink }}>{title}</h2>
      <p className="mt-1 mb-5 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>{sub}</p>
      {children}
    </div>
  );
}

export function Process() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
        Our process · the audit trail, published
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: t.ink }}>
        Research you can check, including our own mistakes.
      </h1>
      <p className="mt-5 max-w-3xl text-[16px] leading-relaxed" style={{ color: t.fgDim }}>
        Every figure in this report traces to a frozen primary source with a
        retrieval date, carries an evidence tier, and, where it feeds the model
       : a named cell. When the audit found errors, we fixed them, logged the
        direction each fix moved the answer, and left the log public. What
        separates research from advocacy is whether corrections that hurt your
        conclusion get published too. Two of ours cut per-share value; one
        raised it. All three are below.
      </p>
      <div className="mt-6"><TierLegend /></div>

      <Card
        title="The v5 model audit, what changed, and which way it cut"
        sub="Applied Jul 8, 2026 · workbook cells carry full comments (old value, new value, reason, source with SEC accession)"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ color: t.fgMute }}>
                <th className={TH}>#</th><th className={TH}>Sheet · cells</th><th className={TH}>Change</th><th className={TH}>Direction on value</th><th className={TH}>Source / tier</th>
              </tr>
            </thead>
            <tbody>
              {CHANGELOG.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className={`${TD} font-mono font-semibold`} style={{ color: t.accent }}>{r.id}</td>
                  <td className={`${TD} whitespace-nowrap font-mono text-[12px]`} style={{ color: t.fgDim }}>{r.sheet} · {r.cells}</td>
                  <td className={TD} style={{ color: t.ink2 }}>{r.change}</td>
                  <td className={`${TD} whitespace-nowrap font-medium`} style={{ color: r.dir.includes("DOWN") ? "var(--color-hot, #dc2626)" : r.dir.includes("UP") ? "#166534" : t.fgDim }}>{r.dir}</td>
                  <td className={`${TD} font-mono text-[11.5px]`} style={{ color: t.fgMute }}>{r.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: t.fgMute }}>
          Net effect of the audit: blended per-share value moved from $20.51 to
          $18.23. The fixes cut in both directions, which is what an honest
          audit looks like.
        </p>
      </Card>

      <Card
        title="The decision log, judgment calls, with rationale"
        sub="Delegated authority, exercised in the open · from the macro workstream's decision log"
      >
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {DECISIONS.map((d) => (
            <div key={d.n} className="px-5 py-4" style={{ background: t.surface }}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: t.accent }}>{String(d.n).padStart(2, "0")}</span>
                <div>
                  <div className="text-[14px] font-medium leading-snug" style={{ color: t.ink }}>{d.d}</div>
                  <div className="mt-1 text-[12.5px] leading-snug" style={{ color: t.fgMute }}>{d.why}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Open flags, what we haven't verified yet, said out loud"
        sub="Each flag names its next action · status as of Jul 28, 2026 (post-Q2 print)"
      >
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {FLAGS.map((f) => {
            const resolved = f.status.startsWith("RESOLVED");
            return (
              <div key={f.flag} className="flex items-start gap-4 px-5 py-4" style={{ background: t.surface }}>
                <span
                  className="mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em]"
                  style={{
                    color: resolved ? "#166534" : "#92400e",
                    background: resolved ? "rgba(22,101,52,0.10)" : "rgba(146,64,14,0.10)",
                  }}
                >
                  {resolved ? "resolved" : "open"}
                </span>
                <div>
                  <div className="text-[14px] font-medium" style={{ color: t.ink }}>{f.flag}</div>
                  <div className="mt-0.5 text-[12.5px] leading-snug" style={{ color: t.fgMute }}>{f.status.replace(/^(RESOLVED|OPEN|PARTIAL)[:,.]? ?/, "")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        title="What would change our mind, committed in advance"
        sub="Falsifiers named before the evidence arrives, so a good quarter can't quietly rewrite the thesis"
      >
        <ol className="list-decimal space-y-2.5 pl-5">
          {FALSIFIERS.map((f) => (
            <li key={f} className="text-[14.5px] leading-relaxed" style={{ color: t.ink2 }}>{f}</li>
          ))}
        </ol>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: t.fgMute }}>
          If these show up, the two-sided call changes, that is the point of
          writing them down first. Q2 2026 (Jul 28) was the first test, and{" "}
          <b>falsifiers №1 and №2 triggered</b>: ~184% ex-affiliate growth and
          $226M of operating cash flow with related-party revenue near zero.
          The call is under formal review, scored in public on the{" "}
          <a href="/scorecard" className="underline underline-offset-2" style={{ color: t.accent }}>Scorecard</a>,
          not quietly patched.
        </p>
      </Card>

      <p className="mt-8 text-[12.5px]" style={{ color: t.fgMute }}>
        The full record lives in the <a href="/vault" className="underline underline-offset-2" style={{ color: t.accent }}>knowledge bank</a>:
        287 linked notes, each carrying its source and status. Educational
        research, not investment advice.
      </p>
    </div>
  );
}
