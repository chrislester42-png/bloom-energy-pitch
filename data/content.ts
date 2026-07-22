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
    "Signed hyperscale demand — Oracle, AEP, a Brookfield framework now at $25B — into an AI power crunch the grid can't fix in time.",
    "A 17-year head start, a 100% service attach rate, and a trillion-cell-hour data moat competitors can't shortcut.",
    "The margin inflection is finally on the P&L: first sustained profit, service segment turning, ~80% revenue step-up guided.",
  ],
  bear: [
    "Priced for perfection — ~80× book, >600× EV/EBITDA — with little room for a stumble.",
    "About half of revenue is related-party (SK + Brookfield JVs); quality-of-revenue is a fair question.",
    "Install gross margin is still negative, and ~91% of the fleet runs on natural gas at gas-turbine emissions parity.",
  ],
  // The explicit stance, stated up front. The Thesis component prefixes this
  // with the live two-sided rating ("Sell / avoid at $X — buy below $Y").
  call:
    "We like the company and won't pay this price for it. At today's level a buyer earns a negative-to-low return even if the full bull case plays out; below the trigger, the same bull case pays our 12% hurdle. Between those prices we simply wait.",
  toc: [
    { n: "01", label: "What Bloom is", href: "#what" },
    { n: "02", label: "Recent news", href: "#news" },
    { n: "03", label: "Why now", href: "#why-now" },
    { n: "04", label: "The field", href: "#competition" },
    { n: "05", label: "The moat", href: "#moat" },
    { n: "06", label: "Financials", href: "#financials" },
    { n: "07", label: "Catalysts", href: "#catalysts" },
    { n: "08", label: "Valuation", href: "#valuation" },
    { n: "09", label: "The risks", href: "#risks" },
    { n: "10", label: "The call", href: "#the-call" },
  ],
};

export const whyNow = {
  eyebrow: "03 · Why now",
  headline: "AI's power crunch has no easy fix.",
  dek: "The cloud giants (Amazon, Google, Microsoft) have the money; what they can't get fast is electricity. Power, not chips, is the real bottleneck for AI.",
  facts: [
    { value: "82 → 153 GW", label: "how much power US data centers will need, 2025→2028 — nearly doubling (1 GW ≈ 750,000 homes)", source: "McKinsey" },
    { value: "~$375B", label: "Amazon + Google's planned 2026 spending on AI", source: "Q4 2025 call" },
    { value: "90 days vs 3–5 yrs", label: "how fast Bloom installs vs the wait for a gas turbine", source: "SemiAnalysis / Utility Dive" },
    { value: "$50B → 3×", label: "Brookfield AI spend, tripling in 3 yrs", source: "Q3 2025 call" },
  ] as Fact[],
};

export const whatBloomIs = {
  eyebrow: "01 · What Bloom is",
  headline: "Shippable power blocks, online in months.",
  dek: "Bloom makes fuel cells — boxes that turn natural gas into electricity through a chemical reaction instead of burning it — installed right next to the building that needs power. No smokestack, and no multi-year wait for the utility grid.",
  facts: [
    { value: "325 kW", label: "one shippable building block; about 300 of them make a 100-megawatt site — enough to power a small city or an AI data center", source: "Heat Capture datasheet" },
    { value: "54% → >90%", label: "share of the gas's energy that becomes electricity — rising past 90% once the leftover heat (above 350°C) is captured for cooling or heating instead of wasted", source: "Heat Capture brochure" },
    { value: "100 MW", label: "of power per acre of land — about twice what a gas-turbine plant fits in the same space", source: "Check-in memo" },
    { value: ">800°C", label: "how hot the cells run — hot enough to skip the costly precious-metal catalysts other fuel cells need", source: "Server brochure / DOE" },
  ] as Fact[],
};

export interface NewsItem {
  date: string; // display date
  tag: "Deal" | "Earnings" | "Analyst" | "Product";
  title: string;
  blurb: string;
  source: string;
}

export const recentNews = {
  eyebrow: "02 · Recent news",
  headline: "Twelve months that changed the story.",
  dek: "Press releases, earnings, and the contracts behind the backlog — newest first. This is the tape an analyst refreshes the model against.",
  items: [
    {
      date: "Jul 8–9, 2026",
      tag: "Analyst",
      title: "Hunterbrook short report — and Bloom's same-day rebuttal",
      blurb: "A short seller alleges China-linked scandium sourcing and re-hammers backlog vs firm orders; Bloom's 8-K calls it \"false and misleading\" and claims supply visibility for 25 GW/yr. The stock fell ~6%, then recovered on the rebuttal.",
      source: "Hunterbrook / Bloom 8-K",
    },
    {
      date: "Jun 30, 2026",
      tag: "Deal",
      title: "Brookfield expands partnership fivefold: $5B → $25B",
      blurb: "The financing framework for Bloom-powered AI projects grows 5× in under nine months, drawn from Brookfield's $100B AI Infrastructure Fund. A framework, not firm orders — but the capital behind the pipeline is now much deeper.",
      source: "Brookfield–Bloom PR",
    },
    {
      date: "May 2026",
      tag: "Deal",
      title: "Nebius signs guaranteed ~$2.6B agreement",
      blurb: "250 MW for the AI neo-cloud — a guaranteed offtake, not a framework, and Bloom's first anchor outside the hyperscale majors.",
      source: "Nebius agreement",
    },
    {
      date: "Apr 28, 2026",
      tag: "Earnings",
      title: "Record Q1 2026; FY guidance raised",
      blurb: "First sustained profit after 17 years: $143M adj. EBITDA (~6× YoY) and 2026 revenue guided to $3.4–3.8B — an ~80% step-up.",
      source: "Q1 2026 release",
    },
    {
      date: "Apr 2026",
      tag: "Deal",
      title: "Oracle expands to up to 2.8 GW (~$8–9B lifetime)",
      blurb: "Project Jupiter switched from gas turbines to Bloom — the largest fuel-cell commitment ever, and a head-to-head win against the incumbent technology.",
      source: "Bloom–Oracle PR",
    },
    {
      date: "Feb 5, 2026",
      tag: "Earnings",
      title: "FY2025: revenue $2.02B, +37%",
      blurb: "Full-year gross margin reached ~29% and the service segment turned profitable — the inflection the bulls had been waiting for.",
      source: "Q4 2025 call / FY2025 10-K",
    },
    {
      date: "Nov 2025",
      tag: "Deal",
      title: "AEP orders 1 GW (~$2.65B)",
      blurb: "The largest commercial fuel-cell procurement at signing — utility-scale units powering AWS data centers before the meter.",
      source: "Bloom–AEP PR",
    },
    {
      date: "Oct 13, 2025",
      tag: "Deal",
      title: "Brookfield launches $5B AI-infrastructure partnership",
      blurb: "Bloom named preferred on-site power provider across Brookfield's $1T portfolio, with an initial 1 GW commitment.",
      source: "Brookfield PR",
    },
    {
      date: "Jul 2025",
      tag: "Analyst",
      title: "JPMorgan upgrades on fuel-cell tax credit",
      blurb: "The restored 30% investment tax credit for fuel cells under OBBBA cuts Bloom's effective cost ~25% — sell-side turns constructive.",
      source: "Benzinga",
    },
  ] as NewsItem[],
};

export const moat = {
  eyebrow: "05 · The moat",
  headline: "A 17-year head start nobody can buy.",
  dek: "Time, data, and a service annuity compound into a lead competitors can't shortcut.",
  facts: [
    { value: "~17 yrs", label: "lead in this fuel-cell tech (called SOFC); ~1.8 GW already installed — roughly a mid-size city's worth of power", source: "Doosan-Ceres SOP / 10-K" },
    { value: "100%", label: "service attach rate — every box sold also signs a long-term service contract", source: "Q1 2026 call" },
    { value: "1T+ cell-hrs", label: "over a trillion hours of run-data; 6 billion sensor readings a day train a digital model of each unit to predict maintenance before it fails", source: "Q4 2025 call" },
    { value: "~$127M", label: "recurring service revenue per deployed GW — the annuity compounds with the fleet", source: "FY2025 (derived)" },
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
  eyebrow: "04 · The field",  // industry & market positioning
  headline: "Built for speed today — the real debate is durability.",
  dek: "Bloom wins the AI-power land grab on speed and density. The honest question isn't who it beats now, but what happens when the bottleneck clears.",
  rows: [
    {
      name: "Gas turbines",
      role: "The real alternative",
      point: "The standard way to make on-site power (a \"combined-cycle gas turbine,\" or CCGT) takes 3–5+ years to order a turbine and get hooked up. Bloom installs in 90–120 days, now goes head-to-head with turbines on the biggest projects, and matches grid prices in most US markets.",
      caveat: "The core long-term risk — but relief isn't near: gas-turbine supply is largely sold out through ~2029–2030, so Bloom's speed edge holds for several more years before the real pivot.",
      source: "SemiAnalysis / Q1 2026 call",
    },
    {
      name: "Nuclear / SMR",
      role: "Not yet a competitor",
      point: "Small modular reactors (SMRs) — compact next-gen nuclear — are a 2030s story; AI needs power now. Bloom fills the gap the next decade can't.",
      caveat: "A genuine long-term substitute if SMR costs and timelines ever arrive.",
      source: "SMR timeline note",
    },
    {
      name: "Other fuel cells",
      role: "Sub-scale or exiting",
      point: "Rivals use different, weaker chemistries: Plug (backup-only, 25+ yrs without a profit), FuelCell Energy (small-scale), Doosan (50 MW/yr, licensed tech), Mitsubishi (a 250 kW product sold only in Japan). Bosch quit fuel cells entirely in Feb 2025.",
      caveat: "Doosan scaling up its licensed solid-oxide line is the one to watch.",
      source: "Doosan-Ceres / H2View",
    },
    {
      name: "The grid",
      role: "The status quo it displaces",
      point: "Making power on-site skips the years-long wait to connect to the utility grid; Bloom's setup needs no grid, no diesel, no batteries, no turbines. Each box does still need a gas line — \"off-grid\" means off the electric grid, not off fuel.",
      caveat: "At roughly $121 to make an hour of power, Bloom still costs more than buying from the grid — so it sells speed, not price. Where the grid is cheap and available, it's a harder sell.",
      source: "Q1 2026 call / Tech page",
    },
  ] as FieldRow[],
  facts: [
    { value: "~$121/MWh", label: "the all-in cost to make one unit of power (a megawatt-hour); about $95 after a federal tax credit. Cheaper than a backup generator, still pricier than the grid", source: "Driver Tree (derived)" },
    { value: "90–120 days", label: "to install and switch on — versus 3–5+ years for a gas turbine", source: "SemiAnalysis" },
    { value: "100 MW/acre", label: "power packed into an acre of land — about double a gas-turbine plant", source: "Heat Capture datasheet" },
    { value: "679–839", label: "pounds of CO₂ per unit of power on gas — about the same carbon as a regular gas power plant", source: "NG-SOFC emissions note" },
  ] as Fact[],
};

export const financials = {
  eyebrow: "06 · Financials",
  headline: "The inflection is finally on the P&L.",
  dek: "After 17 years of losses, Q1 2026 was the first sustained profit — and 2026 guidance implies an ~80% revenue step-up.",
  facts: [
    { value: "$2.02B", label: "FY2025 revenue (+37% YoY)", source: "FY2025 10-K" },
    { value: "$3.4–3.8B", label: "2026 revenue guidance (~+80%)", source: "Q1 2026 release" },
    { value: "$143M", label: "Q1 2026 adj. EBITDA (~6× YoY)", source: "Q1 2026 release" },
    { value: "~$100M", label: "to add each additional gigawatt of factory capacity — today's plants scale toward 5 GW without building a new one, so growth is capital-light", source: "Q1 2026 call" },
  ] as Fact[],
};

export const catalysts = {
  eyebrow: "07 · Catalysts",
  headline: "A backlog of gigawatt-scale anchors.",
  dek: "The deals are signed, the logos are real, and factory capacity is being built to meet them. (One gigawatt — GW — is enough to power roughly 750,000 homes.)",
  deals: [
    { partner: "Oracle", terms: "up to 2.8 GW · ~$8–9B lifetime", note: "Project Jupiter switched from gas turbines to Bloom", source: "Bloom-Oracle PR" },
    { partner: "AEP", terms: "1 GW · ~$2.65B", note: "powering AWS on-site, before the utility meter", source: "Bloom-AEP PR" },
    { partner: "Brookfield", terms: "$25B framework · 1 GW initial", note: "expanded 5× from $5B in June 2026; preferred provider across $1T portfolio", source: "Brookfield PR (Jun 2026)" },
    { partner: "SK ecoplant", terms: "500 MW · $4.5B JV", note: "400 MW already deployed", source: "SK PR" },
    { partner: "Nebius", terms: "~$2.6B · 250 MW", note: "neo-cloud, guaranteed (May 2026)", source: "Nebius agreement" },
  ],
  facts: [
    { value: "6 vs 1", label: "big-cloud and AI-cloud customers, up from just one a year earlier", source: "Q4 2025 call" },
    { value: "2 GW", label: "of annual factory capacity by end-2026 — and the plants can stretch to 5 GW", source: "Utility Dive" },
    { value: "800V DC", label: "the new power standard AI server racks are moving to — Bloom's boxes already put it out directly", source: "Q1 2026 call" },
    { value: "~$20B", label: "of signed backlog behind the anchors above — roughly $6B in equipment plus ~$14B of long-term service", source: "FY2025 10-K" },
  ] as Fact[],
};

export interface Risk {
  claim: string;
  detail: string;
  rebuttal: string;
  source: string;
}

export const risks = {
  eyebrow: "09 · The risks",
  headline: "Priced for perfection — and leaning on related parties.",
  dek: "We're not naive. Here's the bear case, and the honest counter to each point.",
  items: [
    {
      claim: "Half the revenue isn't arm's-length",
      detail: "Strip out the affiliate channel and Q1 2026's reported 130% growth is ~17%: $377.8M arm's-length (+16.9%) vs $373.3M into the Brookfield/SK JVs. Bloom effectively helps finance the buyer of about half its own output, calls those sales \"arm's-length,\" yet doesn't disclose the margin split — and the June 2026 expansion just put 5× more capital ($25B) behind that same financed channel.",
      rebuttal: "Hyperscale customers went 1 → 6 in a year; more than half of data-center backlog is now non-Oracle — so the arm's-length engine is broadening.",
      source: "Q1 2026 release / Brookfield PR (derived)",
    },
    {
      claim: "~80× book, >600× EV/EBITDA",
      detail: "At a ~$79B cap the stock prices in flawless execution (one bear PT sits at $149.93, ~-43%). And the headline ~$20B backlog is mostly framework and pipeline — firm, booked orders (GAAP RPO) are only ~$441M of product and install (~$493M including service) as of Q1 2026; the rest converts only as purchase orders actually land.",
      rebuttal: "Forward EBITDA guidance ($650–800M) compresses the multiple fast — if that pipeline converts to real orders.",
      source: "24/7 Wall St / Q1 2026 10-Q",
    },
    {
      claim: "$4B accumulated deficit",
      detail: "Seventeen years without sustainably earning its cost of capital. Q1 2026 was the first sustained profit.",
      rebuttal: "The service segment just inflected to 13% GAAP margin — the annuity is starting to pay.",
      source: "FY2025 10-K",
    },
    {
      claim: "Shorts are circling: degradation, dilution — now scandium",
      detail: "Hindenburg (2019) flagged stack life vs warranty; a $2.5B convertible adds dilution risk. In July 2026 Hunterbrook alleged China-linked scandium sourcing (a supplier claiming to be Bloom's largest, plus trade data) and noted 5 GW of production would need ~220 of ~240 projected global tons of scandium oxide a year.",
      rebuttal: "Bloom's 8-K rejects the claims: sourcing is diversified across countries via proprietary tailings recovery (titanium-processing waste, >half processed outside China), with claimed visibility to 25 GW/yr. On stack life, a steady 24/7 AI load is gentler than cycling, and the service segment has been profitable six straight quarters. The supplier list stays confidential — so the exposure can't be independently verified either way.",
      source: "Hunterbrook / Bloom 8-K (Jul 2026)",
    },
  ] as Risk[],
};

export const valuation = {
  eyebrow: "08 · Valuation",
  headline: "What does the price assume?",
  dek: "Our price targets come from a reverse DCF: instead of asking what Bloom is worth, we ask what the market's price already pays for — then set the entry price where even the full bull case still earns our hurdle return. Defaults are our completed model's assumptions; drag them and see what has to be true.",
  note: "Model-derived from the completed v5 workbook — educational research, not investment advice. The full lab (group DCF, per-year forecast table, scenario weighting, and the workbook's own rate–growth frontier) is one click deeper.",
};

export const theCall = {
  eyebrow: "10 · The call",
  headline: "A real franchise at an unforgiving price.",
  dek: "Bloom crossed a genuine inflection — but today's price already pays for the bull case. Drag the assumptions and decide what you have to believe.",
  conclusion:
    "Great company, demanding valuation. The position sizes to how much of the ~$20B backlog you believe converts at margin — and how much you trust revenue that's still half related-party. We land constructive but disciplined: own the inflection, respect the price.",
  note: "Scenario outputs derive from the completed v5 workbook (audited build, Jul 2026); the reverse-DCF frontier in the valuation lab is the formal version of this argument.",
};

// Market reference — fallback when the live quote hasn't loaded.
// Refreshed from FactSet (Q1 2026). The live Finnhub quote overrides this.
export const market = {
  capProvisional: 88.24e9, // ~$88B (FactSet, Q1 2026)
  asOf: "Q1 2026",
  source: "TipRanks, Jul 2026",
  bearPT: 149.93, // 24/7 Wall St bear case
  consensusPT: 287.05, // TipRanks 21-analyst mean, Jul 6 2026 (9 buy / 10 hold / 0 sell)
  // Individual firm targets, July 2026 — for the "street view" strip.
  streetPTs: [
    { firm: "UBS", pt: 350, note: "highest visible target", asOf: "Jul 2026" },
    { firm: "Susquehanna", pt: 298, note: "raised from $293", asOf: "Jul 2026" },
    { firm: "Consensus", pt: 287.05, note: "21 analysts · 9 buy / 10 hold / 0 sell", asOf: "Jul 2026" },
    { firm: "Jefferies", pt: 246, note: "raised from $207 — rating: Hold", asOf: "Jul 2026" },
    { firm: "24/7 Wall St", pt: 149.93, note: "published bear case (a publication, not a bank)", asOf: "May 2026" },
  ],
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
  { title: "Brookfield–Bloom $25B Expansion (Jun 2026)", publisher: "Business Wire", url: "https://www.businesswire.com/news/home/20260630023022/en/Brookfield-and-Bloom-Energy-Expand-AI-Infrastructure-Partnership-to-%2425-Billion-Fivefold-Increase-to-Build-and-Finance-Rapid-Power-for-AI-Infrastructure" },
  { title: "Hunterbrook Short Report (Jul 2026)", publisher: "Hunterbrook Media", url: "https://newsletter.hntrbrk.com/p/blooms-big-lie" },
  { title: "Bloom 8-K Rebuttal & Scandium Explainer", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/blog/demystifying-scandium-oxide-why-it-matters-in-bloom-fuel-cells/" },
  { title: "Bloom–SK ecoplant Partnership", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/news/bloom-energy-and-sk-ecoplant-expand-highly-successful-power-generation-partnership-and-invest-to-establish-market-leadership-in-the-hydrogen-economy/" },
  { title: "Hindenburg 2019 Short Report", publisher: "Hindenburg Research", url: "https://hindenburgresearch.com/bloom-energy-a-clean-energy-darling-wilting-to-its-demise/" },
  { title: "JPMorgan Upgrade (fuel-cell ITC)", publisher: "Benzinga", url: "https://www.benzinga.com/analyst-stock-ratings/analyst-color/25/07/46326883/fuel-cell-tax-perk-could-supercharge-bloom-energy-in-2026-says-jpmorgan" },
  { title: "Valuation Analysis", publisher: "24/7 Wall St", url: "https://247wallst.com/investing/2026/05/21/bloom-energys-rally-may-have-pushed-the-stock-too-far/" },
  { title: "AI Power Bottlenecks", publisher: "SemiAnalysis", url: "https://newsletter.semianalysis.com/p/how-ai-labs-are-solving-the-power" },
  { title: "Bloom Energy Server 6.5 Datasheet", publisher: "Bloom Energy", url: "https://www.bloomenergy.com/wp-content/uploads/bloom-energy-server-datasheet-feb-2026.pdf" },
];
