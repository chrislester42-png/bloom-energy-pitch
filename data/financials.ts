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

export const latest = {
  fy: 2025,
  revenue: 2023994000,
  ebitdaMargin: 0.061,
  netDebt: 163771000,
  dilutedShares: 240402000,
};

export interface Scenario { revCagr: number; ebitdaMargin: number; exitMultiple: number; }

export const HORIZON_YEARS = 4;

export const sliderRanges = {
  revCagr:      { min: 0.05, max: 0.70, step: 0.01,  default: 0.30 },
  ebitdaMargin: { min: 0.05, max: 0.22, step: 0.005, default: 0.13 },
  exitMultiple: { min: 10,   max: 40,   step: 0.5,   default: 22 },
};

// Provisional presets - refine as model work continues.
export const scenarios: Record<'bear' | 'base' | 'bull', Scenario> = {
  bear: { revCagr: 0.15, ebitdaMargin: 0.08, exitMultiple: 14 },
  base: { revCagr: 0.32, ebitdaMargin: 0.13, exitMultiple: 22 },
  bull: { revCagr: 0.52, ebitdaMargin: 0.18, exitMultiple: 32 },
};

export function valuePerShare(s: Scenario) {
  const fwdRevenue = latest.revenue * Math.pow(1 + s.revCagr, HORIZON_YEARS);
  const fwdEbitda = fwdRevenue * s.ebitdaMargin;
  const enterpriseValue = fwdEbitda * s.exitMultiple;
  const equityValue = enterpriseValue - latest.netDebt;
  const perShare = equityValue / latest.dilutedShares;
  return { fwdRevenue, fwdEbitda, enterpriseValue, equityValue, perShare };
}
