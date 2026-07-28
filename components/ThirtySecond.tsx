"use client";

import { useMemo } from "react";
import { Reveal } from "./ui";
import { t } from "./tokens";
import { Term } from "./Term";
import { useLivePrice } from "./LivePrice";
import { triggerPrice } from "./BuyTrigger";

/**
 * ThirtySecond, the whole report in 30 seconds, above the fold.
 *
 * Five sentences, zero prerequisites: what Bloom does, why it's hot,
 * what we'd pay, what we'd do today, and what would change our mind.
 * If a reader stops here, they have the entire call.
 */
export function ThirtySecond() {
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 165;
  const trig = useMemo(() => triggerPrice(), []);

  return (
    <section className="border-t border-line" style={{ background: t.bgDeep }}>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <Reveal>
          <div
            className="rounded-2xl border-l-[3px] p-6 sm:p-8"
            style={{ borderColor: t.accent, background: t.surface }}
          >
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: t.accent }}>
              The whole report in 30 seconds
            </div>
            <p className="max-w-4xl text-[16.5px] leading-relaxed" style={{ color: t.ink2 }}>
              Bloom builds refrigerator-sized power plants that turn natural gas
              into electricity <Term k="sofc">without burning it</Term>, and can
              have them running next to an AI data center in <b>months</b>, when
              a normal grid hookup takes <b>years</b>. AI companies are desperate
              for power, so Bloom&apos;s sales are exploding: it just posted its
              first billion-dollar quarter and expects revenue to roughly double
              this year. Our problem was never the company, it&apos;s the price.
              By our math, even if everything goes right, someone buying today
              earns a poor return.{" "}
              <b style={{ color: "var(--color-hot, #dc2626)" }}>
                We&apos;d sell or avoid at today&apos;s ${p.toFixed(0)}
              </b>{" "}
              and{" "}
              <b style={{ color: t.accent }}>
                become eager buyers below ${trig.toFixed(0)}
              </b>
              . And because last week&apos;s blowout earnings tripped alarms we
              set for ourselves <i>in advance</i>, that call is now under formal
              review, graded in public on our{" "}
              <a href="/scorecard" className="underline underline-offset-2" style={{ color: t.accent }}>
                Scorecard
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
