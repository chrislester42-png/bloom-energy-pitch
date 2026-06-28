"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { t, sectionEase } from "./tokens";

const links = [
  ["Why now", "#deck"],
  ["Financials", "#deck"],
  ["Catalysts", "#deck"],
  ["The call", "#deck"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: sectionEase }}
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: scrolled ? "rgba(244,244,244,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? `1px solid ${t.lineMuted}`
          : "1px solid transparent",
        transition:
          "background 200ms ease, backdrop-filter 200ms ease, border-color 200ms ease",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
          style={{ color: t.ink }}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-[3px]"
            style={{ background: t.accentGrad }}
          />
          Bloom Energy · BE
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[14px] transition-opacity hover:opacity-70"
              style={{ color: t.fgDim }}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#deck"
          className="inline-flex h-10 items-center justify-center rounded-full px-5 text-[13.5px] font-medium text-white transition-transform hover:-translate-y-[1px] active:translate-y-[1px]"
          style={{ background: t.inkGrad }}
        >
          The pitch
        </a>
      </nav>
    </motion.header>
  );
}
