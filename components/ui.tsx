"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, t } from "./tokens";
import type { Fact } from "@/data/content";

/** Scroll-reveal wrapper — fadeUp, fires once on enter. */
export function Reveal({
  i = 0,
  children,
  className,
}: {
  i?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  tone = "surface",
  children,
}: {
  id?: string;
  tone?: "surface" | "deep";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-line"
      style={{ background: tone === "deep" ? t.bgDeep : t.surface }}
    >
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  headline,
  dek,
}: {
  eyebrow: string;
  headline: string;
  dek?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal i={0}>
        <p
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: t.accent }}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal i={1}>
        <h2
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: t.ink }}
        >
          {headline}
        </h2>
      </Reveal>
      {dek && (
        <Reveal i={2}>
          <p
            className="mt-5 text-[17px] leading-relaxed"
            style={{ color: t.fgDim }}
          >
            {dek}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// Evidence tiers, per the research's frozen-source discipline.
const TIER_META: Record<"R" | "D" | "E", { label: string; color: string; bg: string }> = {
  R: { label: "R · reported primary (filing, call, datasheet)", color: "#166534", bg: "rgba(22,101,52,0.10)" },
  D: { label: "D · derived from primary figures by us", color: "#92400e", bg: "rgba(146,64,14,0.10)" },
  E: { label: "E · estimate / third party", color: "#6b21a8", bg: "rgba(107,33,168,0.09)" },
};

export function TierBadge({ tier }: { tier: "R" | "D" | "E" }) {
  const m = TIER_META[tier];
  return (
    <span
      title={m.label}
      className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-[4px] font-mono text-[9px] font-bold"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.color}33` }}
    >
      {tier}
    </span>
  );
}

/** Legend for the tier badges — render once, near the sources. */
export function TierLegend() {
  return (
    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: t.fgMute }}>
      Every figure carries its evidence tier — <TierBadge tier="R" /> reported
      primary · <TierBadge tier="D" /> derived by us · <TierBadge tier="E" />{" "}
      estimate / third party — and its chip opens the vault note behind it.
    </p>
  );
}

export function SourceChip({
  children,
  tier,
  note,
}: {
  children: ReactNode;
  tier?: "R" | "D" | "E";
  note?: string;
}) {
  const inner = (
    <>
      {tier && <TierBadge tier={tier} />}
      <span>{children}</span>
    </>
  );
  if (note) {
    return (
      <a
        href={`/vault#note=${encodeURIComponent(note)}`}
        title="Open the vault note behind this figure"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] underline decoration-dotted underline-offset-[3px] transition-opacity hover:opacity-70"
        style={{ color: t.fgMute }}
      >
        {inner}
      </a>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]"
      style={{ color: t.fgMute }}
    >
      {inner}
    </span>
  );
}

/** Bordered fact grid — divide lines, not boxes (anti-card). */
export function FactGrid({ facts }: { facts: Fact[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-line">
      <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <Reveal key={f.label} i={i}>
            <div
              className="h-full px-6 py-7"
              style={{ background: t.surface }}
            >
              <div
                className="text-2xl font-semibold tabular-nums tracking-tight sm:text-[28px]"
                style={{ color: t.ink }}
              >
                {f.value}
              </div>
              <div
                className="mt-2 text-[13.5px] leading-snug"
                style={{ color: t.fgDim }}
              >
                {f.label}
              </div>
              <div className="mt-3">
                <SourceChip tier={f.tier} note={f.note}>{f.source}</SourceChip>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
