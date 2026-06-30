"use client";

import { useState } from "react";
import { Section, SectionHeader, Reveal } from "./ui";
import { PeerComps } from "./PeerComps";
import { t } from "./tokens";
import { theCall, market } from "@/data/content";
import { scenarios, valuePerShare, latest, HORIZON_YEARS } from "@/data/financials";

type Key = "bear" | "base" | "bull";
const ORDER: Key[] = ["bear", "base", "bull"];
const LABEL: Record<Key, string> = { bear: "Bear", base: "Base", bull: "Bull" };
const BLURB: Record<Key, string> = {
  bear: "Growth fades, margins stay thin, the multiple compresses.",
  base: "Guidance roughly holds; margins keep inflecting; market-level growth multiple.",
  bull: "AI demand sustains hypergrowth; operating leverage delivers; premium multiple.",
};

const PS = (n: number) => `$${n.toFixed(0)}`;
const PCT = (n: number) => `${(n * 100).toFixed(0)}%`;

export function TheCall() {
  const [active, setActive] = useState<Key>("base");
  const results = ORDER.map((k) => ({ k, ...valuePerShare(scenarios[k]) }));
  const maxPS = Math.max(...results.map((r) => r.perShare));
  const sel = scenarios[active];
  const selOut = valuePerShare(sel);

  return (
    <Section id="the-call" tone="surface">
      <SectionHeader {...theCall} />

      {/* scenario selector */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {results.map(({ k, perShare }, i) => {
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
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: on ? t.accent : t.fgMute }}
                >
                  {LABEL[k]}
                </span>
                <div
                  className="mt-1 text-4xl font-semibold tabular-nums tracking-tight"
                  style={{ color: t.ink }}
                >
                  {PS(perShare)}
                </div>
                {/* comparison bar */}
                <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: t.line }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(perShare / maxPS) * 100}%`,
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

      {/* selected assumptions */}
      <Reveal>
        <div
          className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
        >
          {[
            ["Revenue CAGR", PCT(sel.revCagr)],
            ["EBITDA margin", PCT(sel.ebitdaMargin)],
            ["Exit multiple", `${sel.exitMultiple.toFixed(0)}×`],
            [`FY${latest.fy + HORIZON_YEARS} EV`, `$${(selOut.enterpriseValue / 1e9).toFixed(0)}B`],
          ].map(([k, v]) => (
            <div key={k} className="px-5 py-5" style={{ background: t.surface }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
                {k}
              </div>
              <div className="mt-1 text-[19px] font-semibold tabular-nums" style={{ color: t.ink }}>
                {v}
              </div>
            </div>
          ))}
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
            Street consensus target {PS(market.consensusPT)} ({market.source}); a
            published bear case sits at {PS(market.bearPT)} (24/7 Wall St). {theCall.note}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
