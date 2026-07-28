// Pre-registered Q2 2026 earnings scorecard.
//
// RULES (fixed in advance, see /scorecard):
//  - The ranges below were committed to public git history BEFORE the
//    Q2 2026 print (Jul 28, 2026, pre-market). The commit adding this file
//    is the proof — it must predate the release.
//  - Grading: reported inside the range = "hit", outside = "miss".
//    No partial credit, no re-interpretation, no edits to ranges.
//  - After the print, fill ONLY `reported` and `verdict` below (and the
//    written verdict), leaving every prediction untouched.
//  - If two or more falsifier rows break against the thesis, the two-sided
//    call is formally revisited on /process, in writing.

export interface ScoreRow {
  metric: string;
  street: string; // consensus / prior-quarter reference shown under the metric
  range: string; // our pre-registered range (display form)
  why: string;
  falsifier?: number; // which named falsifier this row tests (1-5), if any
  reported: string | null; // filled after the print — null until then
  verdict: "pending" | "hit" | "miss";
}

export const PRINT_DATE = "July 28, 2026 · pre-market";
export const COMMITTED = "July 27, 2026";
export const REPO_URL = "https://github.com/chrislester42-png/bloom-energy-pitch/commits/main";

export const scorecard: ScoreRow[] = [
  {
    metric: "Revenue",
    street: "street: $804M",
    range: "$780 – 860M",
    why: "Tracks the workbook's FY2026 path ($3.44B, +70%). Above $900M starts to justify the guidance-raise momentum the price already assumes.",
    reported: "$1,065.4M (+165.5%)",
    verdict: "miss",
  },
  {
    metric: "Arm's-length growth (ex-affiliate)",
    street: "Q1 2026: ~17%",
    range: "8 – 20% YoY",
    why: "Sustained ex-affiliate growth above the mid-teens is the single strongest challenge to the sell side of our call. We compute it from the related-party note whether or not it is highlighted.",
    falsifier: 1,
    reported: "~184% YoY — (1,065.4−2.8) vs (401.2−27.1)",
    verdict: "miss",
  },
  {
    metric: "Related-party share of revenue",
    street: "Q1 2026: ~50%",
    range: "40 – 55%",
    why: "The quality-of-revenue question. Below 40% means the arm's-length engine is broadening faster than we model.",
    reported: "0.3% — $2.8M of $1,065.4M (release footnote 1)",
    verdict: "miss",
  },
  {
    metric: "Product gross margin (non-GAAP)",
    street: "FY2025: ~37%",
    range: "33 – 38%",
    why: "The cost-down-versus-inflation test (channel C6). Below 33% breaks the terminal-margin anchor; above 38% strengthens the bull margin case.",
    reported: "37.2% (non-GAAP)",
    verdict: "hit",
  },
  {
    metric: "EPS, non-GAAP diluted",
    street: "street: $0.36",
    range: "$0.28 – 0.48",
    why: "Wide on purpose — quarterly EPS is noisy here (tax credits, converts). Direction matters more than the cent.",
    reported: "$0.78 (GAAP $0.62)",
    verdict: "miss",
  },
  {
    metric: "Cash from operations",
    street: "Q1 2026: $74M",
    range: "$0 – 120M",
    why: "What we are really watching is whether CFO stands without affiliate collections carrying it (disclosed in the related-party note).",
    falsifier: 2,
    reported: "$226.4M — with related-party revenue near zero",
    verdict: "miss",
  },
  {
    metric: "Capex as % of revenue",
    street: "Q1 2026: 3.5%",
    range: "3 – 6%",
    why: "A sustained step-up is the early signal that gigawatt scaling costs more than the claimed ~$100M/GW.",
    falsifier: 5,
    reported: "4.8% — $51.6M on $1,065.4M",
    verdict: "hit",
  },
  {
    metric: "FY2026 revenue guidance",
    street: "now $3.4 – 3.8B",
    range: "Reaffirmed, or raised ≤ 10%",
    why: "The price needs raises to keep compounding. We predict management stays inside the range; a raise past $4B would force our growth inputs up.",
    reported: "Raised to $3.9–4.2B (+12.5% at midpoint); non-GAAP EPS guided $2.55–2.85",
    verdict: "miss",
  },
];

/** Written verdict — filled in after grading. Keep null before the print. */
export const postPrintVerdict: string | null =
  "2 of 8 inside our pre-registered ranges — and we own every miss. The quarter broke bullish, hard: " +
  "$1.07B of revenue (+165%), $0.78 non-GAAP EPS, $226M of operating cash flow, and guidance raised past " +
  "our ceiling. Two of our five falsifiers triggered in the same print — arm's-length growth (~184% ex-affiliate, " +
  "with related-party revenue collapsing to $2.8M) and cash generation standing without affiliate collections — " +
  "so, per the rule we fixed in advance, the two-sided call is now under formal review on the Process page. " +
  "What we got right: the margin discipline (37.2% product margin, inside our band) and capital-light scaling " +
  "(4.8% capex) — the franchise behaved exactly as modeled; the growth broke every ceiling we set. One open item " +
  "carries to the 10-Q: how much of the quarter's product revenue went to Brookfield-financed projects that sit " +
  "outside the GAAP related-party definition — the classification changed, and we want the substance, not the label. " +
  "What does NOT change automatically: the valuation question. At ~$226 the price still requires the frontier's " +
  "hypergrowth path — but a company that just doubled its guidance is a different company than our base case, and " +
  "the review will re-run the model on these numbers rather than defend the old ones. That is what the scorecard is for.";
