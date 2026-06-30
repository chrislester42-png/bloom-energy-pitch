// Section content for the Bloom pitch site.
// Sourced from the Obsidian research vault (02 Atomic Notes / 01 Sources).
// Keep copy punchy — slide logic, not essays.

export interface Fact {
  value: string;
  label: string;
  source: string; // primary source (for the citation chip)
}

export const whyNow = {
  eyebrow: "01 · Why now",
  headline: "AI's power crunch has no easy fix.",
  dek: "Hyperscalers can spend; they can't wait for the grid. Power, not chips, is the bottleneck.",
  facts: [
    { value: "82 → 153 GW", label: "US data-center demand, 2025→2028", source: "McKinsey" },
    { value: "~$375B", label: "Amazon + Google 2026 AI capex", source: "Q4 2025 call" },
    { value: "90 days vs 3–5 yrs", label: "Bloom install vs gas-turbine lead time", source: "SemiAnalysis / Utility Dive" },
    { value: "$50B → 3×", label: "Brookfield AI spend, tripling in 3 yrs", source: "Q3 2025 call" },
  ] as Fact[],
};

export const whatBloomIs = {
  eyebrow: "02 · What Bloom is",
  headline: "Shippable power blocks, online in months.",
  dek: "Solid-oxide fuel cells that make clean power on-site from existing-pipeline gas — no combustion, no grid wait.",
  facts: [
    { value: "325 kW", label: "modular base block (~300 = a 100 MW site)", source: "Heat Capture datasheet" },
    { value: "53–65%", label: "electrical efficiency (Server 6.5)", source: "Server 6.5 datasheet" },
    { value: "100 MW", label: "power per acre (~2× a gas-turbine site)", source: "Check-in memo" },
    { value: ">800°C", label: "SOFC reaction — no precious-metal catalyst", source: "Server brochure / DOE" },
  ] as Fact[],
};

export const moat = {
  eyebrow: "03 · The moat",
  headline: "A 17-year head start nobody can buy.",
  dek: "Time, data, and a service annuity compound into a lead competitors can't shortcut.",
  facts: [
    { value: "~17 yrs", label: "SOFC head start; ~1.8 GW fleet deployed", source: "Doosan-Ceres SOP / 10-K" },
    { value: "100%", label: "service attach rate — every box, an annuity", source: "Q1 2026 call" },
    { value: "1T+ cell-hrs", label: "6B data points/day feed a per-stack digital twin", source: "Q4 2025 call" },
    { value: "10×", label: "volume at the same shop-floor headcount", source: "Q1 2026 call" },
  ] as Fact[],
};

export const financials = {
  eyebrow: "04 · Financials",
  headline: "The inflection is finally on the P&L.",
  dek: "After 17 years of losses, Q1 2026 was the first sustained profit — and 2026 guidance implies an ~80% revenue step-up.",
  facts: [
    { value: "$2.02B", label: "FY2025 revenue (+37% YoY)", source: "FY2025 10-K" },
    { value: "$3.4–3.8B", label: "2026 revenue guidance (~+80%)", source: "Q1 2026 release" },
    { value: "$143M", label: "Q1 2026 adj. EBITDA (~6× YoY)", source: "Q1 2026 release" },
    { value: "~$20B", label: "total backlog ($6B product, ~$14B service)", source: "FY2025 10-K" },
  ] as Fact[],
};

export const catalysts = {
  eyebrow: "05 · Catalysts",
  headline: "A backlog of gigawatt-scale anchors.",
  dek: "The deals are signed, the logos are real, and capacity is being built to meet them.",
  deals: [
    { partner: "Oracle", terms: "up to 2.8 GW · ~$8–9B lifetime", note: "Project Jupiter switched from turbines", source: "Bloom-Oracle PR" },
    { partner: "AEP", terms: "1 GW · ~$2.65B", note: "powering AWS behind the meter", source: "Bloom-AEP PR" },
    { partner: "Brookfield", terms: "$5B · 1 GW", note: "preferred provider across $1T portfolio", source: "Brookfield PR" },
    { partner: "SK ecoplant", terms: "500 MW · $4.5B JV", note: "400 MW already deployed", source: "SK PR" },
    { partner: "Nebius", terms: "~$2.6B · 250 MW", note: "neo-cloud, guaranteed (May 2026)", source: "Nebius agreement" },
  ],
  facts: [
    { value: "6 vs 1", label: "hyperscale/neo-cloud customers vs a year earlier", source: "Q4 2025 call" },
    { value: "2 GW", label: "capacity by YE2026 (expandable to 5 GW)", source: "Utility Dive" },
    { value: "800V DC", label: "transition Bloom is built for — copper/transformer limits", source: "Q1 2026 call" },
  ] as Fact[],
};

export interface Risk {
  claim: string;
  detail: string;
  rebuttal: string;
  source: string;
}

export const risks = {
  eyebrow: "06 · The risks",
  headline: "Priced for perfection — and leaning on related parties.",
  dek: "We're not naive. Here's the bear case, and the honest counter to each point.",
  items: [
    {
      claim: "~50% related-party revenue",
      detail: "Q1 2026: $373M from SK + Brookfield JVs — not arm's-length. Top-3 customers were 53% of FY2024.",
      rebuttal: "Hyperscale customers went 1 → 6 in a year; more than half of data-center backlog is now non-Oracle.",
      source: "Q1 2026 release / FY2024 10-K",
    },
    {
      claim: "~80× book, >600× EV/EBITDA",
      detail: "At a ~$79B cap the stock prices in flawless execution. One bear PT sits at $149.93 (~-43%).",
      rebuttal: "Forward EBITDA guidance ($650–800M) compresses the multiple fast — if the backlog converts.",
      source: "24/7 Wall St",
    },
    {
      claim: "$4B accumulated deficit",
      detail: "Seventeen years without sustainably earning its cost of capital. Q1 2026 was the first sustained profit.",
      rebuttal: "The service segment just inflected to 13% GAAP margin — the annuity is starting to pay.",
      source: "FY2025 10-K",
    },
    {
      claim: "Degradation & dilution",
      detail: "Hindenburg (2019) flagged stack life vs warranty; a $2.5B convertible adds dilution risk.",
      rebuttal: "Trillion-cell-hour digital twin now drives predictive maintenance behind the margin turn.",
      source: "Hindenburg / Q1 2026 release",
    },
  ] as Risk[],
};

export const theCall = {
  eyebrow: "07 · The call",
  headline: "A real franchise at an unforgiving price.",
  dek: "Bloom crossed a genuine inflection — but today's price already pays for the bull case. Drag the assumptions and decide what you have to believe.",
  conclusion:
    "Great company, demanding valuation. The position sizes to how much of the ~$20B backlog you believe converts at margin — and how much you trust revenue that's still half related-party. We land constructive but disciplined: own the inflection, respect the price.",
  note: "Scenario outputs are model-derived and provisional — they move with the assumptions and will be refined as the model work continues.",
};

// Market reference — fallback when the live quote hasn't loaded.
// Refreshed from FactSet (Q1 2026). The live Finnhub quote overrides this.
export const market = {
  capProvisional: 88.24e9, // ~$88B (FactSet, Q1 2026)
  asOf: "Q1 2026",
  source: "FactSet",
  bearPT: 149.93, // 24/7 Wall St bear case
  consensusPT: 282.16, // FactSet consensus mean target
};

export interface SourceRow {
  title: string;
  publisher: string;
  url: string;
}

export const sources: SourceRow[] = [
  { title: "Bloom Energy FY2025 10-K", publisher: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0001664703/000162828026006516/be-20251231.htm" },
  { title: "Bloom Energy Q1 2026 10-Q", publisher: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0001664703/000162828026028021/be-20260331.htm" },
  { title: "Q1 2026 Earnings Release", publisher: "Bloom Energy IR", url: "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-Reports-Record-First-Quarter-2026-Results-and-Raises-Full-Year-2026-Guidance/default.aspx" },
  { title: "Bloom–Oracle Expansion (up to 2.8 GW)", publisher: "Bloom Energy", url: "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-and-Oracle-Expand-Strategic-Partnership-to-Deploy-up-to-2-8-GW-to-Accelerate-AI-Infrastructure-Build-Out/default.aspx" },
  { title: "Bloom–AEP 1 GW Procurement", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/news/bloom-energy-announces-gigawatt-fuel-cell-procurement-agreement-with-aep-to-power-ai-data-centers/" },
  { title: "Brookfield–Bloom $5B Partnership", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/news/brookfield-and-bloom-energy-announce-5-billion-strategic-ai-infrastructure-partnership/" },
  { title: "Bloom–SK ecoplant Partnership", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/news/bloom-energy-and-sk-ecoplant-expand-highly-successful-power-generation-partnership-and-invest-to-establish-market-leadership-in-the-hydrogen-economy/" },
  { title: "Hindenburg 2019 Short Report", publisher: "Hindenburg Research", url: "https://hindenburgresearch.com/bloom-energy-a-clean-energy-darling-wilting-to-its-demise/" },
  { title: "JPMorgan Upgrade (fuel-cell ITC)", publisher: "Benzinga", url: "https://www.benzinga.com/analyst-stock-ratings/analyst-color/25/07/46326883/fuel-cell-tax-perk-could-supercharge-bloom-energy-in-2026-says-jpmorgan" },
  { title: "Valuation Analysis", publisher: "24/7 Wall St", url: "https://247wallst.com/investing/2026/05/21/bloom-energys-rally-may-have-pushed-the-stock-too-far/" },
  { title: "AI Power Bottlenecks", publisher: "SemiAnalysis", url: "https://newsletter.semianalysis.com/p/how-ai-labs-are-solving-the-power" },
  { title: "Bloom Energy Server 6.5 Datasheet", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/wp-content/uploads/bloom-energy-server-datasheet-feb-2026.pdf" },
];
