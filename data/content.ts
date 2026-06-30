// Section content for the Bloom pitch site.
// Sourced from the Obsidian research vault (02 Atomic Notes / 01 Sources).
// Keep copy punchy — slide logic, not essays.

export interface Fact {
  value: string;
  label: string;
  source: string; // primary source (for the citation chip)
}

export const thesis = {
  eyebrow: "00 · The thesis",
  headline: "A real franchise, at an unforgiving price.",
  statement:
    "Bloom is the only company that can drop clean, gigawatt-scale power next to an AI data center in months instead of years — and after 17 years of losses it just crossed into sustained profit with a ~$20B backlog behind it. The debate isn't whether it's a real franchise; it's whether today's price already pays for everything that has to go right.",
  bull: [
    "Signed hyperscale demand — Oracle, AEP, Brookfield — into an AI power crunch the grid can't fix in time.",
    "A 17-year head start, a 100% service attach rate, and a trillion-cell-hour data moat competitors can't shortcut.",
    "The margin inflection is finally on the P&L: first sustained profit, service segment turning, ~80% revenue step-up guided.",
  ],
  bear: [
    "Priced for perfection — ~80× book, >600× EV/EBITDA — with little room for a stumble.",
    "About half of revenue is related-party (SK + Brookfield JVs); quality-of-revenue is a fair question.",
    "Install gross margin is still negative, and ~91% of the fleet runs on natural gas at gas-turbine emissions parity.",
  ],
  call:
    "Constructive but disciplined: own the inflection, respect the price. The position sizes to how much of the backlog you believe converts at margin — and how much you trust revenue that's still half related-party.",
  toc: [
    { n: "01", label: "Why now", href: "#why-now" },
    { n: "02", label: "What Bloom is", href: "#what" },
    { n: "03", label: "The moat", href: "#moat" },
    { n: "04", label: "The field", href: "#competition" },
    { n: "05", label: "Financials", href: "#financials" },
    { n: "06", label: "Catalysts", href: "#catalysts" },
    { n: "07", label: "The risks", href: "#risks" },
    { n: "08", label: "The call", href: "#the-call" },
  ],
};

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

export interface FieldRow {
  name: string;
  role: string;
  point: string;
  caveat: string;
  source: string;
}

export const competition = {
  eyebrow: "04 · The field",
  headline: "Built for speed today — the real debate is durability.",
  dek: "Bloom wins the AI-power land grab on speed and density. The honest question isn't who it beats now, but what happens when the bottleneck clears.",
  rows: [
    {
      name: "Gas turbines (CCGT)",
      role: "The real alternative",
      point: "3–5+ yr interconnect/turbine queues vs Bloom's 90–120-day install. Bloom now competes head-to-head with CCGT on multi-gigawatt projects and is cost-competitive with grid power in most US markets.",
      caveat: "If turbine and interconnect queues clear, Bloom's speed premium narrows — the core durability risk.",
      source: "SemiAnalysis / Q1 2026 call",
    },
    {
      name: "Nuclear / SMR",
      role: "Not yet a competitor",
      point: "Timeline mismatch: SMRs are a 2030s story; AI power is needed now. Bloom fills the gap the next decade can't.",
      caveat: "A genuine long-term substitute if SMR economics and schedules ever arrive.",
      source: "SMR timeline note",
    },
    {
      name: "Other fuel cells",
      role: "Sub-scale or exiting",
      point: "Plug (PEM, 40–60%, backup-only, 25+ yrs without profit), FuelCell Energy (MCFC, sub-scale), Doosan (50 MW/yr, Ceres-licensed), Mitsubishi MEGAMIE (250 kW, Japan-only). Bosch exited SOFC entirely in Feb 2025.",
      caveat: "A licensee like Doosan/Ceres scaling SOFC is the one to watch.",
      source: "Doosan-Ceres / H2View",
    },
    {
      name: "The grid",
      role: "The status quo it displaces",
      point: "Behind-the-meter generation sidesteps interconnection queues entirely; Bloom's microgrid needs no grid, diesel, batteries, or turbines, with a reactive-power range turbines can't match.",
      caveat: "Where the grid is cheap and available, on-site power is a harder sell.",
      source: "Q1 2026 call / Tech page",
    },
  ] as FieldRow[],
  facts: [
    { value: "~17 yrs", label: "SOFC head start vs nearest competitor", source: "Doosan-Ceres SOP" },
    { value: "90–120 days", label: "install vs gas-turbine 3–5+ yr lead time", source: "SemiAnalysis" },
    { value: "100 MW/acre", label: "power density (~2× a gas-turbine site)", source: "Heat Capture datasheet" },
    { value: "679–839", label: "lb CO₂/MWh on natural gas — at gas-turbine parity", source: "NG-SOFC emissions note" },
  ] as Fact[],
};

export const financials = {
  eyebrow: "05 · Financials",
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
  eyebrow: "06 · Catalysts",
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
  eyebrow: "07 · The risks",
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
  eyebrow: "08 · The call",
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
