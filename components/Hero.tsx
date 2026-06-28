"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react";
import { CellGrid } from "./CellGrid";
import { fadeUp, t } from "./tokens";
import { latest } from "@/data/financials";

const revB = (n: number) => `$${(n / 1e9).toFixed(2)}B`;

const stats = [
  [revB(latest.revenue), "FY25 revenue"],
  ["+37%", "rev growth"],
  ["$20B", "total backlog"],
] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const yBlobA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const yBlobB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.25]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${t.bg} 0%, ${t.surface} 100%)`,
      }}
    >
      {/* ── Layered depth: masked dot grid + parallax blobs + grain ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(10,10,10,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(900px 600px at 50% 20%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(900px 600px at 50% 20%, black 0%, transparent 75%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full"
        style={{
          y: yBlobA,
          background:
            "radial-gradient(circle at 35% 35%, rgba(15,138,77,0.09) 0%, transparent 64%)",
          filter: "blur(8px)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-12%] h-[560px] w-[560px] rounded-full"
        style={{
          y: yBlobB,
          background:
            "radial-gradient(circle at 60% 40%, rgba(10,10,10,0.055) 0%, transparent 60%)",
          filter: "blur(10px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: "url(/images/landing/grain.svg)",
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-12 px-5 pt-28 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* LEFT — copy */}
        <motion.div className="relative z-10" style={{ y: yCopy, opacity: fade }}>
          <motion.p
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em]"
            style={{
              color: t.fgDim,
              border: `1px solid ${t.line}`,
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: t.accentBright }}
            />
            Equity Research · NYSE: BE
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-[46px] font-semibold leading-[1.0] tracking-[-0.03em] sm:text-[66px] lg:text-[82px]"
            style={{ color: t.ink }}
          >
            Welcome to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: t.accentGrad }}
            >
              Bloom.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-[46ch] text-[16px] leading-[1.6] sm:text-[17.5px]"
            style={{ color: t.fgDim }}
          >
            On-site power for the AI build-out — and a stock the market can&apos;t
            decide how to price. Here&apos;s the debate, and where we land.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#deck"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium text-white shadow-[0_12px_28px_-8px_rgba(10,10,10,0.4)] transition-all hover:-translate-y-[1px] hover:shadow-[0_16px_36px_-8px_rgba(10,10,10,0.5)] active:translate-y-[1px]"
              style={{ background: t.inkGrad }}
            >
              Explore the thesis
            </a>
            <a
              href="#deck"
              className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-[14.5px] font-medium transition-all hover:-translate-y-[1px]"
              style={{
                color: t.accent,
                border: `1px solid ${t.lineStrong}`,
                background: "rgba(255,255,255,0.7)",
              }}
            >
              Jump to the model
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {stats.map(([big, small]) => (
              <div key={small} className="flex items-baseline gap-2">
                <span
                  className="text-[19px] font-semibold tabular-nums tracking-tight"
                  style={{ color: t.ink }}
                >
                  {big}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: t.fgMute }}
                >
                  {small}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — signature cell-grid motif on a depth card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
          style={{ y: yCard }}
        >
          <div
            aria-hidden
            className="absolute inset-x-6 -bottom-4 top-8 -z-10 rounded-[26px]"
            style={{
              background: "rgba(10,10,10,0.05)",
              filter: "blur(2px)",
              transform: "rotate(-1.2deg)",
            }}
          />
          <div
            className="rounded-[22px] border bg-white/70 p-7 backdrop-blur-sm sm:p-9"
            style={{
              borderColor: t.line,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: t.fgMute }}
              >
                Solid-oxide stack
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: t.accent }}
              >
                Powering up
              </span>
            </div>
            <div className="mx-auto max-w-sm">
              <CellGrid />
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <div
          className="float-y flex flex-col items-center gap-1.5"
          style={{ color: t.fgMute }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            Scroll
          </span>
          <ArrowDown size={16} />
        </div>
      </motion.div>
    </section>
  );
}
