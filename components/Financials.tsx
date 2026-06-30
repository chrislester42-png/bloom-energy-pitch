"use client";

import { useState } from "react";
import { Section, SectionHeader, FactGrid, Reveal, SourceChip } from "./ui";
import { useLivePrice } from "./LivePrice";
import { t } from "./tokens";
import { financials, market } from "@/data/content";
import {
  annual,
  latest,
  sliderRanges,
  valuePerShare,
  HORIZON_YEARS,
  type Scenario,
} from "@/data/financials";

const B = (n: number) => `$${(n / 1e9).toFixed(2)}B`;
const PS = (n: number) => `$${n.toFixed(0)}`;
const PCT = (n: number) => `${(n * 100).toFixed(0)}%`;

/* ---------- 5-year history chart (custom SVG) ---------- */
function HistoryChart() {
  const rows = annual;
  const maxRev = Math.max(...rows.map((r) => r.revenue!));
  return (
    <div
      className="rounded-2xl border border-line p-6 sm:p-8"
      style={{ background: t.surface }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
          Revenue & EBITDA margin · FY21–25
        </h3>
        <SourceChip>SEC EDGAR</SourceChip>
      </div>
      <div className="flex items-end justify-between gap-3 sm:gap-5">
        {rows.map((r) => {
          const h = (r.revenue! / maxRev) * 150;
          const em = r.ebitdaMargin!;
          const pos = em >= 0;
          return (
            <div key={r.fy} className="flex flex-1 flex-col items-center">
              <span
                className="mb-2 text-[12px] font-semibold tabular-nums"
                style={{ color: t.ink }}
              >
                {B(r.revenue!)}
              </span>
              <div
                className="w-full max-w-[54px] rounded-t-[5px]"
                style={{ height: h, background: t.inkGrad }}
              />
              <span
                className="mt-2 font-mono text-[11px] tabular-nums"
                style={{ color: pos ? t.accent : "var(--color-hot)" }}
              >
                {pos ? "+" : ""}
                {PCT(em)}
              </span>
              <span
                className="mt-0.5 font-mono text-[10px]"
                style={{ color: t.fgMute }}
              >
                FY{String(r.fy).slice(2)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
        Bars: revenue. Below: GAAP EBITDA margin — red through FY23, green and
        rising from FY24. That sign flip is the thesis.
      </p>
    </div>
  );
}

/* ---------- Slider ---------- */
function Slider({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[13px]" style={{ color: t.fgDim }}>
          {label}
        </span>
        <span
          className="font-mono text-[15px] font-semibold tabular-nums"
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
        className="w-full"
        style={{ accentColor: "var(--color-accent)" }}
      />
    </div>
  );
}

/* ---------- Projection mini-chart ---------- */
function Projection({ s }: { s: Scenario }) {
  const years = Array.from({ length: HORIZON_YEARS + 1 }, (_, y) => {
    const rev = latest.revenue * Math.pow(1 + s.revCagr, y);
    return { y: latest.fy + y, rev, ebitda: rev * s.ebitdaMargin };
  });
  const maxRev = years[years.length - 1].rev;
  return (
    <div className="flex items-end justify-between gap-2">
      {years.map((p, i) => {
        const h = (p.rev / maxRev) * 110 + 6;
        const eh = (p.ebitda / maxRev) * 110;
        return (
          <div key={p.y} className="flex flex-1 flex-col items-center">
            <div
              className="relative w-full max-w-[44px] rounded-t-[4px]"
              style={{ height: h, background: "rgba(10,10,10,0.10)" }}
            >
              <div
                className="absolute bottom-0 w-full rounded-t-[4px]"
                style={{ height: eh, background: t.accentGrad }}
              />
            </div>
            <span
              className="mt-1.5 font-mono text-[10px]"
              style={{ color: i === years.length - 1 ? t.accent : t.fgMute }}
            >
              &apos;{String(p.y).slice(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- The interactive model ---------- */
function Model() {
  const [s, setS] = useState<Scenario>({
    revCagr: sliderRanges.revCagr.default,
    ebitdaMargin: sliderRanges.ebitdaMargin.default,
    exitMultiple: sliderRanges.exitMultiple.default,
  });
  const out = valuePerShare(s);
  const live = useLivePrice();
  const todayPrice = live.ok && live.price ? live.price : market.capProvisional / latest.dilutedShares;
  const priceIsLive = live.ok && !!live.price;
  const upside = (out.perShare / todayPrice - 1) * 100;
  const up = upside >= 0;

  return (
    <div
      className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2"
    >
      {/* inputs */}
      <div className="p-6 sm:p-8" style={{ background: t.surface }}>
        <div className="mb-6 flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: t.accentBright }}
          />
          <h3 className="text-[15px] font-semibold" style={{ color: t.ink }}>
            Drive the model
          </h3>
        </div>
        <div className="space-y-6">
          <Slider
            label={`Revenue CAGR (${HORIZON_YEARS}-yr)`}
            value={s.revCagr}
            min={sliderRanges.revCagr.min}
            max={sliderRanges.revCagr.max}
            step={sliderRanges.revCagr.step}
            fmt={PCT}
            onChange={(v) => setS({ ...s, revCagr: v })}
          />
          <Slider
            label="Steady-state EBITDA margin"
            value={s.ebitdaMargin}
            min={sliderRanges.ebitdaMargin.min}
            max={sliderRanges.ebitdaMargin.max}
            step={sliderRanges.ebitdaMargin.step}
            fmt={PCT}
            onChange={(v) => setS({ ...s, ebitdaMargin: v })}
          />
          <Slider
            label="Exit EV / EBITDA multiple"
            value={s.exitMultiple}
            min={sliderRanges.exitMultiple.min}
            max={sliderRanges.exitMultiple.max}
            step={sliderRanges.exitMultiple.step}
            fmt={(n) => `${n.toFixed(1)}×`}
            onChange={(v) => setS({ ...s, exitMultiple: v })}
          />
        </div>
        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: t.fgMute }}>
              Projected revenue → EBITDA (green)
            </span>
            <span className="font-mono text-[11px]" style={{ color: t.fgMute }}>
              FY{latest.fy}–{latest.fy + HORIZON_YEARS}
            </span>
          </div>
          <Projection s={s} />
        </div>
      </div>

      {/* outputs */}
      <div className="p-6 sm:p-8" style={{ background: t.sunken }}>
        <span
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: t.fgMute }}
        >
          Implied value / share
        </span>
        <div
          className="mt-1 text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl"
          style={{ color: t.ink }}
        >
          {PS(out.perShare)}
        </div>
        <div
          className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-medium"
          style={{
            color: up ? t.accent : "var(--color-hot)",
            background: up ? "var(--color-accent-soft)" : "rgba(220,38,38,0.1)",
          }}
        >
          {up ? "▲" : "▼"} {Math.abs(upside).toFixed(0)}% vs ~{PS(todayPrice)} today
        </div>

        <div className="mt-7 space-y-3">
          {[
            [`FY${latest.fy + HORIZON_YEARS} revenue`, B(out.fwdRevenue)],
            [`FY${latest.fy + HORIZON_YEARS} EBITDA`, B(out.fwdEbitda)],
            ["Enterprise value", B(out.enterpriseValue)],
            ["Equity value", B(out.equityValue)],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between border-b border-line pb-3"
            >
              <span className="text-[13.5px]" style={{ color: t.fgDim }}>
                {k}
              </span>
              <span
                className="font-mono text-[15px] font-semibold tabular-nums"
                style={{ color: t.ink }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed" style={{ color: t.fgMute }}>
          {priceIsLive ? (
            <>
              <span style={{ color: t.accent }}>● Live</span> BE quote
              ({PS(todayPrice)}). Implied value ÷ {(latest.dilutedShares / 1e6).toFixed(0)}M
              diluted shares.
            </>
          ) : (
            <>
              ~{PS(todayPrice)} reference = $
              {(market.capProvisional / 1e9).toFixed(0)}B cap ÷
              {" "}
              {(latest.dilutedShares / 1e6).toFixed(0)}M shares ({market.asOf},{" "}
              {market.source}). Provisional until the live quote loads.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function Financials() {
  return (
    <Section id="financials" tone="surface">
      <SectionHeader {...financials} />
      <div className="mt-12">
        <FactGrid facts={financials.facts} />
      </div>
      <div className="mt-6">
        <Reveal>
          <HistoryChart />
        </Reveal>
      </div>
      <div className="mt-6">
        <Reveal>
          <Model />
        </Reveal>
      </div>
    </Section>
  );
}
