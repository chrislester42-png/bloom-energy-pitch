"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { Section, SectionHeader, FactGrid, Reveal, SourceChip } from "./ui";
import { LogoWall } from "./LogoWall";
import { t } from "./tokens";
import {
  whyNow,
  whatBloomIs,
  moat,
  catalysts,
  risks,
  sources,
} from "@/data/content";

export function WhyNow() {
  return (
    <Section id="why-now" tone="surface">
      <SectionHeader {...whyNow} />
      <div className="mt-12">
        <FactGrid facts={whyNow.facts} />
      </div>
    </Section>
  );
}

export function WhatBloomIs() {
  return (
    <Section id="what" tone="deep">
      <SectionHeader {...whatBloomIs} />
      <div className="mt-12">
        <FactGrid facts={whatBloomIs.facts} />
      </div>
    </Section>
  );
}

export function Moat() {
  return (
    <Section id="moat" tone="surface">
      <SectionHeader {...moat} />
      <div className="mt-12">
        <FactGrid facts={moat.facts} />
      </div>
    </Section>
  );
}

export function Catalysts() {
  return (
    <Section id="catalysts" tone="deep">
      <SectionHeader {...catalysts} />

      {/* Deal anchors */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-line">
        {catalysts.deals.map((d, i) => (
          <Reveal key={d.partner} i={i}>
            <div
              className="flex flex-col gap-2 border-b border-line px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: t.surface }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="w-28 shrink-0 text-[17px] font-semibold tracking-tight"
                  style={{ color: t.accent }}
                >
                  {d.partner}
                </span>
                <span
                  className="text-[15px] font-medium tabular-nums"
                  style={{ color: t.ink }}
                >
                  {d.terms}
                </span>
              </div>
              <div className="flex items-center gap-3 pl-32 sm:pl-0">
                <span className="text-[13.5px]" style={{ color: t.fgDim }}>
                  {d.note}
                </span>
                <SourceChip>{d.source}</SourceChip>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6">
        <FactGrid facts={catalysts.facts} />
      </div>

      <LogoWall />
    </Section>
  );
}

export function Risks() {
  return (
    <Section id="risks" tone="surface">
      <SectionHeader {...risks} />
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {risks.items.map((r, i) => (
          <Reveal key={r.claim} i={i % 2}>
            <div
              className="flex h-full flex-col rounded-2xl border border-line p-6"
              style={{ background: t.surface }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-hot)" }}
                />
                <h3
                  className="text-[18px] font-semibold tracking-tight"
                  style={{ color: t.ink }}
                >
                  {r.claim}
                </h3>
              </div>
              <p
                className="mt-3 text-[14.5px] leading-relaxed"
                style={{ color: t.fgDim }}
              >
                {r.detail}
              </p>
              <div
                className="mt-4 rounded-xl border-l-2 px-4 py-3"
                style={{
                  borderColor: t.accent,
                  background: "var(--color-accent-soft)",
                }}
              >
                <p className="text-[13.5px] leading-relaxed" style={{ color: t.ink2 }}>
                  <span style={{ color: t.accent, fontWeight: 600 }}>
                    Our take ·{" "}
                  </span>
                  {r.rebuttal}
                </p>
              </div>
              <div className="mt-3">
                <SourceChip>{r.source}</SourceChip>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Sources() {
  return (
    <Section id="sources" tone="deep">
      <SectionHeader
        eyebrow="08 · Sources"
        headline="Every number traces to a primary filing."
        dek="Built on a sourced research vault — filings, transcripts, and deal releases. The audit trail is the point."
      />
      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {sources.map((s) => (
          <a
            key={s.title}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-sunken"
            style={{ background: t.surface }}
          >
            <div>
              <div className="text-[14.5px] font-medium" style={{ color: t.ink }}>
                {s.title}
              </div>
              <div className="mt-0.5">
                <SourceChip>{s.publisher}</SourceChip>
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 opacity-40 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5"
              style={{ color: t.accent }}
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
