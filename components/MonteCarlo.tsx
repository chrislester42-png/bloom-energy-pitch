"use client";

import { useMemo, useState } from "react";
import { Section, SectionHeader, Reveal } from "./ui";
import { t } from "./tokens";
import { useLivePrice } from "./LivePrice";
import { latest, scenarios, valuePerShare, HORIZON_YEARS } from "@/data/financials";

/**
 * Monte Carlo valuation — instead of three point scenarios, price the whole
 * distribution. Each driver is a triangular distribution (min / most-likely /
 * max); a "correlation" dial ties the drivers to a shared world-quality factor
 * (in good worlds growth, margins AND the exit multiple are all high — which
 * is what fattens the tails in real life).
 */

const N_DRAWS = 20000;
const N_BINS = 56;

type Tri = { min: number; mode: number; max: number };

interface Params {
  revCagr: Tri;   // as decimals
  margin: Tri;
  multiple: Tri;
  rho: number;    // 0..1 correlation to shared factor
}

const DEFAULTS: Params = {
  revCagr:  { min: 0.10, mode: 0.32, max: 0.60 },
  margin:   { min: 0.06, mode: 0.13, max: 0.22 },
  multiple: { min: 10,   mode: 22,   max: 40 },
  rho: 0.6,
};

// deterministic PRNG so the chart doesn't shimmer on every re-render
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

// inverse-CDF sample of a triangular distribution from uniform u
function triSample(d: Tri, u: number) {
  const { min, mode, max } = d;
  const fc = (mode - min) / (max - min || 1e-9);
  return u < fc
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function simulate(p: Params): Float64Array {
  const rnd = mulberry32(42);
  const out = new Float64Array(N_DRAWS);
  for (let i = 0; i < N_DRAWS; i++) {
    // shared world-quality factor + independent noise, blended by rho
    const w = rnd();
    const u1 = p.rho * w + (1 - p.rho) * rnd();
    const u2 = p.rho * w + (1 - p.rho) * rnd();
    const u3 = p.rho * w + (1 - p.rho) * rnd();
    const g = triSample(p.revCagr, u1);
    const m = triSample(p.margin, u2);
    const x = triSample(p.multiple, u3);
    const rev = latest.revenue * Math.pow(1 + g, HORIZON_YEARS);
    const eq = rev * m * x - latest.netDebt;
    out[i] = Math.max(eq / latest.dilutedShares, 0);
  }
  return out.sort();
}

const pctl = (sorted: Float64Array, q: number) =>
  sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))))];
// percentile rank of a value within the sorted draws (0..1)
function rankOf(sorted: Float64Array, v: number) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] < v) lo = m + 1; else hi = m; }
  return lo / sorted.length;
}

const PS = (n: number) => `$${n.toFixed(0)}`;

function NumCell({
  label, value, step, pct, onChange,
}: { label: string; value: number; step: number; pct?: boolean; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 py-1">
      <span className="text-[12px]" style={{ color: t.fgDim }}>{label}</span>
      <span className="flex items-center gap-1">
        <input
          type="number"
          step={step}
          value={pct ? Math.round(value * 1000) / 10 : value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(pct ? v / 100 : v);
          }}
          className="w-[64px] rounded-md border px-2 py-1 text-right font-mono text-[12px] tabular-nums outline-none"
          style={{ borderColor: t.line, background: t.surface, color: t.ink }}
        />
        <span className="w-3 font-mono text-[10px]" style={{ color: t.fgMute }}>{pct ? "%" : "×"}</span>
      </span>
    </label>
  );
}

function DriverCard({
  title, sub, tri, pct = false, step, onChange,
}: {
  title: string; sub: string; tri: Tri; pct?: boolean; step: number;
  onChange: (t: Tri) => void;
}) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: t.line, background: t.surface }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>{title}</div>
      <div className="mb-2 mt-0.5 text-[12.5px]" style={{ color: t.fgDim }}>{sub}</div>
      <NumCell label="pessimistic (min)" value={tri.min} step={step} pct={pct} onChange={(v) => onChange({ ...tri, min: v })} />
      <NumCell label="most likely (mode)" value={tri.mode} step={step} pct={pct} onChange={(v) => onChange({ ...tri, mode: v })} />
      <NumCell label="optimistic (max)" value={tri.max} step={step} pct={pct} onChange={(v) => onChange({ ...tri, max: v })} />
    </div>
  );
}

export function MonteCarlo() {
  const [p, setP] = useState<Params>(DEFAULTS);
  const { ok, price } = useLivePrice();
  const mkt = ok && price != null ? price : 300; // fallback reference

  const draws = useMemo(() => simulate(p), [p]);

  const med = pctl(draws, 0.5);
  const p10 = pctl(draws, 0.1);
  const p90 = pctl(draws, 0.9);
  const mktRank = rankOf(draws, mkt);
  const probAbove = 1 - mktRank;

  // histogram — clip the x-axis at the 99th percentile or the market price,
  // whichever is larger, so the price marker is always on the chart
  const xMax = Math.max(pctl(draws, 0.99), mkt * 1.08);
  const bins = useMemo(() => {
    const b = new Array<number>(N_BINS).fill(0);
    for (let i = 0; i < draws.length; i++) {
      const k = Math.min(N_BINS - 1, Math.floor((draws[i] / xMax) * N_BINS));
      b[k]++;
    }
    return b;
  }, [draws, xMax]);
  const binMax = Math.max(...bins);

  // scenario markers from TheCall for continuity
  const marks = (["bear", "base", "bull"] as const).map((k) => ({
    k, ps: valuePerShare(scenarios[k]).perShare,
  }));

  const W = 920, H = 240, PAD = 8;
  const xOf = (v: number) => PAD + (Math.min(v, xMax) / xMax) * (W - 2 * PAD);

  return (
    <Section id="monte-carlo" tone="deep">
      <SectionHeader
        eyebrow="Pricing the distribution"
        headline="20,000 futures, one chart."
        dek={`Point estimates hide the argument. We draw ${HORIZON_YEARS}-year growth, mature EBITDA margin and exit multiple from ranges (correlated — good worlds are good everywhere), value each future, and ask where today's price sits inside the whole distribution.`}
      />

      {/* headline stats */}
      <Reveal>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {[
            ["Median fair value", PS(med)],
            ["P10 – P90 range", `${PS(p10)} – ${PS(p90)}`],
            ["Market price sits at", `${(mktRank * 100).toFixed(0)}th pctile`],
            ["Odds value ≥ price", `${(probAbove * 100).toFixed(1)}%`],
          ].map(([k, v]) => (
            <div key={k} className="px-5 py-5" style={{ background: t.surface }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>{k}</div>
              <div className="mt-1 text-[19px] font-semibold tabular-nums" style={{ color: t.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* histogram */}
      <Reveal>
        <div className="mt-6 overflow-hidden rounded-2xl border p-5 sm:p-7" style={{ borderColor: t.line, background: t.surface }}>
          <svg viewBox={`0 0 ${W} ${H + 34}`} className="w-full" role="img"
            aria-label="Histogram of simulated fair values per share">
            {bins.map((c, i) => {
              const bw = (W - 2 * PAD) / N_BINS;
              const h = binMax ? (c / binMax) * (H - 10) : 0;
              const x0 = PAD + i * bw;
              const binLo = (i / N_BINS) * xMax;
              const above = binLo >= mkt;
              return (
                <rect key={i} x={x0 + 0.5} y={H - h} width={bw - 1} height={h} rx={1.5}
                  fill={above ? "#0f8a4d" : "rgba(10,10,10,0.18)"} opacity={above ? 0.85 : 1} />
              );
            })}
            {/* scenario markers */}
            {marks.map(({ k, ps }) => (
              <g key={k}>
                <line x1={xOf(ps)} x2={xOf(ps)} y1={12} y2={H} stroke="rgba(10,10,10,0.35)" strokeDasharray="3 3" />
                <text x={xOf(ps)} y={9} textAnchor="middle" fontSize="9.5"
                  fontFamily="ui-monospace,monospace" fill="#8c857a">
                  {k.toUpperCase()} {PS(ps)}
                </text>
              </g>
            ))}
            {/* market price marker */}
            <line x1={xOf(mkt)} x2={xOf(mkt)} y1={0} y2={H} stroke="#dc2626" strokeWidth={2} />
            <text x={Math.min(xOf(mkt) + 6, W - 90)} y={26} fontSize="11" fontWeight="600"
              fontFamily="ui-monospace,monospace" fill="#dc2626">
              market {PS(mkt)}
            </text>
            {/* x axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <text key={f} x={PAD + f * (W - 2 * PAD)} y={H + 24}
                textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"}
                fontSize="10" fontFamily="ui-monospace,monospace" fill="#8c857a">
                {PS(f * xMax)}
              </text>
            ))}
          </svg>
          <p className="mt-3 text-[12.5px]" style={{ color: t.fgMute }}>
            {N_DRAWS.toLocaleString()} draws · triangular distributions per driver, correlation {p.rho.toFixed(1)} ·
            green mass = futures worth more than today&apos;s price · dashed lines = the three point scenarios above.
          </p>
        </div>
      </Reveal>

      {/* driver inputs */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal i={0}>
          <DriverCard title="Revenue growth" sub={`CAGR, next ${HORIZON_YEARS} yrs`} tri={p.revCagr} pct step={1}
            onChange={(tri) => setP({ ...p, revCagr: tri })} />
        </Reveal>
        <Reveal i={1}>
          <DriverCard title="EBITDA margin" sub={`at FY${latest.fy + HORIZON_YEARS}`} tri={p.margin} pct step={0.5}
            onChange={(tri) => setP({ ...p, margin: tri })} />
        </Reveal>
        <Reveal i={2}>
          <DriverCard title="Exit multiple" sub="EV / EBITDA at horizon" tri={p.multiple} step={1}
            onChange={(tri) => setP({ ...p, multiple: tri })} />
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-4 flex flex-col gap-2 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: t.line, background: t.surface }}>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
              Driver correlation
            </div>
            <div className="text-[12.5px]" style={{ color: t.fgDim }}>
              0 = independent draws · 1 = one shared fate. Correlation fattens both tails — that&apos;s the honest way to model a story stock.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="range" min={0} max={1} step={0.1} value={p.rho}
              onChange={(e) => setP({ ...p, rho: parseFloat(e.target.value) })}
              className="w-40 accent-[#0f8a4d]" />
            <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: t.accent }}>
              {p.rho.toFixed(1)}
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-6 max-w-3xl text-[13px] leading-relaxed" style={{ color: t.fgMute }}>
          Reading it: if the red line sits far into the right tail, the market is paying today for one of the
          best futures we can simulate — the thesis can be right and the stock still expensive. Same engine as
          &ldquo;The Call&rdquo; above (FY{latest.fy} revenue base, FactSet Q1&apos;26 capital structure), just run
          {" "}{N_DRAWS.toLocaleString()} times instead of three. Educational model, not investment advice.
        </p>
      </Reveal>
    </Section>
  );
}
