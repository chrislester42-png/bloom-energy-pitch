"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { t } from "./tokens";

export interface LiveQuote {
  ok: boolean;
  price: number | null;
  changePct: number | null;
  loading: boolean;
}

const Ctx = createContext<LiveQuote>({
  ok: false,
  price: null,
  changePct: null,
  loading: true,
});

export function useLivePrice() {
  return useContext(Ctx);
}

const ENDPOINT = "/.netlify/functions/quote";
const POLL_MS = 60_000;

export function LivePriceProvider({ children }: { children: ReactNode }) {
  const [q, setQ] = useState<LiveQuote>({
    ok: false,
    price: null,
    changePct: null,
    loading: true,
  });

  useEffect(() => {
    let alive = true;
    const pull = async () => {
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        const d = await r.json();
        if (!alive) return;
        if (d?.ok && typeof d.price === "number") {
          setQ({ ok: true, price: d.price, changePct: d.changePct, loading: false });
        } else {
          setQ((p) => ({ ...p, ok: false, loading: false }));
        }
      } catch {
        if (alive) setQ((p) => ({ ...p, ok: false, loading: false }));
      }
    };
    pull();
    const id = setInterval(pull, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return <Ctx.Provider value={q}>{children}</Ctx.Provider>;
}

/** Compact nav ticker. Renders nothing until a real quote arrives. */
export function PriceTicker() {
  const { ok, price, changePct } = useLivePrice();
  if (!ok || price == null) return null;
  const up = (changePct ?? 0) >= 0;
  return (
    <div className="flex items-center gap-2 font-mono text-[12px] tabular-nums">
      <span style={{ color: t.fgMute }}>BE</span>
      <span className="font-semibold" style={{ color: t.ink }}>
        ${price.toFixed(2)}
      </span>
      <span style={{ color: up ? t.accent : "var(--color-hot)" }}>
        {up ? "▲" : "▼"} {Math.abs(changePct ?? 0).toFixed(2)}%
      </span>
    </div>
  );
}
