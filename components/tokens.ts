import type { Variants } from "framer-motion";

/** Design tokens (ported from the LC Automate site, + Bloom green accent). */
export const t = {
  bgDeep: "var(--color-bg-deep)",
  bg: "var(--color-bg)",
  sunken: "var(--color-sunken)",
  surface: "var(--color-surface)",

  ink: "var(--color-ink)",
  ink2: "var(--color-ink-2)",
  fgDim: "var(--color-fg-dim)",
  fgMute: "var(--color-fg-mute)",

  line: "var(--color-line)",
  lineMuted: "var(--color-line-muted)",
  lineStrong: "var(--color-line-strong)",

  accent: "var(--color-accent)",
  accentBright: "var(--color-accent-bright)",

  inkGrad: "linear-gradient(135deg, #0a0a0a 0%, #000 100%)",
  accentGrad: "linear-gradient(135deg, #16a85e 0%, #0c7a43 100%)",
} as const;

export const sectionEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: sectionEase },
  }),
};
