import type { Metadata } from "next";
import VaultExplorer from "@/components/VaultExplorer";

export const metadata: Metadata = {
  title: "Knowledge Bank — Bloom Energy research vault",
  description:
    "The full research vault behind the Bloom Energy pitch — an interactive, Obsidian-style graph of every source, atomic note, draft, and open question, with the notes readable in full.",
};

export default function VaultPage() {
  return <VaultExplorer />;
}
