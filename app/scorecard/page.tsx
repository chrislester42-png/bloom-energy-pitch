import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Scorecard } from "@/components/Scorecard";

export const metadata: Metadata = {
  title: "Pre-registered earnings scorecard: Bloom Energy (BE)",
  description:
    "Q2 2026 predictions committed to public git history before the print, graded hit/miss after, no edits, no hindsight.",
};

export default function ScorecardPage() {
  return (
    <main className="relative">
      <Nav />
      <div className="pt-16">
        <Scorecard />
      </div>
    </main>
  );
}
