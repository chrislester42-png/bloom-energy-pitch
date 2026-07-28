import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { TearSheet } from "@/components/TearSheet";

export const metadata: Metadata = {
  title: "One-page tear sheet: Bloom Energy (BE)",
  description:
    "The classic equity-research front page, generated from the live model, print or save as PDF.",
};

export default function TearSheetPage() {
  return (
    <main className="relative">
      <Nav />
      <div className="pt-16">
        <TearSheet />
      </div>
    </main>
  );
}
