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

export function SourceChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.12em]"
      style={{ color: t.fgMute }}
    >
      {children}
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
                <SourceChip>{f.source}</SourceChip>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
