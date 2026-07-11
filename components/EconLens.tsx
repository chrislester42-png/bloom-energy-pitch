"use client";

import { useState } from "react";
import { Section, SectionHeader, Reveal } from "./ui";
import { t } from "./tokens";

/**
 * EconLens — the microeconomics of the thesis, in one section.
 *
 * Panel A · The shock: data-center power demand shifts right against a
 *           short-run inelastic grid supply → scarcity price → Bloom enters
 *           as the elastic segment of the supply curve.
 * Panel B · The clock: Bloom's speed advantage is a *temporary* monopoly on
 *           the customers who can't wait. As turbine/grid capacity returns
 *           (~2029–30), entry competes the economic profit away — which is
 *           exactly why our valuation uses a mature 16× multiple.
 *
 * The curves are stylized and illustrative (labeled as such), anchored to
 * sourced reference points: 82→153 GW demand, ~$121/MWh Bloom all-in cost
 * (~$95 post-ITC), turbines sold out through ~2029–30.
 */

// ---- shared chart constants -------------------------------------------------
const W = 460;
const H = 300;
const PAD = { l: 46, r: 14, t: 16, b: 38 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;

// price axis $/MWh 0–260, quantity axis 0–200 GW
const PMAX = 260;
const QMAX = 200;
const x = (q: number) => PAD.l + (q / QMAX) * PW;
const y = (p: number) => PAD.t + PH - (Math.min(p, PMAX) / PMAX) * PH;

const GRID_P = 40; // competitive grid price $/MWh (stylized)
const GRID_K = 90; // short-run grid capacity, GW (stylized)
const BLOOM_P = 121; // Bloom all-in cost $/MWh (sourced)
const DSLOPE = 2.6; // demand slope $/GW (stylized)

function Axes({ xLabel, yLabel }: { xLabel: string; yLabel: string }) {
  return (
    <>
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH} stroke="var(--color-line-strong)" />
      <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH} stroke="var(--color-line-strong)" />
      <text x={PAD.l + PW / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-fg-mute)" fontFamily="var(--font-mono, monospace)">
        {xLabel}
      </text>
      <text x={12} y={PAD.t + PH / 2} textAnchor="middle" fontSize="10" fill="var(--color-fg-mute)" fontFamily="var(--font-mono, monospace)" transform={`rotate(-90 12 ${PAD.t + PH / 2})`}>
        {yLabel}
      </text>
    </>
  );
}

function EconSlider({
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
    <div className="mt-4">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[12.5px]" style={{ color: t.fgDim }}>
          {label}
        </span>
        <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: t.accent }}>
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
        className="w-full"
        style={{ accentColor: "var(--color-accent)" }}
      />
    </div>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "hot" | "accent" }) {
  return (
    <div className="px-4 py-3" style={{ background: t.surface }}>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em]" style={{ color: t.fgMute }}>
        {k}
      </div>
      <div
        className="mt-0.5 text-[17px] font-semibold tabular-nums tracking-tight"
        style={{ color: tone === "hot" ? "var(--color-hot, #dc2626)" : tone === "accent" ? t.accent : t.ink }}
      >
        {v}
      </div>
    </div>
  );
}

// ---- Panel A · demand shock vs inelastic supply -----------------------------
function ShockPanel() {
  const [d, setD] = useState(120); // demand index, GW (82 = 2025, 153 = 2028)

  // inverse demand through (d, GRID_P): P(q) = GRID_P + DSLOPE·(d − q)
  const pAt = (q: number) => GRID_P + DSLOPE * (d - q);
  // without Bloom: supply flat at GRID_P to GRID_K, then vertical
  const pNoBloom = d <= GRID_K ? GRID_P : Math.min(pAt(GRID_K), PMAX);
  // with Bloom: supply becomes flat again at BLOOM_P
  const qBloomEq = d - (BLOOM_P - GRID_P) / DSLOPE; // where demand crosses $121
  const bloomActive = d > GRID_K && qBloomEq > GRID_K;
  const pWith = bloomActive ? BLOOM_P : pNoBloom;
  const bloomQ = bloomActive ? Math.max(0, qBloomEq - GRID_K) : 0;

  // demand line endpoints (clip to plot)
  const q0 = Math.max(0, d - (PMAX - GRID_P) / DSLOPE); // where P = PMAX
  const q1 = Math.min(QMAX, d + GRID_P / DSLOPE); // where P = 0

  return (
    <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
      <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
        A · The shock — demand outruns an inelastic grid
      </h3>
      <p className="mb-2 mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
        short-run supply &amp; demand · stylized, illustrative
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <Axes xLabel="Q — power for data centers (GW)" yLabel="P — effective price ($/MWh)" />

        {/* grid supply: flat then vertical (inelastic) */}
        <path
          d={`M ${x(0)} ${y(GRID_P)} L ${x(GRID_K)} ${y(GRID_P)} L ${x(GRID_K)} ${y(PMAX)}`}
          fill="none"
          stroke="var(--color-fg-dim)"
          strokeWidth="2"
        />
        <text x={x(GRID_K) + 5} y={y(PMAX) + 14} fontSize="10" fill="var(--color-fg-dim)" fontFamily="var(--font-mono, monospace)">
          S · grid (capacity {GRID_K} GW)
        </text>

        {/* Bloom supply extension: flat at $121 */}
        <path
          d={`M ${x(GRID_K)} ${y(BLOOM_P)} L ${x(QMAX)} ${y(BLOOM_P)}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text x={x(QMAX) - 4} y={y(BLOOM_P) - 6} textAnchor="end" fontSize="10" fill="var(--color-accent)" fontFamily="var(--font-mono, monospace)">
          S + Bloom (${BLOOM_P}/MWh, 90 days)
        </text>

        {/* demand */}
        <line x1={x(q0)} y1={y(pAt(q0))} x2={x(q1)} y2={y(pAt(q1))} stroke="var(--color-ink)" strokeWidth="2" />
        <text x={x(q1) - 4} y={y(pAt(q1)) - 6} textAnchor="end" fontSize="10" fill="var(--color-ink)" fontFamily="var(--font-mono, monospace)">
          D · AI build-out
        </text>

        {/* scarcity equilibrium without Bloom */}
        {d > GRID_K && (
          <>
            <circle cx={x(GRID_K)} cy={y(pNoBloom)} r="4" fill="var(--color-hot, #dc2626)" />
            <line x1={PAD.l} y1={y(pNoBloom)} x2={x(GRID_K)} y2={y(pNoBloom)} stroke="var(--color-hot, #dc2626)" strokeWidth="1" strokeDasharray="3 3" />
          </>
        )}
        {/* equilibrium with Bloom */}
        {bloomActive && (
          <>
            <circle cx={x(qBloomEq)} cy={y(BLOOM_P)} r="4" fill="var(--color-accent)" />
            {/* Bloom's served quantity */}
            <rect
              x={x(GRID_K)}
              y={y(BLOOM_P)}
              width={Math.max(0, x(qBloomEq) - x(GRID_K))}
              height={y(0) - y(BLOOM_P) - (PH - (y(0) - PAD.t))}
              fill="var(--color-accent)"
              opacity="0.08"
            />
          </>
        )}
      </svg>

      <EconSlider
        label="AI data-center power demand (2025 = 82 GW → 2028E = 153 GW)"
        value={d}
        fmt={(n) => `${n.toFixed(0)} GW`}
        min={82}
        max={153}
        step={1}
        onChange={setD}
      />

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
        <Stat k="Scarcity price, no Bloom" v={d > GRID_K ? `$${pNoBloom.toFixed(0)}/MWh` : `$${GRID_P}/MWh`} tone="hot" />
        <Stat k="Price with Bloom" v={`$${pWith.toFixed(0)}/MWh`} tone="accent" />
        <Stat k="Bloom's market" v={`${bloomQ.toFixed(0)} GW`} />
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgDim }}>
        The grid&apos;s short-run supply is nearly vertical — interconnection queues
        and turbine backlogs mean capacity can&apos;t respond to price. As AI demand
        shifts right, the market clears by <em>waiting</em>, not price. Bloom enters
        as the elastic segment of the supply curve at ${BLOOM_P}/MWh — expensive
        against the grid, cheap against a three-year wait.
      </p>
    </div>
  );
}

// ---- Panel B · temporary monopoly, entry, normal profit ---------------------
const YEARS_B = [2026, 2027, 2028, 2029, 2030, 2031];
// share of alternative (turbine/grid) capacity available, stylized:
const ALT_AVAIL: Record<number, number> = {
  2026: 0, 2027: 0, 2028: 0.1, 2029: 0.35, 2030: 0.7, 2031: 1,
};
const COMP_P = 95; // long-run competitive price ≈ Bloom post-ITC cost (normal profit)
const PREMIUM = 45; // max speed premium $/MWh while alternatives are sold out

const priceAt = (yr: number) => COMP_P + PREMIUM * (1 - ALT_AVAIL[yr]);

function ClockPanel() {
  const [yr, setYr] = useState(2026);
  const price = priceAt(yr);
  const profit = price - COMP_P;

  // chart: x = years, y = $/MWh 80–150
  const P2MAX = 150, P2MIN = 80;
  const xB = (i: number) => PAD.l + (i / (YEARS_B.length - 1)) * PW;
  const yB = (p: number) => PAD.t + PH - ((p - P2MIN) / (P2MAX - P2MIN)) * PH;
  const idx = YEARS_B.indexOf(yr);

  const pricePath = YEARS_B.map((y2, i) => `${i === 0 ? "M" : "L"} ${xB(i)} ${yB(priceAt(y2))}`).join(" ");
  const wedge =
    YEARS_B.map((y2, i) => `${i === 0 ? "M" : "L"} ${xB(i)} ${yB(priceAt(y2))}`).join(" ") +
    ` L ${xB(YEARS_B.length - 1)} ${yB(COMP_P)} L ${xB(0)} ${yB(COMP_P)} Z`;

  return (
    <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
      <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
        B · The clock — a temporary monopoly on speed
      </h3>
      <p className="mb-2 mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
        economic profit vs entry · stylized, illustrative
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <Axes xLabel="year — turbine supply returns ~2029–30" yLabel="$/MWh" />

        {/* economic-profit wedge */}
        <path d={wedge} fill="var(--color-accent)" opacity="0.12" />
        {/* competitive price (normal profit) */}
        <line x1={xB(0)} y1={yB(COMP_P)} x2={xB(YEARS_B.length - 1)} y2={yB(COMP_P)} stroke="var(--color-fg-dim)" strokeWidth="2" strokeDasharray="6 4" />
        <text x={xB(0) + 4} y={yB(COMP_P) + 14} fontSize="10" fill="var(--color-fg-dim)" fontFamily="var(--font-mono, monospace)">
          long-run competitive price ≈ ${COMP_P} (normal profit)
        </text>
        {/* realized price path */}
        <path d={pricePath} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <text x={xB(0) + 4} y={yB(priceAt(2026)) - 8} fontSize="10" fill="var(--color-accent)" fontFamily="var(--font-mono, monospace)">
          Bloom&apos;s realized price (speed premium)
        </text>

        {/* year markers */}
        {YEARS_B.map((y2, i) => (
          <g key={y2}>
            <text x={xB(i)} y={PAD.t + PH + 14} textAnchor="middle" fontSize="9.5" fill="var(--color-fg-mute)" fontFamily="var(--font-mono, monospace)">
              &apos;{String(y2).slice(2)}
            </text>
          </g>
        ))}
        {/* selected year */}
        <line x1={xB(idx)} y1={PAD.t} x2={xB(idx)} y2={PAD.t + PH} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <circle cx={xB(idx)} cy={yB(price)} r="5" fill="var(--color-accent)" />
      </svg>

      <EconSlider
        label="Year (gas-turbine order books are sold out through ~2029–30)"
        value={yr}
        fmt={(n) => `${n.toFixed(0)}`}
        min={2026}
        max={2031}
        step={1}
        onChange={(n) => setYr(Math.round(n))}
      />

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
        <Stat k="Alt. capacity available" v={`${(ALT_AVAIL[yr] * 100).toFixed(0)}%`} />
        <Stat k="Bloom realized price" v={`$${price.toFixed(0)}/MWh`} tone="accent" />
        <Stat k="Economic profit" v={`$${profit.toFixed(0)}/MWh`} tone={profit > 5 ? "accent" : "hot"} />
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgDim }}>
        While alternatives are sold out, Bloom prices against the customer&apos;s
        cost of waiting — a monopoly on the &quot;can&apos;t wait&quot; segment. Micro 101:
        economic profit attracts entry, and when turbine capacity returns
        (~2029–30) the premium competes away toward normal profit. Durable
        advantages (service annuity, learning curve) survive; the scarcity
        premium doesn&apos;t.
      </p>
    </div>
  );
}

// ---- section ---------------------------------------------------------------
export function EconLens() {
  return (
    <Section id="economics" tone="deep">
      <SectionHeader
        eyebrow="03b · The economics"
        headline="A supply shock, and a clock."
        dek="The thesis in two microeconomic pictures: AI demand shifting against an inelastic grid creates the scarcity Bloom monetizes — and the entry that follows is why the premium is temporary. Drag the sliders."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal i={0}>
          <ShockPanel />
        </Reveal>
        <Reveal i={1}>
          <ClockPanel />
        </Reveal>
      </div>

      <Reveal>
        <div
          className="mt-6 rounded-xl border-l-2 px-5 py-4"
          style={{ borderColor: t.accent, background: "var(--color-accent-soft)" }}
        >
          <p className="text-[14px] leading-relaxed" style={{ color: t.ink2 }}>
            <span style={{ color: t.accent, fontWeight: 600 }}>Why this matters for the valuation · </span>
            Panel B is the reason our model exits at a 16× mature multiple while
            the street pays 30×+: microeconomics says above-normal returns get
            competed away once entry is possible. The debate over Bloom&apos;s fair
            value is really a debate over how long the wedge in panel B stays open.
          </p>
          <p className="mt-2 text-[11.5px]" style={{ color: t.fgMute }}>
            Curves are stylized for exposition. Anchors: 82→153 GW US data-center
            demand 2025→2028 (McKinsey); ~$121/MWh all-in cost, ~$95 post-ITC
            (derived); turbines sold out through ~2029–30 (GE Vernova / Q1 2026 call).
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
