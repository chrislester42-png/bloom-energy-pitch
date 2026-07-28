"use client";

import type { ReactNode } from "react";
import { t } from "./tokens";

/**
 * Term — the plain-English glossary, inline.
 *
 * Wrap the first use of an unavoidable finance/energy term:
 *   <Term k="related-party">partners Bloom helped fund</Term>
 * Renders a dotted underline; hover (or tap/focus on touch) shows a
 * one-sentence definition. Rule: same fact, zero prerequisites, and an
 * expert reading the definition finds nothing false.
 *
 * <Glossary /> renders the full list — it lives next to Sources so every
 * term is discoverable even where prose couldn't host a tooltip.
 */

export const GLOSSARY: Record<string, { term: string; def: string }> = {
  "arms-length": { term: "arm's-length", def: "A sale to a truly independent customer — nobody on either side can rig the price." },
  "related-party": { term: "related party", def: "A customer the company part-owns or helped finance — like selling cars to a dealership you co-own. The sales are real, but the price and urgency deserve scrutiny." },
  backlog: { term: "backlog", def: "Future business customers have signaled — everything from firm signed orders to handshake frameworks." },
  rpo: { term: "firm orders (RPO)", def: "The legally committed slice of backlog — the only part auditors count. For Bloom: ~$0.5B of the ~$20B." },
  ebitda: { term: "EBITDA", def: "Profit before interest, taxes, and paper accounting charges — a rough “cash earnings” yardstick." },
  wacc: { term: "discount rate (WACC)", def: "The yearly return investors demand — the exchange rate between future money and today's money." },
  beta: { term: "beta", def: "How violently a stock swings versus the whole market. 1 = average; Bloom's is 2–4 depending on who you ask." },
  "reverse-dcf": { term: "reverse DCF", def: "Valuation math run backwards: what growth does today's price require? Then judge whether that growth is plausible." },
  hurdle: { term: "hurdle rate", def: "The minimum yearly return we insist on before risking money (ours: 12%)." },
  btm: { term: "behind-the-meter", def: "Power made on-site at the customer's building — skipping the public grid and its years-long connection line." },
  itc: { term: "ITC (tax credit)", def: "A federal tax credit that refunds ~30% of a fuel-cell system's cost." },
  feoc: { term: "FEOC rules", def: "Rules that cancel that tax credit if too many components trace back to China — a paperwork-and-supply-chain risk." },
  "gross-margin": { term: "gross margin", def: "What's left of each sales dollar after the direct cost of making the thing." },
  guidance: { term: "guidance", def: "Management's own public forecast — the yardstick Wall Street holds them to." },
  sofc: { term: "fuel cell (SOFC)", def: "A box that converts natural gas to electricity chemically — no combustion, no smokestack." },
};

export function Term({ k, children }: { k: keyof typeof GLOSSARY; children: ReactNode }) {
  const g = GLOSSARY[k];
  if (!g) return <>{children}</>;
  return (
    <span className="group relative inline" tabIndex={0}>
      <span
        className="cursor-help"
        style={{ borderBottom: `1.5px dotted ${t.accent}`, color: "inherit" }}
      >
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[135%] left-0 z-30 hidden w-[270px] rounded-lg px-3 py-2.5 text-[12px] font-normal normal-case leading-snug tracking-normal group-hover:block group-focus:block"
        style={{ background: "#0a0a0a", color: "#fff", fontFamily: "var(--font-sans, system-ui)" }}
      >
        <b>{g.term}</b> — {g.def}
      </span>
    </span>
  );
}

/** Full glossary grid — rendered beside Sources. */
export function Glossary() {
  return (
    <div className="mt-12">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: t.accent }}>
        The plain-English glossary
      </div>
      <p className="mb-4 text-[13px]" style={{ color: t.fgMute }}>
        Every dotted-underline word on this site is defined here. No finance
        degree required — that&apos;s the point.
      </p>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(GLOSSARY).map((g) => (
          <div key={g.term} className="px-5 py-3.5" style={{ background: t.surface }}>
            <div className="text-[13px] font-semibold" style={{ color: t.ink }}>{g.term}</div>
            <div className="mt-0.5 text-[12px] leading-snug" style={{ color: t.fgDim }}>{g.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
