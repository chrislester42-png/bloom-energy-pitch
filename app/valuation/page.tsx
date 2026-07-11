import type { Metadata } from "next";
import Link from "next/link";
import { ValuationLab } from "@/components/Valuation";
import { LivePriceProvider } from "@/components/LivePrice";

export const metadata: Metadata = {
  title: "Valuation Lab — Bloom Energy (NYSE: BE)",
  description:
    "The full interactive valuation lab behind the Bloom Energy pitch — reverse DCF, hurdle-rate entry price, scenario weighting, and the group DCF, with every assumption editable.",
};

export default function ValuationPage() {
  return (
    <LivePriceProvider>
      <main className="relative min-h-dvh">
        <header className="border-b border-line">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/#valuation"
              className="text-[14px] font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--color-fg-dim)" }}
            >
              ← Back to the report
            </Link>
            <span
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-fg-mute)" }}
            >
              Bloom Energy · NYSE: BE
            </span>
          </div>
        </header>
        <ValuationLab />
      </main>
    </LivePriceProvider>
  );
}
