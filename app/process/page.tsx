import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Process } from "@/components/Process";

export const metadata: Metadata = {
  title: "Our process: Bloom Energy (BE) equity research",
  description:
    "The audit trail: pinned dates, frozen sources, evidence tiers, the v5 model changelog, the decision log, and the falsifiers we named in advance.",
};

export default function ProcessPage() {
  return (
    <main className="relative">
      <Nav />
      <div className="pt-16">
        <Process />
      </div>
    </main>
  );
}
