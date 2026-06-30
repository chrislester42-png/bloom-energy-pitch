// Peer comps — sourced from FactSet "Comps Tables - Named Competitors"
// (08 Website/BE_peer_comps_factset.xlsx), data as of ~Q1 2026 (03/31/2026).
// null = not meaningful (negative EBITDA/earnings). Multiples in x, margins in %.

export interface Peer {
  name: string;
  ticker: string;
  group: "fuel-cell" | "ai-power";
  price: number;
  mktCap: number; // $M
  ev: number; // $M
  evSales: number | null;
  evEbitda: number | null;
  peFy1: number | null; // CY2026E
  ebitdaMargin: number; // LTM %
  grossMargin: number; // LTM %
  netDebtEbitda: number | null;
  priceTarget: number; // consensus mean
}

export const peersAsOf = "Q1 2026 · FactSet";

export const peers: Peer[] = [
  { name: "Bloom Energy", ticker: "BE", group: "fuel-cell", price: 275.01, mktCap: 88240, ev: 85697, evSales: 35.0, evEbitda: 338.9, peFy1: 128.1, ebitdaMargin: 10.3, grossMargin: 31.1, netDebtEbitda: 1.81, priceTarget: 282.16 },
  { name: "Plug Power", ticker: "PLUG", group: "fuel-cell", price: 2.59, mktCap: 4228, ev: 4546, evSales: 6.1, evEbitda: null, peFy1: null, ebitdaMargin: -77.6, grossMargin: -25.7, netDebtEbitda: null, priceTarget: 3.69 },
  { name: "FuelCell Energy", ticker: "FCEL", group: "fuel-cell", price: 29.8, mktCap: 2078, ev: 1861, evSales: 11.1, evEbitda: null, peFy1: null, ebitdaMargin: -44.6, grossMargin: -18.2, netDebtEbitda: 3.24, priceTarget: 22.0 },
  { name: "Ballard Power", ticker: "BLDP", group: "fuel-cell", price: 3.72, mktCap: 1155, ev: 634, evSales: 6.1, evEbitda: null, peFy1: null, ebitdaMargin: -59.2, grossMargin: 9.0, netDebtEbitda: 8.16, priceTarget: 4.14 },
  { name: "GE Vernova", ticker: "GEV", group: "ai-power", price: 1102.51, mktCap: 301057, ev: 294103, evSales: 7.5, evEbitda: 97.1, peFy1: 38.5, ebitdaMargin: 7.7, grossMargin: 20.2, netDebtEbitda: -2.42, priceTarget: 1227.4 },
  { name: "Vertiv", ticker: "VRT", group: "ai-power", price: 306.97, mktCap: 120776, ev: 121251, evSales: 11.2, evEbitda: 50.3, peFy1: 47.3, ebitdaMargin: 22.2, grossMargin: 35.0, netDebtEbitda: 0.3, priceTarget: 378.23 },
  { name: "Generac", ticker: "GNRC", group: "ai-power", price: 283.81, mktCap: 17141, ev: 18200, evSales: 4.2, evEbitda: 26.1, peFy1: 31.6, ebitdaMargin: 16.1, grossMargin: 36.0, netDebtEbitda: 1.53, priceTarget: 293.21 },
  { name: "Constellation", ticker: "CEG", group: "ai-power", price: 259.32, mktCap: 93337, ev: 116037, evSales: 4.1, evEbitda: 18.6, peFy1: 22.2, ebitdaMargin: 21.9, grossMargin: 13.2, netDebtEbitda: 3.42, priceTarget: 362.35 },
];

// Peer medians (FactSet), excluding BE — the "what the group trades at" yardstick.
export const peerMedian = {
  evSales: 6.81,
  evEbitda: 38.46, // among profitable peers
  peFy1: 34.92,
  ebitdaMargin: 9.01,
};
