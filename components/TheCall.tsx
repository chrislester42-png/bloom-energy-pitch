"use client";

import { useMemo, useState } from "react";
import { Section, SectionHeader, Reveal } from "./ui";
import { PeerComps } from "./PeerComps";
import { t } from "./tokens";
import { theCall, market } from "@/data/content";
import {
  scenarios,
  scenarioProbs,
  valuePerShare,
  latest,
  HORIZON_YEARS,
  DISC_RATE,
  DISC_YEARS,
} from "@/data/financials";
import { triggerPrice } from "./BuyTrigger";
import { useLivePrice } from "./LivePrice";

type Key = "bear" | "base" | "bull";
const ORDER: Key[] = ["bear", "base", "bull"];
const LABEL: Record<Key, string> = { bear: "Bear", base: "Base", bull: "Bull" };
const BLURB: Record<Key, string> = {
  bear: "Capex digestion; grid, turbines and SMRs compress pricing. FY2030: $5B revenue, 10% margin, 8×.",
  base: "Strong but normal industrial grower; margins mature mid-teens. FY2030: $9.2B revenue, 16% margin, 12×.",
  bull: "AI power land-grab won — the default behind-the-meter layer. FY2030: $15B revenue, 22% margin, 16×.",
};

const PS = (n: number) => `$${n.toFixed(0)}`;
const PCT = (n: number) => `${(n * 100).toFixed(0)}%`;
const disc = (n: number) => n / Math.pow(1 + DISC_RATE, DISC_YEARS);

export function TheCall() {
  const [active, setActive] = useState<Key>("base");
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 300;
  const trig = useMemo(() => triggerPrice(), []);

  // Same three cases as the valuation lab's scenario table:
  // FY2030 value/share, then PV at the market-level discount rate.
  const results = ORDER.map((k) => {
    const out = valuePerShare(scenarios[k]);
    return { k, ...out, pv: disc(out.perShare), prob: scenarioProbs[k] };
  });
  const weighted = results.reduce((a, r) => a + r.pv * r.prob, 0);
  const maxPv = Math.max(...results.map((r) => r.pv));
  const sel = scenarios[active];
  const selOut = valuePerShare(sel);

  return (
    <Section id="the-call" tone="surface">
      <SectionHeader {...theCall} />

      {/* scenario selector — identical cases to the valuation lab */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {results.map(({ k, perShare, pv, prob }, i) => {
          const on = k === active;
          return (
            <Reveal key={k} i={i}>
              <button
                onClick={() => setActive(k)}
                className="w-full rounded-2xl border p-6 text-left transition-all hover:-translate-y-[1px]"
                style={{
                  background: on ? "var(--color-accent-soft)" : t.surface,
                  borderColor: on ? t.accent : t.line,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: on ? t.accent : t.fgMute }}
                  >
                    {LABEL[k]}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums" style={{ color: t.fgMute }}>
                    {PCT(prob)} odds
                  </span>
                </div>
                <div
                  className="mt-1 text-4xl font-semibold tabular-nums tracking-tight"
                  style={{ color: t.ink }}
                >
                  {PS(pv)}
                </div>
                <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: t.fgMute }}>
                  worth today · FY2030 value {PS(perShare)}
                </div>
                {/* comparison bar */}
                <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: t.line }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(pv / maxPv) * 100}%`,
                      background: on ? t.accentGrad : "rgba(10,10,10,0.25)",
                    }}
                  />
                </div>
                <p className="mt-3 text-[13px] leading-snug" style={{ color: t.fgDim }}>
                  {BLURB[k]}
                </p>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* weighted value + selected assumptions */}
      <Reveal>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
          {[
            ["Revenue CAGR", PCT(sel.revCagr)],
            ["EBITDA margin", PCT(sel.ebitdaMargin)],
            ["Exit multiple", `${sel.exitMultiple.toFixed(0)}×`],
            [`FY${latest.fy + HORIZON_YEARS} EV`, `$${(selOut.enterpriseValue / 1e9).toFixed(0)}B`],
            ["Probability-weighted value", PS(weighted)],
          ].map(([k, v], i) => (
            <div key={k} className="px-5 py-5" style={{ background: t.surface }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: i === 4 ? t.accent : t.fgMute }}>
                {k}
              </div>
              <div className="mt-1 text-[19px] font-semibold tabular-nums" style={{ color: t.ink }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
          Same three cases, probabilities ({PCT(scenarioProbs.bear)}/
          {PCT(scenarioProbs.base)}/{PCT(scenarioProbs.bull)}), and discounting
          (mid-2026 → FY2030 at {(DISC_RATE * 100).toFixed(1)}%) as the Valuation
          section&apos;s scenario table — one model, one set of numbers.
        </p>
      </Reveal>

      {/* the street view — how the sell side sees it */}
      <Reveal>
        <div className="mt-10">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: t.accent }}>
              The street view
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.fgMute }}>
              12-month price targets · July 2026
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {market.streetPTs.map((s) => (
              <div key={s.firm} className="px-4 py-4" style={{ background: t.surface }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.fgMute }}>
                  {s.firm}
                </div>
                <div className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight" style={{ color: t.ink }}>
                  ${s.pt.toFixed(0)}
                </div>
                <div className="mt-0.5 text-[10.5px] leading-snug" style={{ color: t.fgMute }}>
                  {s.note}
                </div>
              </div>
            ))}
            <div
              className="px-4 py-4"
              style={{ background: "var(--color-accent-soft)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.accent }}>
                Our buy trigger
              </div>
              <div className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight" style={{ color: t.accent }}>
                ${trig.toFixed(0)}
              </div>
              <div className="mt-0.5 text-[10.5px] leading-snug" style={{ color: t.fgMute }}>
                bull case at a 12% hurdle — not a 12-month guess
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
            Why the gap? A 12-month target asks where the stock trades next year
            — momentum-anchored forward multiples, barely discounted. Our trigger
            asks when a buyer is paid for the risk. Note the pattern: targets were
            re-anchored ~10–20% above spot within days of the Brookfield news, the
            lowest firm target still sits ~{((246 / trig - 1) * 100).toFixed(0)}%
            above our trigger, and 0 of 21 analysts says sell.
          </p>
        </div>
      </Reveal>

      {/* peer comps */}
      <PeerComps />

      {/* balanced conclusion */}
      <Reveal>
        <div
          className="mt-6 rounded-2xl border p-7 sm:p-9"
          style={{ background: t.bgDeep, borderColor: t.line }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-[3px]" style={{ background: t.accentGrad }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: t.accent }}>
              Where we land
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed" style={{ color: t.ink2 }}>
            {theCall.conclusion}
          </p>
          <p className="mt-4 text-[12.5px]" style={{ color: t.fgMute }}>
            At {ok ? `the live price of $${p.toFixed(0)}` : `a reference price of $${p.toFixed(0)}`},
            the market sits above even our bull case&apos;s value today ({PS(results[2].pv)}).
            Street consensus target {PS(market.consensusPT)} ({market.source}); a
            published bear case sits at {PS(market.bearPT)} (24/7 Wall St). {theCall.note}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
