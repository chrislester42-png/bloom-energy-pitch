"use client";

import { useState } from "react";
import { Section, SectionHeader, Reveal, SourceChip } from "./ui";
import { t } from "./tokens";
import { recentNews, type NewsItem } from "@/data/content";

/**
 * RecentNews — the report's "recent developments" section as an
 * interactive, filterable timeline (newest first).
 */

const TAGS = ["All", "Deal", "Earnings", "Analyst"] as const;
type Tag = (typeof TAGS)[number];

const TAG_COLOR: Record<NewsItem["tag"], string> = {
  Deal: "var(--color-accent)",
  Earnings: "#d97706",
  Analyst: "#2563eb",
  Product: "var(--color-fg-dim)",
};

export function RecentNews() {
  const [tag, setTag] = useState<Tag>("All");
  const items = recentNews.items.filter((n) => tag === "All" || n.tag === tag);

  return (
    <Section id="news" tone="deep">
      <SectionHeader {...recentNews} />

      {/* filter chips */}
      <Reveal i={2}>
        <div className="mt-10 flex flex-wrap gap-2">
          {TAGS.map((x) => {
            const on = x === tag;
            return (
              <button
                key={x}
                onClick={() => setTag(x)}
                className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all"
                style={{
                  borderColor: on ? t.accent : t.line,
                  background: on ? "var(--color-accent-soft)" : t.surface,
                  color: on ? t.accent : t.fgDim,
                }}
              >
                {x}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* timeline */}
      <div className="relative mt-10">
        <div
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px sm:left-[147px]"
          style={{ background: t.line }}
        />
        <div className="flex flex-col gap-7">
          {items.map((n, i) => (
            <Reveal key={n.title} i={Math.min(i, 4)}>
              <div className="grid grid-cols-[16px_1fr] gap-x-4 sm:grid-cols-[120px_16px_1fr] sm:gap-x-5">
                {/* date (desktop, left of the line) */}
                <div
                  className="hidden pt-4 text-right font-mono text-[11px] uppercase tracking-[0.1em] sm:block"
                  style={{ color: t.fgMute }}
                >
                  {n.date}
                </div>
                {/* dot */}
                <div className="relative pt-5">
                  <span
                    className="absolute left-1/2 block h-[9px] w-[9px] -translate-x-1/2 rounded-full border-2"
                    style={{
                      borderColor: TAG_COLOR[n.tag],
                      background: t.surface,
                    }}
                  />
                </div>
                {/* card */}
                <div
                  className="rounded-2xl border border-line p-5 sm:p-6"
                  style={{ background: t.surface }}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        color: TAG_COLOR[n.tag],
                        background: "var(--color-sunken)",
                      }}
                    >
                      {n.tag}
                    </span>
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.1em] sm:hidden"
                      style={{ color: t.fgMute }}
                    >
                      {n.date}
                    </span>
                  </div>
                  <h3
                    className="mt-2 text-[17px] font-semibold tracking-tight"
                    style={{ color: t.ink }}
                  >
                    {n.title}
                  </h3>
                  <p
                    className="mt-1.5 text-[14px] leading-relaxed"
                    style={{ color: t.fgDim }}
                  >
                    {n.blurb}
                  </p>
                  <div className="mt-3">
                    <SourceChip>{n.source}</SourceChip>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
