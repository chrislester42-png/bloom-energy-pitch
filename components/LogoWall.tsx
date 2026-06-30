"use client";

import { Reveal } from "./ui";
import { t } from "./tokens";

// Per-logo display height (px) tuned so they read at a similar optical weight.
const partners = [
  { src: "/logos/oracle.png", alt: "Oracle", h: 22 },
  { src: "/logos/aep.png", alt: "American Electric Power", h: 38 },
  { src: "/logos/brookfield.png", alt: "Brookfield", h: 22 },
  { src: "/logos/sk-ecoplant.png", alt: "SK ecoplant", h: 30 },
  { src: "/logos/equinix.png", alt: "Equinix", h: 22 },
];

export function LogoWall() {
  return (
    <div className="mt-10">
      <p
        className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em]"
        style={{ color: t.fgMute }}
      >
        The customers behind the backlog
      </p>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {partners.map((p, i) => (
          <Reveal key={p.alt} i={i}>
            <div
              className="flex h-24 items-center justify-center px-5"
              style={{ background: t.surface }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                style={{ height: p.h, maxWidth: "100%", width: "auto" }}
                className="object-contain"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
