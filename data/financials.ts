// AUTO-GENERATED from 08 Website/BE_financials.xlsx (SEC EDGAR XBRL).
// Values in WHOLE USD (the workbook's '$ thousands' label is incorrect).
// Regenerate when the workbook is updated.

export interface FYData {
  fy: number | null;
  revenue: number | null;
  revGrowth: number | null;
  grossProfit: number | null;
  grossMargin: number | null;
  operatingIncome: number | null;
  operatingMargin: number | null;
  ebitda: number | null;
  ebitdaMargin: number | null;
  netIncome: number | null;
  cfo: number | null;
  capex: number | null;
  fcf: number | null;
  cash: number | null;
  totalDebt: number | null;
  netDebt: number | null;
  dilutedShares: number | null;
}

export const annual: FYData[] = [
  { fy: 2021, revenue: 972176000, revGrowth: null, grossProfit: 197581000, grossMargin: 0.2032, operatingIncome: -114502000, operatingMargin: -0.1178, ebitda: -61048000, ebitdaMargin: -0.0628, netIncome: -193369000, cfo: -60681000, capex: 49810000, fcf: -110491000, cash: 396035000, totalDebt: 526730000, netDebt: 130695000, dilutedShares: 173438000 },
  { fy: 2022, revenue: 1199125000, revGrowth: 0.2334, grossProfit: 148288000, grossMargin: 0.1237, operatingIncome: -260992000, operatingMargin: -0.2177, ebitda: -199384000, ebitdaMargin: -0.1663, netIncome: -315086000, cfo: -191723000, capex: 116823000, fcf: -308546000, cash: 348498000, totalDebt: 411579000, netDebt: 63081000, dilutedShares: 185907000 },
  { fy: 2023, revenue: 1333470000, revGrowth: 0.112, grossProfit: 197794000, grossMargin: 0.1483, operatingIncome: -208907000, operatingMargin: -0.1567, ebitda: -146298000, ebitdaMargin: -0.1097, netIncome: -307937000, cfo: -372531000, capex: 83739000, fcf: -456270000, cash: 664593000, totalDebt: 846633000, netDebt: 182040000, dilutedShares: 212681000 },
  { fy: 2024, revenue: 1473856000, revGrowth: 0.1053, grossProfit: 404648000, grossMargin: 0.2746, operatingIncome: 22909000, operatingMargin: 0.0155, ebitda: 75957000, ebitdaMargin: 0.0515, netIncome: -27203000, cfo: 91998000, capex: 58852000, fcf: 33146000, cash: 802851000, totalDebt: 1128792000, netDebt: 325941000, dilutedShares: 227365000 },
  { fy: 2025, revenue: 2023994000, revGrowth: 0.3733, grossProfit: 587400000, grossMargin: 0.2902, operatingIncome: 72802000, operatingMargin: 0.036, ebitda: 123368000, ebitdaMargin: 0.061, netIncome: -87140000, cfo: 113949000, capex: 56759000, fcf: 57190000, cash: 2454108000, totalDebt: 2617879000, netDebt: 163771000, dilutedShares: 240402000 },
];

// netDebt + dilutedShares refreshed from FactSet (as of Q1 2026, 03/31/2026)
// so per-share math reflects the real current capital structure.
export const latest = {
  fy: 2025,
  revenue: 2023994000,
  ebitdaMargin: 0.061,
  netDebt: 456449000, // FactSet Q1 2026
  dilutedShares: 319708000, // FactSet diluted, Q1 2026
};

export interface Scenario { revCagr: number; ebitdaMargin: number; exitMultiple: number; }

// 5 years: FY2025 → FY2030, matching the reverse-DCF lab horizon.
export const HORIZON_YEARS = 5;

// Discounting convention shared with the valuation lab: mid-2026 valuation
// date → FY2030 at a market-level discount rate.
export const DISC_RATE = 0.105;
export const DISC_YEARS = 4.5;

// Scenario probabilities (our weighting, same as the lab's scenario table).
export const scenarioProbs: Record<'bear' | 'base' | 'bull', number> = {
  bear: 0.25, base: 0.50, bull: 0.25,
};

// Ranges widened so the model can reach (and exceed) today's ~$275 price —
// the point is to let a viewer dial in "what you must believe."
export const sliderRanges = {
  revCagr:      { min: 0.05, max: 0.80, step: 0.01,  default: 0.354 },
  ebitdaMargin: { min: 0.05, max: 0.25, step: 0.005, default: 0.16 },
  exitMultiple: { min: 6,    max: 60,   step: 0.5,   default: 12 },
};

// OUR model's three cases — identical to the valuation lab's scenario table.
// CAGRs are derived so FY2030 revenue lands exactly on the lab's cases:
//   bear $5.0B (19.8%/yr), base $9.2B (35.4%/yr), bull $15.0B (49.3%/yr).
export const scenarios: Record<'bear' | 'base' | 'bull', Scenario> = {
  bear: { revCagr: 0.1983, ebitdaMargin: 0.10, exitMultiple: 8 },
  base: { revCagr: 0.3537, ebitdaMargin: 0.16, exitMultiple: 12 },
  bull: { revCagr: 0.4927, ebitdaMargin: 0.22, exitMultiple: 16 },
};

export function valuePerShare(s: Scenario) {
  const fwdRevenue = latest.revenue * Math.pow(1 + s.revCagr, HORIZON_YEARS);
  const fwdEbitda = fwdRevenue * s.ebitdaMargin;
  const enterpriseValue = fwdEbitda * s.exitMultiple;
  const equityValue = enterpriseValue - latest.netDebt;
  const perShare = equityValue / latest.dilutedShares;
  return { fwdRevenue, fwdEbitda, enterpriseValue, equityValue, perShare };
}
