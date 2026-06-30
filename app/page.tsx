import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import {
  Thesis,
  WhyNow,
  WhatBloomIs,
  Moat,
  Competition,
  Catalysts,
  Risks,
  Sources,
} from "@/components/Sections";
import { Financials } from "@/components/Financials";
import { TheCall } from "@/components/TheCall";
import { LivePriceProvider } from "@/components/LivePrice";
import { t } from "@/components/tokens";

export default function Home() {
  return (
    <LivePriceProvider>
    <main className="relative">
      <Nav />
      <Hero />
      <Thesis />
      <WhyNow />
      <WhatBloomIs />
      <Moat />
      <Competition />
      <Financials />
      <Catalysts />
      <Risks />
      <TheCall />
      <Sources />

      <footer
        className="border-t border-line"
        style={{ background: t.surface }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <span className="text-[13px]" style={{ color: t.fgMute }}>
            Bloom Energy (NYSE: BE) · independent equity research · educational use
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: t.fgMute }}>
            Built on a sourced research vault
          </span>
        </div>
      </footer>
    </main>
    </LivePriceProvider>
  );
}
