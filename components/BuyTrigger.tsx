"use client";

import { useMemo } from "react";
import { Reveal } from "./ui";
import { t } from "./tokens";
import { useLivePrice } from "./LivePrice";
import { latest } from "@/data/financials";

/**
 * Live Buy Trigger — the thesis as a standing, self-updating recommendation.
 *
 * Two live numbers, recomputed from the real-time quote:
 *  1) The implied 5-yr revenue growth the market is paying for RIGHT NOW
 *     (reverse DCF: bisect constant growth until the group model's blended
 *     value equals the live price at a market-level discount rate).
 *  2) Distance to our buy trigger — the price at which even our super-bull
 *     FY2030 case (rev × margin × multiple) clears the hurdle IRR.
 */

// ---- group DCF engine constants (mirror of reverse-dcf-lab.html) ----------
const BASE_REV = 2023994000;                  // FY2025 revenue
const FCFM = [-1.31, 1.98, 4.75, 6.70, 8.01]; // workbook UFCF margin ramp, %
const G_TERM = 0.035;                         // Gordon terminal growth
const EX_MULT = 13.5;                         // workbook exit multiple
const EB_M = 0.1582;                          // workbook FY30 EBITDA margin
const YRS = 4.5;                              // mid-2026 → FY2030
const DISC = 0.105;                           // market-level discount rate

// ---- our trigger: concede the super-bull case, demand the hurdle ----------
export const TRIGGER = {
  rev2030: 15e9,   // super-bull FY2030 revenue
  margin: 0.22,    // mature EBITDA margin
  multiple: 16,    // mature EV/EBITDA
  hurdle: 0.12,    // required IRR
};

const ND = latest.netDebt;
const SH = latest.dilutedShares;

// blended (Gordon + exit) value/share for a constant growth rate
function blendPs(g5: number): number {
  let rev = BASE_REV, pv1 = 0, u = 0;
  for (let i = 0; i < 5; i++) {
    rev *= 1 + g5;
    u = rev * (FCFM[i] / 100);
    const cf = i === 0 ? u * 0.5 : u; // FY26 stub
    pv1 += cf / Math.pow(1 + DISC, i + 0.5); // mid-year convention
  }
  const perp = (pv1 + (u * (1 + G_TERM)) / (DISC - G_TERM) / Math.pow(1 + DISC, YRS) - ND) / SH;
  const eb = (pv1 + rev * EB_M * EX_MULT / Math.pow(1 + DISC, YRS) - ND) / SH;
  return (perp + eb) / 2;
}

// bisect the constant growth rate the market price implies
function impliedGrowth(price: number): number | null {
  let lo = 0, hi = 4; // 0%..400%/yr
  if (blendPs(hi) < price) return null;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (blendPs(m) < price) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}

export function triggerPrice(): number {
  const eq2030 = TRIGGER.rev2030 * TRIGGER.margin * TRIGGER.multiple - ND;
  return eq2030 / SH / Math.pow(1 + TRIGGER.hurdle, YRS);
}

const PS = (n: number) => `$${n.toFixed(2)}`;

function Cell({ k, v, sub, tone }: { k: string; v: string; sub?: string; tone?: "hot" | "accent" }) {
  return (
    <div className="px-5 py-5 sm:px-6" style={{ background: t.surface }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
        {k}
      </div>
      <div
        className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight sm:text-[26px]"
        style={{ color: tone === "hot" ? "var(--color-hot, #dc2626)" : tone === "accent" ? t.accent : t.ink }}
      >
        {v}
      </div>
      {sub && (
        <div className="mt-1 text-[11.5px] leading-snug" style={{ color: t.fgMute }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function BuyTrigger() {
  const { ok, price } = useLivePrice();
  const live = ok && price != null;
  const p = live ? (price as number) : 300; // reference fallback

  const trig = useMemo(() => triggerPrice(), []);
  const g = useMemo(() => impliedGrowth(p), [p]);
  const fallPct = Math.max(0, (1 - trig / p) * 100);
  const inBuyZone = p <= trig;
  const irrAtMkt =
    (Math.pow((TRIGGER.rev2030 * TRIGGER.margin * TRIGGER.multiple - ND) / SH / p, 1 / YRS) - 1) * 100;

  return (
    <section id="buy-trigger" className="border-t border-line" style={{ background: t.bgDeep }}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: inBuyZone ? "#0f8a4d" : "#dc2626" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: inBuyZone ? "#0f8a4d" : "#dc2626" }}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: t.accent }}>
              The call, live
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
              {live ? "· updates with the tape" : "· live quote offline — showing reference price"}
            </span>
          </div>
        </Reveal>

        <Reveal i={1}>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: t.ink }}>
            {inBuyZone ? (
              <>Below our trigger. This is the price we&apos;ve been waiting for.</>
            ) : (
              <>
                Right company. Wrong price — by{" "}
                <span style={{ color: "var(--color-hot, #dc2626)" }}>{fallPct.toFixed(0)}%</span>.
              </>
            )}
          </h2>
        </Reveal>

        <Reveal i={2}>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-5">
            <Cell k={live ? "BE last price" : "Reference price"} v={PS(p)} sub="what buyers pay today" tone="hot" />
            <Cell
              k="Market is pricing in"
              v={g != null ? `${(g * 100).toFixed(0)}%/yr` : ">400%/yr"}
              sub="implied revenue growth, 5 straight years (reverse DCF)"
            />
            <Cell
              k="Our buy trigger"
              v={PS(trig)}
              sub={`super-bull FY30 ($${(TRIGGER.rev2030 / 1e9).toFixed(0)}B rev, ${(TRIGGER.margin * 100).toFixed(0)}% mgn, ${TRIGGER.multiple}×) at a ${(TRIGGER.hurdle * 100).toFixed(0)}% IRR`}
              tone="accent"
            />
            <Cell
              k={inBuyZone ? "Margin below trigger" : "Fall needed to trigger"}
              v={`${fallPct.toFixed(0)}%`}
              sub={inBuyZone ? "price is inside our buy zone" : "we wait; we don't chase"}
            />
            <Cell
              k="IRR if bought today"
              v={`${irrAtMkt >= 0 ? "+" : ""}${irrAtMkt.toFixed(1)}%/yr`}
              sub="to FY2030, even granting the super-bull case"
              tone={irrAtMkt >= TRIGGER.hurdle * 100 ? "accent" : "hot"}
            />
          </div>
        </Reveal>

        <Reveal i={3}>
          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed" style={{ color: t.fgMute }}>
            How to read this: we invert our group DCF against the live quote — the growth number is what the
            current price already pays for, at a 10.5% discount rate. The trigger concedes our most optimistic
            FY2030 case and still demands a {(TRIGGER.hurdle * 100).toFixed(0)}% annual return. We&apos;d rather
            own it than admire it — at the right price. Educational research, not investment advice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
