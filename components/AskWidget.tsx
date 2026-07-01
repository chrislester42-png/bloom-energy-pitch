"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatCircleDots, X } from "@phosphor-icons/react";
import AskChat from "./AskChat";
import { t } from "./tokens";

/** Floating site-wide "Ask the research" assistant.
 *  Hidden on /vault, which has its own embedded panel + graph highlighting. */
export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close on route change; never show on the Knowledge Bank page
  useEffect(() => { setOpen(false); }, [pathname]);
  if (pathname && pathname.startsWith("/vault")) return null;

  return (
    <>
      {/* launcher */}
      <button
        aria-label="Ask the research"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2.5 rounded-full pl-4 pr-5 text-white shadow-[0_12px_30px_-8px_rgba(10,10,10,0.5)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: t.inkGrad }}
      >
        {open ? <X size={20} weight="bold" /> : <ChatCircleDots size={22} weight="fill" />}
        <span className="text-[14px] font-medium">{open ? "Close" : "Ask the research"}</span>
      </button>

      {/* panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[640px] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border"
          style={{ borderColor: t.line, background: t.bg, boxShadow: "var(--shadow-card-hover)" }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: t.line, background: "rgba(255,255,255,0.7)" }}>
            <div>
              <div className="text-[14px] font-semibold tracking-tight" style={{ color: t.ink }}>Ask the research</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>grounded in the vault</div>
            </div>
            <a href="/vault" className="font-mono text-[10px] uppercase tracking-[0.12em] hover:opacity-70" style={{ color: t.accent }}>
              open graph →
            </a>
          </div>
          <div className="min-h-0 flex-1">
            <AskChat compact />
          </div>
        </div>
      )}
    </>
  );
}
