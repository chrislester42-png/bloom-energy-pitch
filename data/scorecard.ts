// Pre-registered Q2 2026 earnings scorecard.
//
// RULES (fixed in advance, see /scorecard):
//  - The ranges below were committed to public git history BEFORE the
//    Q2 2026 print (Jul 28, 2026, pre-market). The commit adding this file
//    is the proof, it must predate the release.
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
  reported: string | null; // filled after the print, null until then
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
    why: "Our model assumed sales grow ~70% this year. A quarter near $900M+ means the company is running ahead of even the optimists, and ahead of us.",
    reported: "$1,065.4M (+165.5%)",
    verdict: "miss",
  },
  {
    metric: "Arm's-length growth (ex-affiliate)",
    street: "Q1 2026: ~17%",
    range: "8 – 20% YoY",
    why: "Strip out sales to Bloom's own funding partners: if what's left is growing much faster than ~15% a year, the strongest argument for our \"don't buy\" call starts to break. We calculate this ourselves from the fine print, whether or not the company highlights it.",
    falsifier: 1,
    reported: "~184% YoY: (1,065.4−2.8) vs (401.2−27.1)",
    verdict: "miss",
  },
  {
    metric: "Related-party share of revenue",
    street: "Q1 2026: ~50%",
    range: "40 – 55%",
    why: "Half of recent sales went to partners Bloom helped fund, like selling cars to a dealership you co-own. Below 40% means truly independent buyers are taking over.",
    reported: "0.3%: $2.8M of $1,065.4M (release footnote 1)",
    verdict: "miss",
  },
  {
    metric: "Product gross margin (non-GAAP)",
    street: "FY2025: ~37%",
    range: "33 – 38%",
    why: "The best evidence Bloom can keep cutting costs as fast as it grows. Below 33% breaks a key assumption in our model; above 38% strengthens the bulls.",
    reported: "37.2% (non-GAAP)",
    verdict: "hit",
  },
  {
    metric: "EPS, non-GAAP diluted",
    street: "street: $0.36",
    range: "$0.28 – 0.48",
    why: "Wide on purpose, quarterly earnings-per-share bounces around here for accounting reasons. Direction matters more than the exact cent.",
    reported: "$0.78 (GAAP $0.62)",
    verdict: "miss",
  },
  {
    metric: "Cash from operations",
    street: "Q1 2026: $74M",
    range: "$0 – 120M",
    why: "Profit on paper is one thing, we're watching whether real cash comes in the door without Bloom's own funding partners supplying it.",
    falsifier: 2,
    reported: "$226.4M, with related-party revenue near zero",
    verdict: "miss",
  },
  {
    metric: "Capex as % of revenue",
    street: "Q1 2026: 3.5%",
    range: "3 – 6%",
    why: "Bloom claims each new gigawatt of factory capacity costs only ~$100M to add. A sustained jump in spending would be the early sign that scaling is pricier than advertised.",
    falsifier: 5,
    reported: "4.8%: $51.6M on $1,065.4M",
    verdict: "hit",
  },
  {
    metric: "FY2026 revenue guidance",
    street: "now $3.4 – 3.8B",
    range: "Reaffirmed, or raised ≤ 10%",
    why: "High-priced stocks feed on raised forecasts. We bet management would stay inside its existing range; a raise past $4B forces our own growth numbers up.",
    reported: "Raised to $3.9–4.2B (+12.5% at midpoint); non-GAAP EPS guided $2.55–2.85",
    verdict: "miss",
  },
];

/** Written verdict, filled in after grading. Keep null before the print. */
export const postPrintVerdict: string | null =
  "2 of 8 inside our pre-registered ranges, and we own every miss. The quarter broke bullish, hard: " +
  "$1.07B of revenue (+165%), $0.78 non-GAAP EPS, $226M of operating cash flow, and guidance raised past " +
  "our ceiling. Two of our five falsifiers triggered in the same print, arm's-length growth (~184% ex-affiliate, " +
  "with related-party revenue collapsing to $2.8M) and cash generation standing without affiliate collections: " +
  "so, per the rule we fixed in advance, the two-sided call is now under formal review on the Process page. " +
  "What we got right: the margin discipline (37.2% product margin, inside our band) and capital-light scaling " +
  "(4.8% capex). The franchise behaved exactly as modeled; the growth broke every ceiling we set. One open item " +
  "carries to the 10-Q: how much of the quarter's product revenue went to Brookfield-financed projects that sit " +
  "outside the GAAP related-party definition. The classification changed, and we want the substance, not the label. " +
  "What does NOT change automatically: the valuation question. At ~$226 the price still requires the frontier's " +
  "hypergrowth path, but a company that just doubled its guidance is a different company than our base case, and " +
  "the review will re-run the model on these numbers rather than defend the old ones. That is what the scorecard is for.";
