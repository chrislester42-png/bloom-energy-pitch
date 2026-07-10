"use client";

import { useMemo } from "react";
import { Reveal } from "./ui";
import { t } from "./tokens";
import { useLivePrice } from "./LivePrice";
import { triggerPrice, TRIGGER } from "./BuyTrigger";
import { market } from "@/data/content";
import { latest } from "@/data/financials";

/**
 * ReportHeader — the "page one" of a classic equity research report:
 * rating, price target(s), and the stock-data block, rendered live.
 *
 * Our call is two-sided (per the team's pitch):
 *   SELL / AVOID at market (short term) — the price prepays for the bull case.
 *   BUY below the trigger — the entry at which even the super-bull FY2030
 *   case clears the hurdle IRR (a long-term position in a company we like).
 */

const PS = (n: number) => `$${n.toFixed(2)}`;

function Datum({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="px-5 py-4 sm:px-6" style={{ background: t.surface }}>
      <div
        className="font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: t.fgMute }}
      >
        {k}
      </div>
      <div
        className="mt-1 text-[19px] font-semibold tabular-nums tracking-tight sm:text-[21px]"
        style={{ color: t.ink }}
      >
        {v}
      </div>
      {sub && (
        <div className="mt-0.5 text-[11px] leading-snug" style={{ color: t.fgMute }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function ReportHeader() {
  const { ok, price } = useLivePrice();
  const live = ok && price != null;
  const p = live ? (price as number) : 300; // reference fallback
  const trig = useMemo(() => triggerPrice(), []);
  const inBuyZone = p <= trig;

  const mktCap = (p * latest.dilutedShares) / 1e9;
  const downToTrigger = Math.max(0, (1 - trig / p) * 100);

  return (
    <section
      id="report-header"
      className="border-t border-line"
      style={{ background: t.surface }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {/* masthead row */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: t.accent }}
              >
                Equity research · initiation of coverage
              </p>
              <h2
                className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: t.ink }}
              >
                Bloom Energy Corporation
              </h2>
              <p className="mt-1 text-[14px]" style={{ color: t.fgDim }}>
                NYSE: BE · Electrical equipment — solid-oxide fuel cells · On-site
                power for AI data centers
              </p>
            </div>

            {/* the rating block */}
            <div className="flex flex-wrap items-stretch gap-3">
              <div
                className="rounded-2xl border px-5 py-3.5"
                style={{
                  borderColor: inBuyZone ? t.accent : "var(--color-hot, #dc2626)",
                  background: inBuyZone
                    ? "var(--color-accent-soft)"
                    : "rgba(220,38,38,0.06)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: t.fgMute }}
                >
                  Rating · short term
                </div>
                <div
                  className="mt-0.5 text-[22px] font-semibold tracking-tight"
                  style={{
                    color: inBuyZone ? t.accent : "var(--color-hot, #dc2626)",
                  }}
                >
                  {inBuyZone ? "Buy" : "Sell / Avoid"}
                </div>
                <div className="text-[11px]" style={{ color: t.fgMute }}>
                  {inBuyZone
                    ? "price is inside our buy zone"
                    : "the price prepays for the bull case"}
                </div>
              </div>
              <div
                className="rounded-2xl border px-5 py-3.5"
                style={{
                  borderColor: t.accent,
                  background: "var(--color-accent-soft)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: t.fgMute }}
                >
                  Long term · buy below
                </div>
                <div
                  className="mt-0.5 text-[22px] font-semibold tabular-nums tracking-tight"
                  style={{ color: t.accent }}
                >
                  {PS(trig)}
                </div>
                <div className="text-[11px]" style={{ color: t.fgMute }}>
                  our entry trigger — {downToTrigger.toFixed(0)}% below market
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* stock data strip */}
        <Reveal i={1}>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            <Datum
              k={live ? "Last price" : "Reference price"}
              v={PS(p)}
              sub={live ? "live quote" : "live quote offline"}
            />
            <Datum
              k="Market cap"
              v={`$${mktCap.toFixed(1)}B`}
              sub={`${(latest.dilutedShares / 1e6).toFixed(1)}M diluted shares`}
            />
            <Datum
              k="Our buy trigger"
              v={PS(trig)}
              sub={`super-bull FY30 at a ${(TRIGGER.hurdle * 100).toFixed(0)}% IRR`}
            />
            <Datum
              k="Street consensus PT"
              v={PS(market.consensusPT)}
              sub={`mean target (${market.source})`}
            />
            <Datum
              k="Published bear PT"
              v={PS(market.bearPT)}
              sub="24/7 Wall St"
            />
            <Datum
              k="Net debt"
              v={`$${(latest.netDebt / 1e6).toFixed(0)}M`}
              sub={`FactSet, ${market.asOf}`}
            />
          </div>
        </Reveal>

        <Reveal i={2}>
          <p className="mt-4 text-[12.5px] leading-relaxed" style={{ color: t.fgMute }}>
            The two-sided call: a great company priced past its bull case. We would
            sell or avoid at today&apos;s price — and become aggressive long-term
            buyers below the trigger, where even our most optimistic FY2030 case
            still pays a {(TRIGGER.hurdle * 100).toFixed(0)}% annual return. Full
            reasoning in{" "}
            <a href="#valuation" className="underline underline-offset-2" style={{ color: t.accent }}>
              Valuation
            </a>{" "}
            and{" "}
            <a href="#the-call" className="underline underline-offset-2" style={{ color: t.accent }}>
              The call
            </a>
            . Educational research, not investment advice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
