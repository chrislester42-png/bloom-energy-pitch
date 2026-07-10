"use client";

import { useMemo, useState } from "react";
import { Section, SectionHeader, Reveal } from "./ui";
import { t } from "./tokens";
import { valuation } from "@/data/content";
import { useLivePrice } from "./LivePrice";

/**
 * Valuation — the report's valuation section, fully interactive.
 * Ports the two standalone labs into the site:
 *   Tab 1 · The DCF        (mirror of the group workbook: 5-yr UFCF,
 *                            Gordon + EBITDA-exit terminal, 50/50 blend)
 *   Tab 2 · Reverse DCF    (what the price implies · hurdle-rate entry
 *                            price · probability-weighted scenarios)
 * Same engine and defaults as valuation-lab.html / reverse-dcf-lab.html.
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
  value,
  fmt,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  fmt: (n: number) => string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
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
    <div
      className="flex items-center justify-between border-b border-line py-1.5 text-[13px]"
    >
      <span style={{ color: t.fgDim, fontWeight: strong ? 600 : 400 }}>{k}</span>
      <span
        className="font-mono font-semibold tabular-nums"
        style={{ color: t.ink }}
      >
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

// ---------- Tab 1 · The DCF -------------------------------------------------
const DCF_DEFAULTS = {
  wacc: 21.03,
  gTerm: 3.5,
  exMult: 13.5,
  ebM: 15.82,
  blend: 50,
  price: 257.98,
  netDebt: 160.621, // $M (workbook)
  shares: 284.44, // M (workbook)
  growth: [70, 45, 30, 22, 18],
  fcfM: [-1.31, 1.98, 4.75, 6.7, 8.01],
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
  const perpTV = (ufcf2030 * (1 + g)) / (wacc - g);
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
  const [S, setS] = useState<DcfState>(() =>
    JSON.parse(JSON.stringify(DCF_DEFAULTS)),
  );
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
      <div
        className="rounded-2xl border border-line p-6"
        style={{ background: t.surface }}
      >
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
              <div
                className="text-[26px] font-semibold tabular-nums tracking-tight"
                style={{ color: t.ink }}
              >
                {PS(v)}
              </div>
              <UpPill ps={v} price={S.price} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
          The perpetuity leg is the pure discounted-cash-flow answer; the blended
          figure is lifted by the EBITDA-exit leg (a multiple, not discounting).
          Two independent methods, one honest range.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* global assumptions */}
        <div
          className="rounded-2xl border border-line p-6"
          style={{ background: t.surface }}
        >
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            Global assumptions
          </h3>
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: t.fgMute }}
          >
            shared across both terminal methods
          </p>
          <Slider label="Discount rate (WACC)" value={S.wacc} fmt={P1} min={6} max={30} step={0.01} onChange={set("wacc")} />
          <Slider label="Terminal growth (perpetual)" value={S.gTerm} fmt={P1} min={1} max={6} step={0.1} onChange={set("gTerm")} />
          <Slider label="Terminal EBITDA exit multiple" value={S.exMult} fmt={(n) => `${n.toFixed(1)}×`} min={5} max={30} step={0.5} onChange={set("exMult")} />
          <Slider label="FY2030 EBITDA margin (exit leg)" value={S.ebM} fmt={P1} min={8} max={24} step={0.1} onChange={set("ebM")} />
          <Slider label="Blend — perpetuity vs EBITDA" value={S.blend} fmt={(n) => `${n}% / ${100 - n}%`} min={0} max={100} step={5} onChange={set("blend")} />
          <Slider label="Reference share price (for upside)" value={S.price} fmt={PS} min={20} max={400} step={0.5} onChange={set("price")} />
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
              Reset to workbook defaults
            </button>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            Workbook uses $161M net debt &amp; 284.4M shares. Set 456 / 319.7
            (FactSet Q1&apos;26) to see the capital-structure sensitivity we flagged.
          </p>
          <div className="mt-4 border-t border-line pt-2">
            <Row k="PV of stage-1 UFCF" v={B(m.pvStage1)} />
            <Row k="Net debt" v={M(m.netDebt)} />
            <Row k="Implied WACC to match price" v={iw ? P1(iw) : "—"} />
            <Row k="Terminal as % of EV (perp / exit)" v={`${(m.perpPct * 100).toFixed(0)}% / ${(m.ebPct * 100).toFixed(0)}%`} />
          </div>
        </div>

        {/* forecast table */}
        <div
          className="rounded-2xl border border-line p-6"
          style={{ background: t.surface }}
        >
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            Forecast — edit growth &amp; FCF margin per year
          </h3>
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: t.fgMute }}
          >
            FY2026–FY2030 · the table is the model
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
                      style={{
                        height: `${(fh / (bh + 4)) * 100}%`,
                        background: t.accentGrad,
                      }}
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

// ---------- Tab 2 · Reverse DCF & entry price -------------------------------
const FCFM_RAMP = [-1.31, 1.98, 4.75, 6.7, 8.01];
const G_TERM = 3.5,
  EX_MULT = 13.5,
  EB_M = 15.82;

interface Scen {
  name: string;
  p: number;
  rev: number;
  m: number;
  x: number;
}

const REV_DEFAULTS = {
  rw: 10.5,
  bRev: 15,
  bM: 22,
  bX: 16,
  hr: 12,
  netDebt: 456, // $M (FactSet Q1'26)
  shares: 319.7, // M
  scen: [
    { name: "Bull — AI power land-grab won", p: 25, rev: 15, m: 22, x: 16 },
    { name: "Base — strong industrial grower", p: 50, rev: 9.2, m: 16, x: 12 },
    { name: "Bear — capex digestion / competition", p: 25, rev: 5, m: 10, x: 8 },
  ] as Scen[],
};

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
    (pv1 + (u * (1 + g)) / (wacc - g) / Math.pow(1 + wacc, YRS) - nd) / sh;
  const eb =
    (pv1 + ((rev * (EB_M / 100) * EX_MULT) / Math.pow(1 + wacc, YRS)) - nd) / sh;
  return { ps: (perp + eb) / 2, rev2030: rev };
}

function ReverseTab({ livePrice }: { livePrice: number }) {
  const [S, setS] = useState(() => ({
    ...JSON.parse(JSON.stringify(REV_DEFAULTS)),
    price: livePrice,
  }));
  const set = (k: string) => (v: number) => setS((p: typeof S) => ({ ...p, [k]: v }));
  const setScen = (i: number, k: keyof Scen) => (v: number) =>
    setS((p: typeof S) => {
      const scen = p.scen.map((r: Scen, j: number) =>
        j === i ? { ...r, [k]: v } : r,
      );
      return { ...p, scen };
    });

  const imp = useMemo(() => {
    let lo = 0,
      hi = 400;
    if (blendConstG(hi, S.rw, S.netDebt, S.shares).ps < S.price) return null;
    for (let i = 0; i < 70; i++) {
      const m = (lo + hi) / 2;
      if (blendConstG(m, S.rw, S.netDebt, S.shares).ps < S.price) lo = m;
      else hi = m;
    }
    const g = (lo + hi) / 2;
    return { g, rev: blendConstG(g, S.rw, S.netDebt, S.shares).rev2030 };
  }, [S]);

  const fwd = (revB: number, mPct: number, mult: number) =>
    (revB * 1e9 * (mPct / 100) * mult - S.netDebt * 1e6) / (S.shares * 1e6);

  const ps30 = fwd(S.bRev, S.bM, S.bX);
  const entry = ps30 / Math.pow(1 + S.hr / 100, YRS);
  const irrM = (Math.pow(ps30 / S.price, 1 / YRS) - 1) * 100;
  const down = (1 - entry / S.price) * 100;

  const scenRows = S.scen.map((r: Scen) => {
    const p30 = fwd(r.rev, r.m, r.x);
    const pv = p30 / Math.pow(1 + S.rw / 100, YRS);
    return { ...r, p30, pv, wt: (pv * r.p) / 100 };
  });
  const scenTotal = scenRows.reduce((a: number, r: { wt: number }) => a + r.wt, 0);
  const probSum = S.scen.reduce((a: number, r: Scen) => a + r.p, 0);
  const irrOk = irrM >= S.hr;

  return (
    <div>
      {/* verdict strip */}
      <div
        className="rounded-2xl border border-line p-6"
        style={{ background: t.surface }}
      >
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
              <div
                className="text-[24px] font-semibold tabular-nums tracking-tight"
                style={{ color: t.ink }}
              >
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
          style={{
            borderColor: "#d97706",
            background: "#fdf6ec",
            color: t.ink2,
          }}
        >
          <b>
            Sell / avoid at {PS(S.price)} — buy below {PS(entry)}.
          </b>{" "}
          Even conceding the full bull case (FY2030 revenue of $
          {S.bRev.toFixed(0)}B — {((S.bRev * 1e9) / BASE_REV).toFixed(1)}× today —
          at {S.bM.toFixed(0)}% EBITDA margins and a {S.bX.toFixed(0)}× mature
          multiple), a buyer today earns {irrM.toFixed(1)}%/yr. The stock must fall
          ~{down.toFixed(0)}% before it pays a {S.hr.toFixed(0)}% hurdle.{" "}
          {imp
            ? `Meanwhile the market price implies ${imp.g.toFixed(0)}%/yr revenue growth for five straight years (${B(imp.rev)} by FY2030).`
            : ""}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* reverse DCF */}
        <div
          className="rounded-2xl border border-line p-6"
          style={{ background: t.surface }}
        >
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            1 · Reverse DCF — what does the price imply?
          </h3>
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: t.fgMute }}
          >
            expectations investing: invert the model
          </p>
          <Slider label="Market price" value={S.price} fmt={PS} min={20} max={400} step={0.5} onChange={set("price")} />
          <Slider label="Reasonable discount rate (the market's, not the 21% WACC)" value={S.rw} fmt={P1} min={7} max={16} step={0.1} onChange={set("rw")} />
          <div className="mt-2">
            <Row k="Implied revenue growth, next 5 yrs (constant)" v={imp ? `${P1(imp.g)} /yr` : "—"} />
            <Row k="Implied FY2030 revenue" v={imp ? B(imp.rev) : "—"} />
            <Row k="× today's revenue ($2.02B)" v={imp ? `${(imp.rev / BASE_REV).toFixed(0)}×` : "—"} />
            <Row k="Your team's bull path gets to" v="$9.34B" />
            <Row k="Gap: market vs your bull case" v={imp ? `${(imp.rev / 9.34e9).toFixed(1)}×` : "—"} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: t.fgMute }}>
            Method: hold the workbook&apos;s UFCF-margin ramp and 50/50 terminal
            blend, then solve for the constant revenue growth that makes the
            blended value equal the market price. The answer is the growth the
            market is paying for in advance.
          </p>
        </div>

        {/* entry price */}
        <div
          className="rounded-2xl border border-line p-6"
          style={{ background: t.surface }}
        >
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            2 · Entry price — when does it become a buy?
          </h3>
          <p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: t.fgMute }}
          >
            value FY2030 forward, discount back at your hurdle
          </p>
          <Slider label="Bull-case FY2030 revenue" value={S.bRev} fmt={(n) => `$${n.toFixed(1)}B`} min={4} max={40} step={0.5} onChange={set("bRev")} />
          <Slider label="Mature EBITDA margin (FY2030)" value={S.bM} fmt={P1} min={8} max={30} step={0.5} onChange={set("bM")} />
          <Slider label="Mature EV/EBITDA multiple" value={S.bX} fmt={(n) => `${n.toFixed(1)}×`} min={6} max={25} step={0.5} onChange={set("bX")} />
          <Slider label="Required IRR (hurdle)" value={S.hr} fmt={P1} min={8} max={25} step={0.5} onChange={set("hr")} />
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
      <div
        className="mt-5 rounded-2xl border border-line p-6"
        style={{ background: t.surface }}
      >
        <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
          3 · Scenario-weighted value
        </h3>
        <p
          className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: t.fgMute }}
        >
          edit any cell · probabilities auto-checked · PV at the panel-1 discount rate
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
                <td
                  className={TD}
                  style={{ color: probSum === 100 ? t.fgMute : "var(--color-hot, #dc2626)" }}
                >
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
    </div>
  );
}

// ---------- the section -----------------------------------------------------
export function Valuation() {
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 300;
  const [tab, setTab] = useState<0 | 1>(0);

  return (
    <Section id="valuation" tone="surface">
      <SectionHeader {...valuation} />

      <Reveal i={2}>
        <div className="mt-10 inline-flex overflow-hidden rounded-full border border-line">
          {["The DCF", "Reverse DCF & entry price"].map((label, i) => {
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
      </Reveal>

      <div className="mt-6">
        {tab === 0 ? <DcfTab /> : <ReverseTab livePrice={p} />}
      </div>

      <Reveal>
        <p className="mt-5 text-[12.5px]" style={{ color: t.fgMute }}>
          {valuation.note}
        </p>
      </Reveal>
    </Section>
  );
}
