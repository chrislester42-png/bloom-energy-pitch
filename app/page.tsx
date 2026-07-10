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
import { ReportHeader } from "@/components/ReportHeader";
import { RecentNews } from "@/components/RecentNews";
import { Financials } from "@/components/Financials";
import { Valuation } from "@/components/Valuation";
import { TheCall } from "@/components/TheCall";
import { MonteCarlo } from "@/components/MonteCarlo";
import { BuyTrigger } from "@/components/BuyTrigger";
import { LivePriceProvider } from "@/components/LivePrice";
import { t } from "@/components/tokens";

// Section order mirrors a standard equity research report:
// cover → rating/stock data → thesis → company overview → recent news →
// industry → competition → moat → financial performance → catalysts →
// valuation → risks → recommendation → sources.
export default function Home() {
  return (
    <LivePriceProvider>
    <main className="relative">
      <Nav />
      <Hero />
      <ReportHeader />
      <Thesis />
      <WhatBloomIs />
      <RecentNews />
      <WhyNow />
      <Competition />
      <Moat />
      <Financials />
      <Catalysts />
      <Valuation />
      <MonteCarlo />
      <Risks />
      <BuyTrigger />
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
