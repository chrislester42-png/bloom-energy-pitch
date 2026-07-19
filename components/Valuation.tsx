"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Section, SectionHeader, Reveal } from "./ui";
import { t } from "./tokens";
import { valuation } from "@/data/content";
import { useLivePrice } from "./LivePrice";

/**
 * Valuation — two exports:
 *
 *   <Valuation />     · the MAIN-PAGE section: reverse DCF only, three
 *                       sliders, presentation-friendly. Links to /valuation.
 *   <ValuationLab />  · the FULL lab (used by app/valuation/page.tsx):
 *                       both tabs — the group DCF mirror and the complete
 *                       reverse-DCF / entry-price / scenario tool.
 *
 * Every slider shows the value our model actually uses ("ours: …"), so a
 * viewer can tell our assumptions from their experiments.
 * Engine and defaults mirror valuation-lab.html / reverse-dcf-lab.html.
 */

// ---------- shared engine constants ----------------------------------------
const BASE_REV = 2023994000; // FY2025 revenue
const YEARS = [2026, 2027, 2028, 2029, 2030];
const YRS = 4.5; // mid-2026 valuation date → FY2030

const PS = (n: number) => `$${n.toFixed(2)}`;
const B = (n: number) => `$${(n / 1e9).toFixed(2)}B`;
const M = (n: number) =>
  `${n < 0 ? "-$" : "$"}${Math.abs(Math.round(n / 1e6)).toLocaleString()}M`;
const P1 = (n: number) => `${n.toFixed(1)}%`;

// ---------- small UI atoms --------------------------------------------------
function Slider({
  label,
  ours,
  value,
  fmt,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  /** what OUR model uses, e.g. "our calculated WACC: 21.0%" */
  ours?: string;
  value: number;
  fmt: (n: number) => string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-0.5 flex items-baseline justify-between">
        <span className="text-[12.5px]" style={{ color: t.fgDim }}>
          {label}
        </span>
        <span
          className="font-mono text-[13px] font-semibold tabular-nums"
          style={{ color: t.accent }}
        >
          {fmt(value)}
        </span>
      </div>
      {ours && (
        <div
          className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em]"
          style={{ color: t.fgMute }}
        >
          {ours}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mb-3 w-full"
        style={{ accentColor: "var(--color-accent)" }}
      />
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-1.5 text-[13px]">
      <span style={{ color: t.fgDim, fontWeight: strong ? 600 : 400 }}>{k}</span>
      <span className="font-mono font-semibold tabular-nums" style={{ color: t.ink }}>
        {v}
      </span>
    </div>
  );
}

function UpPill({ ps, price }: { ps: number; price: number }) {
  const up = (ps / price - 1) * 100;
  const pos = up >= 0;
  return (
    <span
      className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold"
      style={{
        color: pos ? t.accent : "var(--color-hot, #dc2626)",
        background: pos ? "var(--color-accent-soft)" : "rgba(220,38,38,0.10)",
      }}
    >
      {pos ? "▲" : "▼"} {Math.abs(up).toFixed(0)}% vs ${price.toFixed(0)}
    </span>
  );
}

function NumCell({
  value,
  step,
  onChange,
}: {
  value: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) onChange(v);
      }}
      className="w-[64px] rounded-md border border-line px-1.5 py-0.5 text-right font-mono text-[12px]"
      style={{ background: t.surface, color: t.ink }}
    />
  );
}

const TH =
  "px-2 py-1.5 text-right font-mono text-[10px] font-medium uppercase tracking-[0.08em]";
const TD = "px-2 py-1.5 text-right font-mono text-[12px] tabular-nums";

// ---------- reverse-DCF engine (shared) --------------------------------------
// UFCF margin ramp per the completed v5 workbook (post tax-sign fix).
const FCFM_RAMP = [-2.26, 0.98, 3.7, 5.6, 6.86];
const G_TERM = 3.5,
  EX_MULT = 13.5,
  EB_M = 15.82;
// v5 Gordon-leg fix: terminal-year FCF normalized (ΔNWC at g × terminal NWC),
// applied as a multiplier on UFCF₂₀₃₀×(1+g) so the perpetuity leg matches the
// workbook's $939.1M numerator at base assumptions.
const K_NORM = 1.416;

// our model's reverse-DCF assumptions (FactSet Q1'26 capital structure)
export const OURS = {
  rw: 10.5, // market-level discount rate
  bRev: 15, // super-bull FY2030 revenue, $B
  bM: 22, // mature EBITDA margin, %
  bX: 16, // mature EV/EBITDA
  hr: 12, // hurdle IRR, %
  netDebt: 456, // $M
  shares: 319.7, // M
};

interface Scen {
  name: string;
  p: number;
  rev: number;
  m: number;
  x: number;
}

// ---------- completed-workbook reverse-DCF findings (static, sourced) --------
// Workbook Reverse DCF tab, pinned 2026-06-27 ($257.98 → EV $82.7B): the
// terminal-FCF-margin "mystery table", goal-seeked at the model's 21% WACC.
const WB_MARGIN_TABLE = [
  { m: "10% (harsh)", g1: "153%", cagr: "71.5%", rev36: "$446B", ceil: "11.9×" },
  { m: "15%", g1: "136%", cagr: "64.2%", rev36: "$288B", ceil: "7.7×" },
  { m: "20% (generous)", g1: "124%", cagr: "59.1%", rev36: "$210B", ceil: "5.6×" },
  { m: "25% (heroic)", g1: "115%", cagr: "55.2%", rev36: "$164B", ceil: "4.4×" },
];
// Experiments annex, re-pulled at the 2026-07-14 pin ($243.40 → EV $69.4B):
// the rate–growth frontier. "BTM pie" = the measured behind-the-meter segment
// (30% of ~23.7 GW/yr of new US data-center load).
const FRONTIER = [
  { r: "8.0%", g1: "58.4%", rev36: "$26.9B", gw: "3.6", ceil: "0.7×", pie: "15% of all new load · 0.5× BTM" },
  { r: "9.5%", g1: "67.9%", rev36: "$37.3B", gw: "5.0", ceil: "1.0× — ceiling binds", pie: "21% · 0.7× BTM" },
  { r: "10.5%", g1: "73.5%", rev36: "$45.0B", gw: "6.0", ceil: "1.2×", pie: "25% · 0.8× BTM" },
  { r: "12.0%", g1: "81.1%", rev36: "$57.8B", gw: "7.7", ceil: "1.5×", pie: "32% · 1.1× BTM" },
  { r: "15.0%", g1: "94.7%", rev36: "$88.4B", gw: "11.8", ceil: "2.4×", pie: "50% · 1.7× BTM" },
  { r: "18.0%", g1: "106.8%", rev36: "$126.8B", gw: "16.9", ceil: "3.4×", pie: "71% · 2.4× BTM" },
  { r: "21.0%", g1: "118.0%", rev36: "$174.5B", gw: "23.3", ceil: "4.7×", pie: "98% of ALL new load · 3.3× BTM" },
];

const SCEN_DEFAULTS: Scen[] = [
  { name: "Bull — AI power land-grab won", p: 25, rev: 15, m: 22, x: 16 },
  { name: "Base — strong industrial grower", p: 50, rev: 9.2, m: 16, x: 12 },
  { name: "Bear — capex digestion / competition", p: 25, rev: 5, m: 10, x: 8 },
];

function blendConstG(g5: number, w: number, netDebt: number, shares: number) {
  const wacc = w / 100,
    g = G_TERM / 100,
    nd = netDebt * 1e6,
    sh = shares * 1e6;
  let rev = BASE_REV,
    pv1 = 0,
    u = 0;
  for (let i = 0; i < 5; i++) {
    rev *= 1 + g5 / 100;
    u = rev * (FCFM_RAMP[i] / 100);
    const cf = i === 0 ? u * 0.5 : u;
    pv1 += cf / Math.pow(1 + wacc, i + 0.5);
  }
  const perp =
    (pv1 + (u * (1 + g) * K_NORM) / (wacc - g) / Math.pow(1 + wacc, YRS) - nd) / sh;
  const eb =
    (pv1 + (rev * (EB_M / 100) * EX_MULT) / Math.pow(1 + wacc, YRS) - nd) / sh;
  return { ps: (perp + eb) / 2, rev2030: rev };
}

function solveImpliedGrowth(price: number, rw: number, netDebt: number, shares: number) {
  let lo = 0,
    hi = 400;
  if (blendConstG(hi, rw, netDebt, shares).ps < price) return null;
  for (let i = 0; i < 70; i++) {
    const m = (lo + hi) / 2;
    if (blendConstG(m, rw, netDebt, shares).ps < price) lo = m;
    else hi = m;
  }
  const g = (lo + hi) / 2;
  return { g, rev: blendConstG(g, rw, netDebt, shares).rev2030 };
}

const fwdPs = (revB: number, mPct: number, mult: number, netDebt: number, shares: number) =>
  (revB * 1e9 * (mPct / 100) * mult - netDebt * 1e6) / (shares * 1e6);

// ============================================================================
// MAIN-PAGE SECTION — compact reverse DCF, three sliders
// ============================================================================
export function Valuation() {
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 300;

  const [rw, setRw] = useState(OURS.rw);
  const [bRev, setBRev] = useState(OURS.bRev);
  const [hr, setHr] = useState(OURS.hr);

  const imp = useMemo(
    () => solveImpliedGrowth(p, rw, OURS.netDebt, OURS.shares),
    [p, rw],
  );
  const ps30 = fwdPs(bRev, OURS.bM, OURS.bX, OURS.netDebt, OURS.shares);
  const entry = ps30 / Math.pow(1 + hr / 100, YRS);
  const irrM = (Math.pow(ps30 / p, 1 / YRS) - 1) * 100;
  const down = (1 - entry / p) * 100;
  const irrOk = irrM >= hr;

  return (
    <Section id="valuation" tone="surface">
      <SectionHeader {...valuation} />

      {/* verdict strip */}
      <Reveal i={2}>
        <div className="mt-10 flex flex-wrap gap-3">
          {(
            [
              [ok ? "Market price (live)" : "Market price (reference)", PS(p), "what buyers pay today", "bad"],
              ["Implied growth at that price", imp ? `${imp.g.toFixed(0)}%/yr` : ">400%/yr", "5 straight years, reverse DCF", "bad"],
              ["Our buy trigger", PS(entry), `bull case at a ${hr.toFixed(0)}% hurdle`, "head"],
              ["IRR if bought today", `${irrM >= 0 ? "+" : ""}${irrM.toFixed(1)}%`, "to FY2030, conceding the bull case", irrOk ? "head" : "bad"],
            ] as const
          ).map(([k, v, sub, toneCls]) => (
            <div
              key={k}
              className="min-w-[150px] flex-1 rounded-xl border px-4 py-3"
              style={{
                borderColor: toneCls === "head" ? t.accent : "var(--color-hot, #dc2626)",
                background: toneCls === "head" ? "var(--color-accent-soft)" : "rgba(220,38,38,0.06)",
              }}
            >
              <div className="text-[11.5px]" style={{ color: t.fgDim }}>
                {k}
              </div>
              <div className="text-[24px] font-semibold tabular-nums tracking-tight" style={{ color: t.ink }}>
                {v}
              </div>
              <div className="text-[10.5px]" style={{ color: t.fgMute }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* three sliders */}
        <Reveal i={3}>
          <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
            <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
              The three numbers that matter
            </h3>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
              defaults are our model&apos;s assumptions
            </p>
            <Slider
              label="Bull-case FY2030 revenue (concede the whole bull story)"
              ours={`ours: $${OURS.bRev}B — our super-bull case (7.4× today)`}
              value={bRev}
              fmt={(n) => `$${n.toFixed(1)}B`}
              min={4}
              max={40}
              step={0.5}
              onChange={setBRev}
            />
            <Slider
              label="Required IRR (your hurdle rate)"
              ours={`ours: ${OURS.hr}% — what we demand to hold a story stock`}
              value={hr}
              fmt={P1}
              min={8}
              max={25}
              step={0.5}
              onChange={setHr}
            />
            <Slider
              label="Market-level discount rate (for the implied-growth solve)"
              ours={`ours: ${OURS.rw}% — a market rate, not our 21.0% company WACC`}
              value={rw}
              fmt={P1}
              min={7}
              max={16}
              step={0.1}
              onChange={setRw}
            />
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
              Held fixed here (edit them in the full lab): {OURS.bM}% mature EBITDA
              margin, {OURS.bX}× mature EV/EBITDA, ${OURS.netDebt}M net debt,{" "}
              {OURS.shares}M diluted shares (FactSet Q1&apos;26).
            </p>
          </div>
        </Reveal>

        {/* outputs */}
        <Reveal i={4}>
          <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
            <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
              What the model says
            </h3>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
              reverse DCF · entry price
            </p>
            <Row k="Growth the market is prepaying for" v={imp ? `${P1(imp.g)} /yr × 5 yrs` : "—"} />
            <Row k="Implied FY2030 revenue" v={imp ? `${B(imp.rev)} (${(imp.rev / BASE_REV).toFixed(0)}× today)` : "—"} />
            <Row k="Bull-case FY2030 value / share" v={PS(ps30)} />
            <Row k="Entry price today (buy trigger)" v={PS(entry)} strong />
            <Row k="Fall needed to reach the trigger" v={`${Math.max(0, down).toFixed(0)}%`} />
            <div
              className="mt-4 rounded-xl border-l-[3px] px-4 py-3 text-[13px] leading-relaxed"
              style={{ borderColor: "#d97706", background: "#fdf6ec", color: t.ink2 }}
            >
              <b>
                Sell / avoid at {PS(p)} — buy below {PS(entry)}.
              </b>{" "}
              Even granting ${bRev.toFixed(0)}B of FY2030 revenue, a buyer today
              earns {irrM.toFixed(1)}%/yr against a {hr.toFixed(0)}% hurdle.
            </div>
          </div>
        </Reveal>
      </div>

      {/* deep-dive link */}
      <Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12.5px]" style={{ color: t.fgMute }}>
            {valuation.note}
          </p>
          <a
            href="/valuation"
            className="group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition-all hover:-translate-y-[1px]"
            style={{
              color: t.accent,
              border: `1px solid ${t.lineStrong}`,
              background: "rgba(255,255,255,0.7)",
            }}
          >
            Want to look further? Open the full valuation lab
            <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

// ============================================================================
// FULL LAB — /valuation page (both tabs, every assumption editable)
// ============================================================================

// ---------- Tab 1 · The group DCF -------------------------------------------
const DCF_DEFAULTS = {
  wacc: 21.03,
  gTerm: 3.5,
  exMult: 13.5,
  ebM: 15.82,
  blend: 50,
  price: 257.98,
  netDebt: 160.621, // $M (workbook, pinned 2026-06-27)
  shares: 319.7, // M — diluted per Q1 2026 10-Q (v5 audit fix)
  growth: [70, 45, 30, 22, 18],
  fcfM: [-2.26, 0.98, 3.7, 5.6, 6.86], // v5: forecast tax sign fixed (+5%)
};

type DcfState = typeof DCF_DEFAULTS;

function dcfModel(S: DcfState, waccPct?: number) {
  const wacc = (waccPct ?? S.wacc) / 100;
  const g = S.gTerm / 100;
  const netDebt = S.netDebt * 1e6;
  const shares = S.shares * 1e6;
  let rev = BASE_REV,
    pvStage1 = 0,
    ufcf2030 = 0,
    rev2030 = 0;
  const rows: { yr: number; rev: number; ufcf: number; pv: number }[] = [];
  for (let i = 0; i < 5; i++) {
    rev *= 1 + S.growth[i] / 100;
    const ufcf = rev * (S.fcfM[i] / 100);
    const cf = i === 0 ? ufcf * 0.5 : ufcf; // FY26 stub
    const pv = cf / Math.pow(1 + wacc, i + 0.5); // mid-year convention
    pvStage1 += pv;
    rows.push({ yr: YEARS[i], rev, ufcf, pv });
    ufcf2030 = ufcf;
    rev2030 = rev;
  }
  const perpTV = (ufcf2030 * (1 + g) * K_NORM) / (wacc - g);
  const perpPvTV = perpTV / Math.pow(1 + wacc, YRS);
  const perpEV = pvStage1 + perpPvTV;
  const perpPs = (perpEV - netDebt) / shares;
  const ebitda2030 = rev2030 * (S.ebM / 100);
  const ebTV = ebitda2030 * S.exMult;
  const ebPvTV = ebTV / Math.pow(1 + wacc, YRS);
  const ebEV = pvStage1 + ebPvTV;
  const ebPs = (ebEV - netDebt) / shares;
  const w = S.blend / 100;
  return {
    rows,
    pvStage1,
    perpTV,
    perpPvTV,
    perpEV,
    perpPs,
    ebitda2030,
    ebTV,
    ebEV,
    ebPs,
    blendPs: w * perpPs + (1 - w) * ebPs,
    perpPct: perpPvTV / perpEV,
    ebPct: ebPvTV / ebEV,
    netDebt,
    shares,
  };
}

function impliedWacc(S: DcfState): number | null {
  const f = (w: number) => dcfModel(S, w * 100).blendPs - S.price;
  let lo = S.gTerm / 100 + 0.001,
    hi = 1.5;
  if (f(lo) < 0) return null;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) lo = m;
    else hi = m;
  }
  return ((lo + hi) / 2) * 100;
}

function DcfTab() {
  const [S, setS] = useState<DcfState>(() => JSON.parse(JSON.stringify(DCF_DEFAULTS)));
  const set = (k: keyof DcfState) => (v: number) => setS((p) => ({ ...p, [k]: v }));
  const setArr = (k: "growth" | "fcfM", i: number) => (v: number) =>
    setS((p) => {
      const arr = [...p[k]];
      arr[i] = v;
      return { ...p, [k]: arr };
    });

  const m = useMemo(() => dcfModel(S), [S]);
  const iw = useMemo(() => impliedWacc(S), [S]);
  const maxRev = Math.max(...m.rows.map((r) => r.rev));

  return (
    <div>
      {/* headline comparison */}
      <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["Blended (50/50)", m.blendPs, true],
              [`Perpetuity DCF (g=${S.gTerm.toFixed(1)}%)`, m.perpPs, false],
              [`EBITDA exit (${S.exMult.toFixed(1)}×)`, m.ebPs, false],
            ] as const
          ).map(([k, v, head]) => (
            <div
              key={k}
              className="min-w-[150px] flex-1 rounded-xl border px-4 py-3"
              style={{
                borderColor: head ? t.accent : t.line,
                background: head ? "var(--color-accent-soft)" : t.surface,
              }}
            >
              <div className="text-[11.5px]" style={{ color: t.fgDim }}>
                {k}
              </div>
              <div className="text-[26px] font-semibold tabular-nums tracking-tight" style={{ color: t.ink }}>
                {PS(v)}
              </div>
              <UpPill ps={v} price={S.price} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
          The perpetuity leg is the pure discounted-cash-flow answer; the blended
          figure is lifted by the EBITDA-exit leg (a multiple, not discounting).
          Defaults reproduce the completed v5 workbook — $8.60 / $27.87 / $18.23
          (this mirror lands within a few cents on day-count rounding). The v5
          audit build: forecast tax sign fixed, Gordon terminal FCF normalized,
          diluted 319.7M-share divisor.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* global assumptions */}
        <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            Global assumptions
          </h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
            shared across both terminal methods
          </p>
          <Slider label="Discount rate (WACC)" ours="ours: 21.03% — our calculated company WACC" value={S.wacc} fmt={P1} min={6} max={30} step={0.01} onChange={set("wacc")} />
          <Slider label="Terminal growth (perpetual)" ours="ours: 3.5% — long-run nominal GDP-ish" value={S.gTerm} fmt={P1} min={1} max={6} step={0.1} onChange={set("gTerm")} />
          <Slider label="Terminal EBITDA exit multiple" ours="ours: 13.5× — mature industrial multiple" value={S.exMult} fmt={(n) => `${n.toFixed(1)}×`} min={5} max={30} step={0.5} onChange={set("exMult")} />
          <Slider label="FY2030 EBITDA margin (exit leg)" ours="ours: 15.8% — workbook FY30 margin" value={S.ebM} fmt={P1} min={8} max={24} step={0.1} onChange={set("ebM")} />
          <Slider label="Blend — perpetuity vs EBITDA" ours="ours: 50/50 — workbook final-valuation block" value={S.blend} fmt={(n) => `${n}% / ${100 - n}%`} min={0} max={100} step={5} onChange={set("blend")} />
          <Slider label="Reference share price (for upside)" ours="workbook reference: $257.98" value={S.price} fmt={PS} min={20} max={400} step={0.5} onChange={set("price")} />
          <div className="mt-1 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[12px]" style={{ color: t.fgDim }}>
              Net debt $M
              <NumCell value={S.netDebt} step={1} onChange={set("netDebt")} />
            </label>
            <label className="flex items-center gap-2 text-[12px]" style={{ color: t.fgDim }}>
              Diluted shares M
              <NumCell value={S.shares} step={0.1} onChange={set("shares")} />
            </label>
            <button
              onClick={() => setS(JSON.parse(JSON.stringify(DCF_DEFAULTS)))}
              className="rounded-full border border-line px-4 py-1.5 text-[12px] font-medium transition-colors hover:bg-sunken"
              style={{ color: t.fgDim, background: t.surface }}
            >
              Reset to our model
            </button>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            The v5 workbook divides by diluted 319.7M shares (Q1&apos;26 10-Q) —
            the audit fix that cut ~11% per share. Its net-debt bridge ($161M) is
            the FY2025 year-end; set 456 (FactSet Q1&apos;26) to roll it forward.
          </p>
          <div className="mt-4 border-t border-line pt-2">
            <Row k="PV of stage-1 UFCF" v={B(m.pvStage1)} />
            <Row k="Net debt" v={M(m.netDebt)} />
            <Row k="Implied WACC to match price" v={iw ? P1(iw) : "—"} />
            <Row k="Terminal as % of EV (perp / exit)" v={`${(m.perpPct * 100).toFixed(0)}% / ${(m.ebPct * 100).toFixed(0)}%`} />
          </div>
        </div>

        {/* forecast table */}
        <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            Forecast — edit growth &amp; FCF margin per year
          </h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
            FY2026–FY2030 · ours: 70/45/30/22/18% growth · −1.3→8.0% UFCF ramp
          </p>
          {/* revenue / FCF bars */}
          <div className="mb-4 flex h-[110px] items-end gap-2">
            {m.rows.map((r) => {
              const bh = (r.rev / maxRev) * 100;
              const fh = Math.max(0, r.ufcf / maxRev) * 100;
              return (
                <div key={r.yr} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div
                    className="relative w-full max-w-[44px] rounded-t-md"
                    style={{ height: `${bh + 4}%`, background: "rgba(10,10,10,0.10)" }}
                  >
                    <div
                      className="absolute bottom-0 w-full rounded-t-md"
                      style={{ height: `${(fh / (bh + 4)) * 100}%`, background: t.accentGrad }}
                    />
                  </div>
                  <div className="mt-1 font-mono text-[9.5px]" style={{ color: t.fgMute }}>
                    &apos;{String(r.yr).slice(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr style={{ color: t.fgMute }}>
                  <th className={`${TH} text-left`}>FY</th>
                  <th className={TH}>growth %</th>
                  <th className={TH}>rev $B</th>
                  <th className={TH}>UFCF mgn %</th>
                  <th className={TH}>UFCF $M</th>
                  <th className={TH}>PV $M</th>
                </tr>
              </thead>
              <tbody>
                {m.rows.map((r, i) => (
                  <tr key={r.yr} className="border-t border-line">
                    <td className={`${TD} text-left`} style={{ color: t.fgDim }}>
                      FY{String(r.yr).slice(2)}
                    </td>
                    <td className={TD}>
                      <NumCell value={S.growth[i]} step={1} onChange={setArr("growth", i)} />
                    </td>
                    <td className={TD} style={{ color: t.ink }}>
                      {(r.rev / 1e9).toFixed(2)}
                    </td>
                    <td className={TD}>
                      <NumCell value={S.fcfM[i]} step={0.1} onChange={setArr("fcfM", i)} />
                    </td>
                    <td className={TD} style={{ color: r.ufcf < 0 ? "var(--color-hot, #dc2626)" : t.ink }}>
                      {Math.round(r.ufcf / 1e6).toLocaleString()}
                    </td>
                    <td className={TD} style={{ color: r.pv < 0 ? "var(--color-hot, #dc2626)" : t.ink }}>
                      {Math.round(r.pv / 1e6).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            FY2026 cash flow is stub-adjusted (×0.5) and discounted from the
            Jul-2026 valuation date (mid-year convention). FY2026 UFCF is negative
            — a working-capital build funding the ramp.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Tab 2 · Reverse DCF & entry price (full) --------------------------
function ReverseTab({ livePrice }: { livePrice: number }) {
  const [S, setS] = useState(() => ({
    price: livePrice,
    rw: OURS.rw,
    bRev: OURS.bRev,
    bM: OURS.bM,
    bX: OURS.bX,
    hr: OURS.hr,
    netDebt: OURS.netDebt,
    shares: OURS.shares,
    scen: JSON.parse(JSON.stringify(SCEN_DEFAULTS)) as Scen[],
  }));
  const set = (k: string) => (v: number) => setS((p: typeof S) => ({ ...p, [k]: v }));
  const setScen = (i: number, k: keyof Scen) => (v: number) =>
    setS((p: typeof S) => ({
      ...p,
      scen: p.scen.map((r: Scen, j: number) => (j === i ? { ...r, [k]: v } : r)),
    }));

  const imp = useMemo(
    () => solveImpliedGrowth(S.price, S.rw, S.netDebt, S.shares),
    [S.price, S.rw, S.netDebt, S.shares],
  );

  const ps30 = fwdPs(S.bRev, S.bM, S.bX, S.netDebt, S.shares);
  const entry = ps30 / Math.pow(1 + S.hr / 100, YRS);
  const irrM = (Math.pow(ps30 / S.price, 1 / YRS) - 1) * 100;
  const down = (1 - entry / S.price) * 100;

  const scenRows = S.scen.map((r: Scen) => {
    const p30 = fwdPs(r.rev, r.m, r.x, S.netDebt, S.shares);
    const pv = p30 / Math.pow(1 + S.rw / 100, YRS);
    return { ...r, p30, pv, wt: (pv * r.p) / 100 };
  });
  const scenTotal = scenRows.reduce((a: number, r: { wt: number }) => a + r.wt, 0);
  const probSum = S.scen.reduce((a: number, r: Scen) => a + r.p, 0);
  const irrOk = irrM >= S.hr;

  return (
    <div>
      {/* verdict strip */}
      <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["Market price", PS(S.price), "what buyers pay today", "bad"],
              ["Super-bull entry price", PS(entry), `$${S.bRev.toFixed(0)}B rev · ${S.bM.toFixed(0)}% mgn · ${S.bX.toFixed(0)}× · ${S.hr.toFixed(0)}% hurdle`, ""],
              ["Scenario-weighted value", PS(scenTotal), "probability-weighted PV", "head"],
              ["IRR if bought at market", `${irrM >= 0 ? "+" : ""}${irrM.toFixed(1)}%`, "to FY2030, bull case", irrOk ? "head" : "bad"],
            ] as const
          ).map(([k, v, sub, toneCls]) => (
            <div
              key={k}
              className="min-w-[150px] flex-1 rounded-xl border px-4 py-3"
              style={{
                borderColor:
                  toneCls === "head" ? t.accent : toneCls === "bad" ? "var(--color-hot, #dc2626)" : t.line,
                background:
                  toneCls === "head"
                    ? "var(--color-accent-soft)"
                    : toneCls === "bad"
                      ? "rgba(220,38,38,0.06)"
                      : t.surface,
              }}
            >
              <div className="text-[11.5px]" style={{ color: t.fgDim }}>
                {k}
              </div>
              <div className="text-[24px] font-semibold tabular-nums tracking-tight" style={{ color: t.ink }}>
                {v}
              </div>
              <div className="text-[10.5px]" style={{ color: t.fgMute }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-xl border-l-[3px] px-4 py-3 text-[13px] leading-relaxed"
          style={{ borderColor: "#d97706", background: "#fdf6ec", color: t.ink2 }}
        >
          <b>
            Sell / avoid at {PS(S.price)} — buy below {PS(entry)}.
          </b>{" "}
          Even conceding the full bull case (FY2030 revenue of ${S.bRev.toFixed(0)}B
          — {((S.bRev * 1e9) / BASE_REV).toFixed(1)}× today — at {S.bM.toFixed(0)}%
          EBITDA margins and a {S.bX.toFixed(0)}× mature multiple), a buyer today
          earns {irrM.toFixed(1)}%/yr. The stock must fall ~{down.toFixed(0)}%
          before it pays a {S.hr.toFixed(0)}% hurdle.{" "}
          {imp
            ? `Meanwhile the market price implies ${imp.g.toFixed(0)}%/yr revenue growth for five straight years (${B(imp.rev)} by FY2030).`
            : ""}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* reverse DCF */}
        <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            1 · Reverse DCF — what does the price imply?
          </h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
            expectations investing: invert the model
          </p>
          <Slider label="Market price" ours="defaults to the live quote" value={S.price} fmt={PS} min={20} max={400} step={0.5} onChange={set("price")} />
          <Slider label="Reasonable discount rate" ours={`ours: ${OURS.rw}% — the market's rate, not our 21.0% company WACC`} value={S.rw} fmt={P1} min={7} max={16} step={0.1} onChange={set("rw")} />
          <div className="mt-2">
            <Row k="Implied revenue growth, next 5 yrs (constant)" v={imp ? `${P1(imp.g)} /yr` : "—"} />
            <Row k="Implied FY2030 revenue" v={imp ? B(imp.rev) : "—"} />
            <Row k="× today's revenue ($2.02B)" v={imp ? `${(imp.rev / BASE_REV).toFixed(0)}×` : "—"} />
            <Row k="Our team's bull path gets to" v="$9.34B" />
            <Row k="Gap: market vs our bull case" v={imp ? `${(imp.rev / 9.34e9).toFixed(1)}×` : "—"} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            Method: hold the workbook&apos;s UFCF-margin ramp and 50/50 terminal
            blend, then solve for the constant revenue growth that makes the
            blended value equal the market price. The answer is the growth the
            market is paying for in advance.
          </p>
        </div>

        {/* entry price */}
        <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            2 · Entry price — when does it become a buy?
          </h3>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
            value FY2030 forward, discount back at your hurdle
          </p>
          <Slider label="Bull-case FY2030 revenue" ours={`ours: $${OURS.bRev}B — our super-bull case`} value={S.bRev} fmt={(n) => `$${n.toFixed(1)}B`} min={4} max={40} step={0.5} onChange={set("bRev")} />
          <Slider label="Mature EBITDA margin (FY2030)" ours={`ours: ${OURS.bM}% — mature industrial-tech leader`} value={S.bM} fmt={P1} min={8} max={30} step={0.5} onChange={set("bM")} />
          <Slider label="Mature EV/EBITDA multiple" ours={`ours: ${OURS.bX}× — post-entry, competed-down multiple`} value={S.bX} fmt={(n) => `${n.toFixed(1)}×`} min={6} max={25} step={0.5} onChange={set("bX")} />
          <Slider label="Required IRR (hurdle)" ours={`ours: ${OURS.hr}% — our demanded annual return`} value={S.hr} fmt={P1} min={8} max={25} step={0.5} onChange={set("hr")} />
          <div className="mt-2">
            <Row k="FY2030 EBITDA" v={B(S.bRev * 1e9 * (S.bM / 100))} />
            <Row k="FY2030 value / share" v={PS(ps30)} />
            <Row k="Entry price today (buy trigger)" v={PS(entry)} strong />
            <Row k="IRR if you instead pay market price" v={`${irrM >= 0 ? "+" : ""}${irrM.toFixed(1)}% /yr`} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            entry = (rev₃₀ × margin × multiple − net debt) ÷ shares ÷
            (1+hurdle)^4.5 — this concedes the whole bull story and still demands
            to be paid for the risk. Whatever it prints is the slide: &quot;we are
            buyers below $X.&quot;
          </p>
        </div>
      </div>

      {/* scenarios */}
      <div className="mt-5 rounded-2xl border border-line p-6" style={{ background: t.surface }}>
        <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
          3 · Scenario-weighted value
        </h3>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
          edit any cell · probabilities auto-checked · ours: 25/50/25 bull-base-bear
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr style={{ color: t.fgMute }}>
                <th className={`${TH} text-left`}>Scenario</th>
                <th className={TH}>prob %</th>
                <th className={TH}>FY30 rev $B</th>
                <th className={TH}>EBITDA mgn %</th>
                <th className={TH}>EV/EBITDA ×</th>
                <th className={TH}>FY30 $/sh</th>
                <th className={TH}>PV today</th>
                <th className={TH}>weighted</th>
              </tr>
            </thead>
            <tbody>
              {scenRows.map((r: Scen & { p30: number; pv: number; wt: number }, i: number) => (
                <tr key={r.name} className="border-t border-line">
                  <td className={`${TD} text-left`} style={{ color: t.fgDim }}>
                    {r.name}
                  </td>
                  <td className={TD}><NumCell value={r.p} step={5} onChange={setScen(i, "p")} /></td>
                  <td className={TD}><NumCell value={r.rev} step={0.5} onChange={setScen(i, "rev")} /></td>
                  <td className={TD}><NumCell value={r.m} step={1} onChange={setScen(i, "m")} /></td>
                  <td className={TD}><NumCell value={r.x} step={0.5} onChange={setScen(i, "x")} /></td>
                  <td className={TD} style={{ color: t.ink }}>{PS(Math.max(r.p30, 0))}</td>
                  <td className={TD} style={{ color: t.ink }}>{PS(Math.max(r.pv, 0))}</td>
                  <td className={TD} style={{ color: t.ink }}>{PS(Math.max(r.wt, 0))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line">
                <td className={`${TD} text-left font-semibold`} style={{ color: t.ink }}>
                  Probability-weighted value
                </td>
                <td className={TD} style={{ color: probSum === 100 ? t.fgMute : "var(--color-hot, #dc2626)" }}>
                  {probSum}%
                </td>
                <td colSpan={5} />
                <td className={`${TD} font-bold`} style={{ color: t.ink }}>
                  {PS(scenTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
          Bull = Bloom becomes the default behind-the-meter power layer for AI data
          centers. Base = strong but normal industrial growth, margins mature
          mid-teens. Bear = data-center capex digests; grid, turbines, and SMRs
          compress pricing. The dispersion between rows is the argument for
          demanding a margin of safety before entry.
        </p>
      </div>

      {/* completed-workbook findings: 10-year fade solve + rate–growth frontier */}
      <div className="mt-5 rounded-2xl border border-line p-6" style={{ background: t.surface }}>
        <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
          4 · The completed workbook&apos;s own solve — and the rate–growth frontier
        </h3>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
          10-yr linear fade to 3.5% · 20% terminal FCF margin · goal-seeked on year-one growth
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: t.fgDim }}>
          The finished model runs the same inversion over a ten-year fade. At its
          own 21% WACC and the $257.98 pin, the price requires <b>124% year-one
          growth</b> fading to 3.5% — <b>~$210B of FY2036 revenue, 5.6× the
          disclosed 5 GW/yr capacity ceiling</b> ($37.5B of product revenue at
          $7.5B/GW). No terminal cash margin escapes it:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr style={{ color: t.fgMute }}>
                <th className={`${TH} text-left`}>Terminal FCF margin</th>
                <th className={TH}>implied yr-1 growth</th>
                <th className={TH}>10-yr CAGR</th>
                <th className={TH}>FY2036 revenue</th>
                <th className={TH}>× capacity ceiling</th>
              </tr>
            </thead>
            <tbody>
              {WB_MARGIN_TABLE.map((r) => (
                <tr key={r.m} className="border-t border-line">
                  <td className={`${TD} text-left`} style={{ color: t.fgDim }}>{r.m}</td>
                  <td className={TD}>{r.g1}</td>
                  <td className={TD}>{r.cagr}</td>
                  <td className={TD}>{r.rev36}</td>
                  <td className={`${TD} font-semibold`} style={{ color: "var(--color-hot, #dc2626)" }}>{r.ceil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: t.fgDim }}>
          But the finding is deliberately <i>not</i> &quot;overvalued at 21%&quot; —
          it&apos;s the frontier. Re-run at the July 14 pin ($243.40 · EV $69.4B)
          across discount rates, the burden falls three-quarters by 10.5%, and the
          disclosed capacity ceiling binds exactly near <b>9.5%</b>. The price is
          internally consistent only if Bloom is discounted like a mature
          industrial <i>and</i> ships its full disclosed ceiling in perpetuity at
          a 20% cash margin (vs a 3.6% operating margin today):
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr style={{ color: t.fgMute }}>
                <th className={`${TH} text-left`}>Discount rate</th>
                <th className={TH}>implied yr-1 growth</th>
                <th className={TH}>FY2036 revenue</th>
                <th className={TH}>shipments GW/yr</th>
                <th className={TH}>× 5 GW ceiling</th>
                <th className={`${TH} text-left`}>share of demand pies</th>
              </tr>
            </thead>
            <tbody>
              {FRONTIER.map((r) => {
                const binds = r.r === "9.5%";
                return (
                  <tr key={r.r} className="border-t border-line" style={binds ? { background: "var(--color-accent-soft)" } : undefined}>
                    <td className={`${TD} text-left font-semibold`} style={{ color: binds ? t.accent : t.ink }}>{r.r}</td>
                    <td className={TD}>{r.g1}</td>
                    <td className={TD}>{r.rev36}</td>
                    <td className={TD}>{r.gw}</td>
                    <td className={`${TD} font-semibold`} style={{ color: binds ? t.accent : t.ink }}>{r.ceil}</td>
                    <td className={`${TD} text-left`} style={{ color: t.fgMute }}>{r.pie}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
          Source: completed v5 workbook (Reverse DCF tab, pinned Jun 27) and the
          reverse-DCF experiments annex (re-pulled at the Jul 14 pin; constant
          20% margin from year one is generous to the market case, so every row
          is a lower bound). This is why the sliders above solve at a
          market-level ~10.5% rate — the honest form of the claim is the
          frontier, and our entry-price math already lives on its defensible
          edge.
        </p>
      </div>
    </div>
  );
}

/** Full lab — rendered by app/valuation/page.tsx. */
export function ValuationLab() {
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 300;
  const [tab, setTab] = useState<0 | 1>(0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
        The valuation lab · every assumption editable
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: t.ink }}>
        Break the model. Please.
      </h1>
      <p className="mt-4 max-w-3xl text-[16px] leading-relaxed" style={{ color: t.fgDim }}>
        The reverse DCF drives our price targets; the group DCF is the workbook it
        inverts. Every slider shows the value our model uses (&quot;ours: …&quot;) —
        drag anything and see what has to be true for a different answer.
      </p>

      <div className="mt-8 inline-flex overflow-hidden rounded-full border border-line">
        {["Reverse DCF & entry price (our PT engine)", "The group DCF"].map((label, i) => {
          const on = tab === i;
          return (
            <button
              key={label}
              onClick={() => setTab(i as 0 | 1)}
              className="px-5 py-2.5 text-[13.5px] font-medium transition-colors"
              style={{
                background: on ? "var(--color-accent-soft)" : t.surface,
                color: on ? t.accent : t.fgDim,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">{tab === 0 ? <ReverseTab livePrice={p} /> : <DcfTab />}</div>

      <p className="mt-6 text-[12.5px]" style={{ color: t.fgMute }}>
        {valuation.note}
      </p>
    </div>
  );
}
