// Section content for the Bloom pitch site.
// Sourced from the Obsidian research vault (02 Atomic Notes / 01 Sources).
// Keep copy punchy, slide logic, not essays.

export interface Fact {
  value: string;
  label: string;
  source: string; // primary source (for the citation chip)
  /** Evidence tier, per the research's discipline:
   *  R = reported primary · D = derived from primaries · E = estimate / third party */
  tier?: "R" | "D" | "E";
  /** Vault note id backing this figure, the chip deep-links to /vault#note=<id> */
  note?: string;
}

export const thesis = {
  eyebrow: "00 · The thesis",
  headline: "A real franchise, at an unforgiving price.",
  statement:
    "Bloom is the only company that can put city-sized amounts of clean power next to an AI data center in months instead of years. After 17 years of losses it's now solidly profitable, with about $20B of future business lined up. The question isn't whether Bloom is a great company. It's whether today's stock price already assumes everything goes perfectly.",
  bull: [
    "The biggest names in AI (Oracle, the utility powering Amazon's data centers, Brookfield's $25B fund) have signed up because the power grid can't hook them up fast enough.",
    "A 17-year technology head start, and every box sold comes with a long-term service contract, like selling the printer and the ink.",
    "The growth is no longer a promise: last quarter was Bloom's first billion-dollar quarter (+165%), it generated $226M of real cash, and revenue should roughly double this year.",
  ],
  bear: [
    "Still priced for near-perfection: even after July's 40% fall, the stock costs ~60× the earnings management itself forecasts for this year.",
    "Of the \"$20B of future business,\" only about $0.5B is firm signed orders, the rest are plans and frameworks. And the 10-Q gives two different answers on how independent last quarter's buyers were: $2.8M of related-party revenue in one note, a related-party customer at 21% of revenue in another.",
    "Installing the boxes still loses money, and 9 out of 10 run on natural gas, about the same carbon footprint as a gas power plant.",
  ],
  // The explicit stance, stated up front. The Thesis component prefixes this
  // with the live two-sided rating ("Sell / avoid at $X, buy below $Y").
  call:
    "We like the company and won't pay this price for it. At today's level a buyer earns a poor return even if the whole success story plays out; below the trigger, that same story pays our 12% minimum. Between those two prices, we simply wait.",
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
    { value: "82 → 153 GW", label: "how much power US data centers will need, 2025→2028, nearly doubling (1 GW ≈ 750,000 homes)", source: "McKinsey", tier: "E", note: "02 Atomic Notes/McKinsey US data center demand 82 to 153 GW" },
    { value: "~$375B", label: "Amazon + Google's planned 2026 spending on AI", source: "Q4 2025 call", tier: "E", note: "02 Atomic Notes/Amazon Google AI capex $375B+ for 2026" },
    { value: "90 days vs 3–5 yrs", label: "how fast Bloom installs vs the wait for a gas turbine", source: "SemiAnalysis / Utility Dive", tier: "E", note: "02 Atomic Notes/Speed to power vs gas turbine queue" },
    { value: "$50B → 3×", label: "Brookfield AI spend, tripling in 3 yrs", source: "Q3 2025 call", tier: "R", note: "02 Atomic Notes/Brookfield $50B AI already tripling next 3 years" },
  ] as Fact[],
};

export const whatBloomIs = {
  eyebrow: "01 · What Bloom is",
  headline: "Shippable power blocks, online in months.",
  dek: "Bloom makes fuel cells, boxes that turn natural gas into electricity through a chemical reaction instead of burning it, installed right next to the building that needs power. No smokestack, and no multi-year wait for the utility grid.",
  facts: [
    { value: "325 kW", label: "one shippable building block; about 300 of them make a 100-megawatt site, enough to power a small city or an AI data center", source: "Heat Capture datasheet", tier: "R", note: "02 Atomic Notes/325 kW base block is shippable unit" },
    { value: "54% → >90%", label: "share of the gas's energy that becomes electricity, rising past 90% once the leftover heat (above 350°C) is captured for cooling or heating instead of wasted", source: "Heat Capture brochure", tier: "R", note: "02 Atomic Notes/Heat Capture CHP raises total efficiency above 90 percent" },
    { value: "100 MW", label: "of power per acre of land, about twice what a gas-turbine plant fits in the same space", source: "Check-in memo", tier: "R", note: "02 Atomic Notes/100 MW per acre power density" },
    { value: ">800°C", label: "how hot the cells run, hot enough to skip the costly precious-metal catalysts other fuel cells need", source: "Server brochure / DOE", tier: "R", note: "02 Atomic Notes/SOFC operates above 800C" },
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
  dek: "Press releases, earnings, and the contracts behind the numbers, newest first. These are the events we update our math against.",
  items: [
    {
      date: "Jul 28, 2026",
      tag: "Earnings",
      title: "Record Q2: first billion-dollar quarter; guidance raised to $3.9–4.2B",
      blurb: "Revenue $1,065M (+165%), non-GAAP EPS $0.78 vs ~$0.36 expected, $226M operating cash flow, and related-party revenue collapsed to $2.8M from ~$373M in Q1: the call revealed the financing layer rotated to independent institutions (IDF/Oaktree). Management says backlog is growing faster than revenue. Two of our pre-set tripwires triggered; our call is under formal review (see the Scorecard).",
      source: "Q2 2026 release",
    },
    {
      date: "Jul 16, 2026",
      tag: "Deal",
      title: "Oaktree + IDF commit $1.7B to Bloom-powered Nebius AI buildout",
      blurb: "Third-party project capital: Morgan Stanley as tax equity, MUFG senior debt, financing Bloom deployments for Nebius's cloud, part of a >$2.6B IDF portfolio. Institutional money underwriting the arm's-length channel.",
      source: "IDF/Oaktree PR",
    },
    {
      date: "Jul 14–16, 2026",
      tag: "Analyst",
      title: "New Mexico blocks Project Jupiter's gas pipeline, twice",
      blurb: "The land commissioner denied Energy Transfer's reconsideration for the pipeline feeding Jupiter's 2.45 GW site; Oracle had already dropped turbines for 100% Bloom. Fuel cells still need the pipe: October air-permit hearing is the next gate.",
      source: "Source NM / state filings",
    },
    {
      date: "Jul 8–9, 2026",
      tag: "Analyst",
      title: "Hunterbrook short report, and Bloom's same-day rebuttal",
      blurb: "A short seller alleges China-linked scandium sourcing and re-hammers backlog vs firm orders; Bloom's 8-K calls it \"false and misleading\" and claims supply visibility for 25 GW/yr. The stock fell ~6%, then recovered on the rebuttal.",
      source: "Hunterbrook / Bloom 8-K",
    },
    {
      date: "Jun 30, 2026",
      tag: "Deal",
      title: "Brookfield expands partnership fivefold: $5B → $25B",
      blurb: "The financing framework for Bloom-powered AI projects grows 5× in under nine months, drawn from Brookfield's $100B AI Infrastructure Fund. A framework, not firm orders, but the capital behind the pipeline is now much deeper.",
      source: "Brookfield–Bloom PR",
    },
    {
      date: "May 2026",
      tag: "Deal",
      title: "Nebius signs guaranteed ~$2.6B agreement",
      blurb: "250 MW for the AI neo-cloud, a guaranteed offtake, not a framework, and Bloom's first anchor outside the hyperscale majors.",
      source: "Nebius agreement",
    },
    {
      date: "Apr 28, 2026",
      tag: "Earnings",
      title: "Record Q1 2026; FY guidance raised",
      blurb: "First sustained profit after 17 years: $143M adj. EBITDA (~6× YoY) and 2026 revenue guided to $3.4–3.8B, an ~80% step-up.",
      source: "Q1 2026 release",
    },
    {
      date: "Apr 2026",
      tag: "Deal",
      title: "Oracle expands to up to 2.8 GW (~$8–9B lifetime)",
      blurb: "Project Jupiter switched from gas turbines to Bloom, the largest fuel-cell commitment ever, and a head-to-head win against the incumbent technology.",
      source: "Bloom–Oracle PR",
    },
    {
      date: "Feb 5, 2026",
      tag: "Earnings",
      title: "FY2025: revenue $2.02B, +37%",
      blurb: "Full-year gross margin reached ~29% and the service segment turned profitable, the inflection the bulls had been waiting for.",
      source: "Q4 2025 call / FY2025 10-K",
    },
    {
      date: "Nov 2025",
      tag: "Deal",
      title: "AEP orders 1 GW (~$2.65B)",
      blurb: "The largest commercial fuel-cell procurement at signing, utility-scale units powering AWS data centers before the meter.",
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
      blurb: "The restored 30% investment tax credit for fuel cells under OBBBA cuts Bloom's effective cost ~25%, sell-side turns constructive.",
      source: "Benzinga",
    },
  ] as NewsItem[],
};

export const moat = {
  eyebrow: "05 · The moat",
  headline: "A 17-year head start nobody can buy.",
  dek: "Time, running data, and repeat service contracts, advantages a competitor can't buy or copy quickly.",
  facts: [
    { value: "~17 yrs", label: "lead in this fuel-cell tech (called SOFC); ~1.8 GW already installed, roughly a mid-size city's worth of power", source: "Doosan-Ceres SOP / 10-K", tier: "D", note: "02 Atomic Notes/Bloom 17-year SOFC head start" },
    { value: "100%", label: "service attach rate, every box sold also signs a long-term service contract", source: "Q1 2026 call", tier: "R", note: "02 Atomic Notes/100 percent attach rate service to product" },
    { value: "1T+ cell-hrs", label: "over a trillion hours of run-data; 6 billion sensor readings a day train a digital model of each unit to predict maintenance before it fails", source: "Q4 2025 call", tier: "R", note: "02 Atomic Notes/Trillion cell hours 6 billion data points per day" },
    { value: "~$127M", label: "recurring service revenue per deployed GW; the annuity compounds with the fleet", source: "FY2025 (derived)", tier: "D", note: "02 Atomic Notes/Service annuity 127M per GW-year" },
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
  headline: "Built for speed today; the real debate is durability.",
  dek: "Bloom wins the AI-power land grab on speed and density. The honest question isn't who it beats now, but what happens when the bottleneck clears.",
  rows: [
    {
      name: "Gas turbines",
      role: "The real alternative",
      point: "The standard way to make on-site power (a \"combined-cycle gas turbine,\" or CCGT) takes 3–5+ years to order a turbine and get hooked up. Bloom installs in 90–120 days, now goes head-to-head with turbines on the biggest projects, and matches grid prices in most US markets.",
      caveat: "The core long-term risk, but relief isn't near: gas-turbine supply is largely sold out through ~2029–2030, so Bloom's speed edge holds for several more years before the real pivot.",
      source: "SemiAnalysis / Q1 2026 call",
    },
    {
      name: "Nuclear / SMR",
      role: "Not yet a competitor",
      point: "Small modular reactors (SMRs), compact next-gen nuclear, are a 2030s story; AI needs power now. Bloom fills the gap the next decade can't.",
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
      point: "Making power on-site skips the years-long wait to connect to the utility grid; Bloom's setup needs no grid, no diesel, no batteries, no turbines. Each box does still need a gas line: \"off-grid\" means off the electric grid, not off fuel.",
      caveat: "At roughly $121 to make an hour of power, Bloom still costs more than buying from the grid, so it sells speed, not price. Where the grid is cheap and available, it's a harder sell.",
      source: "Q1 2026 call / Tech page",
    },
  ] as FieldRow[],
  facts: [
    { value: "~$121/MWh", label: "the all-in cost to make one unit of power (a megawatt-hour); about $95 after a federal tax credit. Cheaper than a backup generator, still pricier than the grid", source: "Driver Tree (derived)", tier: "D", note: "02 Atomic Notes/All-in cost 121 per MWh fuel slice small" },
    { value: "90–120 days", label: "to install and switch on, versus 3–5+ years for a gas turbine", source: "SemiAnalysis", tier: "E", note: "02 Atomic Notes/Speed to power vs gas turbine queue" },
    { value: "100 MW/acre", label: "power packed into an acre of land, about double a gas-turbine plant", source: "Heat Capture datasheet", tier: "R", note: "02 Atomic Notes/100 MW per acre power density" },
    { value: "679–839", label: "pounds of CO₂ per unit of power on gas, about the same carbon as a regular gas power plant", source: "NG-SOFC emissions note", tier: "D", note: "02 Atomic Notes/Bloom NG-SOFC emissions at gas turbine parity" },
  ] as Fact[],
};

export const financials = {
  eyebrow: "06 · Financials",
  headline: "The inflection is finally on the P&L.",
  dek: "After 17 years of losses, 2026 delivered the proof: a record first half, the first billion-dollar quarter, and revenue guided to roughly double.",
  facts: [
    { value: "$1.07B", label: "Q2 2026 revenue (+165% YoY): the first billion-dollar quarter; $0.78 non-GAAP EPS, $226M operating cash flow", source: "Q2 2026 release", tier: "R", note: "02 Atomic Notes/Q2 2026 revenue 1.07B up 165 percent" },
    { value: "$3.9–4.2B", label: "2026 revenue guidance, raised Jul 28 (~2× FY2025); non-GAAP EPS guided $2.55–2.85", source: "Q2 2026 release", tier: "R", note: "02 Atomic Notes/FY2026 guidance raised to 3.9-4.2B" },
    { value: "$253M", label: "Q2 2026 adj. EBITDA, more in one quarter than all of FY2025; product gross margin held 37.2%", source: "Q2 2026 release", tier: "R", note: "02 Atomic Notes/Q2 2026 EPS and profitability records" },
    { value: "~$100M", label: "to add each additional gigawatt of factory capacity, capex ran just 4.8% of revenue in Q2, so growth stays capital-light", source: "Q1 2026 call / Q2 release", tier: "R", note: "02 Atomic Notes/Q2 2026 cash flow 226M capex 4.8 percent" },
  ] as Fact[],
};

export const catalysts = {
  eyebrow: "07 · Catalysts",
  headline: "A backlog of gigawatt-scale anchors.",
  dek: "The deals are signed, the logos are real, and factory capacity is being built to meet them. (One gigawatt, or GW, is enough to power roughly 750,000 homes.)",
  deals: [
    { partner: "Oracle", terms: "up to 2.8 GW · ~$8–9B lifetime", note: "Project Jupiter switched from gas turbines to Bloom", source: "Bloom-Oracle PR" },
    { partner: "AEP", terms: "1 GW · ~$2.65B", note: "powering AWS on-site, before the utility meter", source: "Bloom-AEP PR" },
    { partner: "Brookfield", terms: "$25B framework · 1 GW initial", note: "expanded 5× from $5B in June 2026; preferred provider across $1T portfolio", source: "Brookfield PR (Jun 2026)" },
    { partner: "SK ecoplant", terms: "500 MW · $4.5B JV", note: "400 MW already deployed", source: "SK PR" },
    { partner: "Nebius", terms: "~$2.6B · 250 MW", note: "neo-cloud, guaranteed (May 2026)", source: "Nebius agreement" },
  ],
  facts: [
    { value: "6 vs 1", label: "big-cloud and AI-cloud customers, up from just one a year earlier", source: "Q4 2025 call", tier: "R", note: "02 Atomic Notes/Hyperscale customer count 6 vs 1 year earlier" },
    { value: "2 GW", label: "of annual factory capacity by end-2026, and the plants can stretch to 5 GW", source: "Utility Dive", tier: "R", note: "02 Atomic Notes/Bloom 2GW capacity by YE2026" },
    { value: "800V DC", label: "the new power standard AI server racks are moving to: Bloom's boxes already put it out directly", source: "Q1 2026 call", tier: "R", note: "02 Atomic Notes/Bloom only solution natively producing 800V DC today" },
    { value: "~$20B", label: "of signed backlog behind the anchors above, roughly $6B in equipment plus ~$14B of long-term service", source: "FY2025 10-K", tier: "R", note: "02 Atomic Notes/Bloom $20B total backlog" },
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
  headline: "Priced for perfection, and leaning on related parties.",
  dek: "We're not naive. Here's the bear case, and the honest counter to each point.",
  items: [
    {
      claim: "Who's really buying? The 10-Q answered it two different ways",
      detail: "Until Q1, about half of Bloom's sales went to partners Bloom helped fund, like selling cars to a dealership you co-own. In Q2 that figure collapsed to $2.8M from ~$373M while total sales exploded, and that is where the headline \"0.3% related-party\" number comes from. Then the 10-Q landed with a second number. Its concentration note says two customers were 44% and 21% of the quarter's revenue, and that the 21% one is a related party. That is roughly $224M, not $2.8M. Both can be technically true: the concentration note counts the contractual counterparty, which it says may be a project-finance affiliate rather than the end user, while the related-party note is scoped to the joint ventures Bloom holds equity in. The gap between them is the original question, restated inside the company's own filing.",
      rebuttal: "The bull case survives the arithmetic. Strip $224M instead of $2.8M and independent revenue still grew ~125% year over year, far past anything we modelled, and $226M of operating cash still came in. What does not survive is the clean story. The same filing that reports 0.3% related-party revenue also flags a related-party counterparty at a fifth of the quarter, and the receivable side ties between the two notes, so this is not a definitions artifact we can wave off. We said the next filing would settle this. It didn't, and we would rather say so than bank the reading that flatters us.",
      source: "Q2 2026 10-Q, Note 1 (Concentration of Risk) and Note 11 (Related Party Transactions)",
    },
    {
      claim: "One customer was 73% of the first half",
      detail: "The 10-Q reports that for the six months ended June 30, a single customer, not a related party, accounted for approximately 73% of total revenue. Inside Q2 itself, two customers were 44% and 21%. Bloom does not name them. A revenue base that concentrated means one project schedule slipping, or one counterparty renegotiating, moves the entire year rather than a line item.",
      rebuttal: "This is what winning gigawatt-scale anchors looks like early: Oracle's Jupiter alone is up to 2.8 GW, so a lumpy revenue line is the arithmetic of the deal size, not evidence of weakness. Management also says backlog is growing faster than revenue, which is the thing that would eventually spread the base out. But it is a real fragility today, the Q2 filing is the first place it is quantified, and our scenario spread does not yet price a single-customer slip.",
      source: "Q2 2026 10-Q, Note 1 (Concentration of Risk)",
    },
    {
      claim: "Still priced as if the doubling never stops",
      detail: "Even after July's 40% fall to ~$163, the stock costs about 60× the earnings management itself expects this year, a price that only works if revenue keeps doubling for years. And of the headline \"$20B of future business,\" only ~$0.5B was firm, legally booked orders as of the last filing; the rest turns into revenue only if and when purchase orders actually land.",
      rebuttal: "The fair counter: management just raised its own profit forecast to $800–900M, which shrinks that multiple faster than we modeled. This was the strongest quarter the bulls have ever had, and our model re-run has to take it seriously.",
      source: "Q2 2026 release / Q1 2026 10-Q",
    },
    {
      claim: "It burned $4 billion getting here",
      detail: "Bloom lost money for seventeen straight years: $4B in total, before 2026's profits arrived. A track record like that earns skepticism about whether the good quarters last.",
      rebuttal: "The turn looks structural, not lucky: the service business (the recurring \"ink\" revenue) is now profitable and growing, and the last two quarters generated real cash, not just accounting profit.",
      source: "FY2025 10-K / Q2 2026 release",
    },
    {
      claim: "Professional skeptics keep attacking, most recently over a rare metal",
      detail: "Short sellers (investors who profit if the stock falls) have targeted Bloom twice: in 2019 over how long the boxes really last, and in July 2026 over scandium, a rare metal in every fuel cell. The new report claims Bloom's supply traces back to China and that its growth plans would need nearly the entire world's annual scandium production.",
      rebuttal: "Bloom formally rejected the claims: it says supply comes from several countries via its own recycling process, enough for 10× its current plans. But its supplier list is confidential, so nobody outside the company can fully verify either side. That's the honest state of it.",
      source: "Hunterbrook / Bloom 8-K (Jul 2026)",
    },
  ] as Risk[],
};

export const valuation = {
  eyebrow: "08 · Valuation",
  headline: "What does the price assume?",
  dek: "We run the usual valuation math backwards: instead of guessing what Bloom is worth, we ask what today's price already assumes, then find the price where even the most optimistic story still pays us well for the risk. Every slider starts at our model's number; drag anything and see what has to be true for a different answer.",
  note: "RE-RUN COMPLETE (v9 workbook, Jul 28 2026): FY2026 revenue is re-anchored to management's raised $4.05B guidance midpoint, the net-debt bridge is rolled to the Q2 10-Q balance sheet, and the divisor is now 323.3M diluted shares. Two things we did NOT do: we did not raise the gross-margin driver to the 32.0% H1 print, because a $37.4M one-time import-tariff recovery accounts for essentially all of the beat (ex-tariff H1 margin is 29.9%, versus our 30.0% assumption); and we deducted the $215.5M unamortized Oracle warrant revenue contra, which reduces revenue in future years as Energy Servers are delivered. Blended value moves from $18.23 to $21.59 a share. Educational research, not investment advice.",
};

export const theCall = {
  eyebrow: "10 · The call",
  headline: "A real franchise at an unforgiving price.",
  dek: "Bloom turned the corner for real, but today's price already pays for the happy ending. Drag the assumptions and decide what you have to believe.",
  conclusion:
    "Great company, demanding price. How much you'd own comes down to two beliefs: how much of the ~$20B pipeline becomes real orders, and whether Q2's \"independent customers took over\" story holds up, which the 10-Q left genuinely unresolved: $2.8M of related-party revenue in one note, a related-party customer at 21% of the quarter in another. We land where we started, own the turnaround, respect the price, and after Q2 tripped two of our own tripwires, we've re-run our numbers in public rather than defending them.",
  note: "Scenario outputs derive from the v9 workbook (Q2 2026 roll-forward, Jul 28 2026); the reverse-DCF frontier in the valuation lab is the formal version of this argument.",
};

// Market reference, fallback when the live quote hasn't loaded.
// Refreshed from FactSet (Q1 2026). The live Finnhub quote overrides this.
export const market = {
  capProvisional: 88.24e9, // ~$88B (FactSet, Q1 2026)
  asOf: "Q1 2026",
  source: "TipRanks, Jul 2026",
  bearPT: 149.93, // 24/7 Wall St bear case
  consensusPT: 287.05, // TipRanks 21-analyst mean, Jul 6 2026 (9 buy / 10 hold / 0 sell)
  // Individual firm targets, July 2026, for the "street view" strip.
  streetPTs: [
    { firm: "UBS", pt: 350, note: "highest visible target", asOf: "Jul 2026" },
    { firm: "Susquehanna", pt: 298, note: "raised from $293", asOf: "Jul 2026" },
    { firm: "Consensus", pt: 287.05, note: "21 analysts · 9 buy / 10 hold / 0 sell", asOf: "Jul 2026" },
    { firm: "Jefferies", pt: 246, note: "raised from $207, rating: Hold", asOf: "Jul 2026" },
    { firm: "24/7 Wall St", pt: 149.93, note: "published bear case (a publication, not a bank)", asOf: "May 2026" },
  ],
};

export interface SourceRow {
  title: string;
  publisher: string;
  url: string;
}

export const sources: SourceRow[] = [
  { title: "Q2 2026 Earnings Release (record quarter, guidance raised)", publisher: "Bloom Energy IR", url: "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-Reports-Record-Second-Quarter-2026-Financial-Results-and-Raises-Full-Year-2026-Guidance/default.aspx" },
  { title: "IDF & Oaktree $1.7B Project Investment (Nebius build-out)", publisher: "PR Newswire", url: "https://www.prnewswire.com/news-releases/industrial-development-funding-and-oaktree-announce-1-7-billion-project-investment-in-bloom-energy-fuel-cells-for-nebius-ai-infrastructure-build-out-302827566.html" },
  { title: "NM Land Commissioner Blocks Jupiter Pipeline", publisher: "Source New Mexico", url: "https://sourcenm.com/2026/07/16/new-mexico-land-commissioner-blocks-project-jupiter-related-pipeline-from-building-on-state-land/" },
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
