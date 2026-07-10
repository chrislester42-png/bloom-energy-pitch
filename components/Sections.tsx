"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { Section, SectionHeader, FactGrid, Reveal, SourceChip } from "./ui";
import { LogoWall } from "./LogoWall";
import { t } from "./tokens";
import {
  thesis,
  whyNow,
  whatBloomIs,
  moat,
  competition,
  catalysts,
  risks,
  sources,
} from "@/data/content";

export function Thesis() {
  return (
    <Section id="thesis" tone="deep">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: the one-minute thesis */}
        <div className="lg:col-span-7">
          <Reveal i={0}>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: t.accent }}
            >
              {thesis.eyebrow}
            </p>
          </Reveal>
          <Reveal i={1}>
            <h2
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: t.ink }}
            >
              {thesis.headline}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 text-[18px] leading-relaxed" style={{ color: t.ink2 }}>
              {thesis.statement}
            </p>
          </Reveal>
          <Reveal i={3}>
            <div
              className="mt-7 rounded-xl border-l-2 px-5 py-4"
              style={{ borderColor: t.accent, background: "var(--color-accent-soft)" }}
            >
              <p className="text-[15px] leading-relaxed" style={{ color: t.ink2 }}>
                <span style={{ color: t.accent, fontWeight: 600 }}>The call · </span>
                {thesis.call}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right: bull / bear */}
        <div className="lg:col-span-5">
          <Reveal i={2}>
            <div className="grid grid-cols-1 gap-5">
              <ThesisColumn tone="bull" title="The bull case" items={thesis.bull} />
              <ThesisColumn tone="bear" title="The bear case" items={thesis.bear} />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Table of contents — jump into the argument */}
      <Reveal i={3}>
        <div className="mt-14">
          <div
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: t.fgMute }}
          >
            The report, in ten steps
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
            {thesis.toc.map((s) => (
              <a
                key={s.n}
                href={s.href}
                className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-sunken"
                style={{ background: t.surface }}
              >
                <span
                  className="font-mono text-[12px] tabular-nums"
                  style={{ color: t.accent }}
                >
                  {s.n}
                </span>
                <span
                  className="text-[14px] font-medium transition-opacity group-hover:opacity-70"
                  style={{ color: t.ink }}
                >
                  {s.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function ThesisColumn({
  tone,
  title,
  items,
}: {
  tone: "bull" | "bear";
  title: string;
  items: string[];
}) {
  const color = tone === "bull" ? t.accent : "var(--color-hot)";
  return (
    <div className="rounded-2xl border border-line p-6" style={{ background: t.surface }}>
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <h3
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: tone === "bull" ? t.accent : "var(--color-hot)" }}
        >
          {title}
        </h3>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[14px] leading-relaxed" style={{ color: t.fgDim }}>
            <span style={{ color }}>—</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhyNow() {
  return (
    <Section id="why-now" tone="surface">
      <SectionHeader {...whyNow} />

      {/* Plain-English key for the energy units used across the site */}
      <Reveal i={1}>
        <div
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl border px-5 py-3.5 text-[13px]"
          style={{ borderColor: t.line, background: t.surface, color: t.fgDim }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: t.accent }}>
            Reading the numbers
          </span>
          <span><b style={{ color: t.ink2 }}>MW</b> (megawatt) ≈ power for ~750 homes</span>
          <span><b style={{ color: t.ink2 }}>GW</b> (gigawatt) = 1,000 MW</span>
          <span><b style={{ color: t.ink2 }}>MWh</b> = one MW running for an hour — a unit of energy you can price</span>
        </div>
      </Reveal>

      <div className="mt-8">
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

export function Competition() {
  return (
    <Section id="competition" tone="deep">
      <SectionHeader
        eyebrow={competition.eyebrow}
        headline={competition.headline}
        dek={competition.dek}
      />

      <div className="mt-12 overflow-hidden rounded-2xl border border-line">
        {competition.rows.map((r, i) => (
          <Reveal key={r.name} i={i}>
            <div
              className="grid grid-cols-1 gap-3 border-b border-line px-6 py-5 last:border-b-0 lg:grid-cols-12 lg:items-start lg:gap-6"
              style={{ background: t.surface }}
            >
              <div className="lg:col-span-3">
                <div className="text-[16px] font-semibold tracking-tight" style={{ color: t.ink }}>
                  {r.name}
                </div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: t.accent }}>
                  {r.role}
                </div>
              </div>
              <div className="lg:col-span-6">
                <p className="text-[14.5px] leading-relaxed" style={{ color: t.ink2 }}>
                  {r.point}
                </p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-[13px] leading-relaxed" style={{ color: t.fgDim }}>
                  <span style={{ color: "var(--color-warm)", fontWeight: 600 }}>Watch · </span>
                  {r.caveat}
                </p>
                <div className="mt-2">
                  <SourceChip>{r.source}</SourceChip>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6">
        <FactGrid facts={competition.facts} />
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
        eyebrow="09 · Sources"
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
