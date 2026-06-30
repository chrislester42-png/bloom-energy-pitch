"use client";

import { Reveal } from "./ui";
import { t } from "./tokens";
import { peers, peerMedian, peersAsOf } from "@/data/peers";

const x = (v: number | null) => (v == null ? "nm" : `${v.toFixed(1)}×`);
const pct = (v: number) => `${v.toFixed(1)}%`;

const COLS = [
  "Price",
  "EV/Sales",
  "EV/EBITDA",
  "P/E '26E",
  "EBITDA mgn",
  "Cons. target",
] as const;

export function PeerComps() {
  return (
    <Reveal>
      <div className="mt-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[16px] font-semibold tracking-tight" style={{ color: t.ink }}>
            How the market prices BE vs. its peers
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: t.fgMute }}>
            {peersAsOf}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line" style={{ background: t.surface }}>
          <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
            <thead>
              <tr style={{ background: t.bgDeep }}>
                <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: t.fgMute }}>
                  Company
                </th>
                {COLS.map((c) => (
                  <th key={c} className="px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: t.fgMute }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peers.map((p) => {
                const isBE = p.ticker === "BE";
                const upside = (p.priceTarget / p.price - 1) * 100;
                const up = upside >= 0;
                return (
                  <tr
                    key={p.ticker}
                    className="border-t border-line"
                    style={{
                      background: isBE ? "var(--color-accent-soft)" : "transparent",
                      boxShadow: isBE ? `inset 3px 0 0 ${t.accent}` : undefined,
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: t.ink }}>
                        {p.name}
                      </span>
                      <span className="ml-2 font-mono text-[11px]" style={{ color: t.fgMute }}>
                        {p.ticker}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.ink }}>
                      ${p.price < 10 ? p.price.toFixed(2) : p.price.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.ink2 }}>
                      {x(p.evSales)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.ink2 }}>
                      {x(p.evEbitda)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.ink2 }}>
                      {x(p.peFy1)}
                    </td>
                    <td
                      className="px-4 py-3 text-right tabular-nums"
                      style={{ color: p.ebitdaMargin < 0 ? "var(--color-hot)" : t.ink2 }}
                    >
                      {pct(p.ebitdaMargin)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span style={{ color: t.ink }}>
                        ${p.priceTarget < 10 ? p.priceTarget.toFixed(2) : p.priceTarget.toFixed(0)}
                      </span>
                      <span className="ml-1.5 text-[12px]" style={{ color: up ? t.accent : "var(--color-hot)" }}>
                        {up ? "+" : ""}
                        {upside.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* peer median */}
              <tr className="border-t-2" style={{ borderColor: t.lineStrong, background: t.sunken }}>
                <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: t.fgMute }}>
                  Peer median
                </td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.fgDim }}>{x(peerMedian.evSales)}</td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.fgDim }}>{x(peerMedian.evEbitda)}</td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.fgDim }}>{x(peerMedian.peFy1)}</td>
                <td className="px-4 py-3 text-right tabular-nums" style={{ color: t.fgDim }}>{pct(peerMedian.ebitdaMargin)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-[13.5px] leading-relaxed" style={{ color: t.fgDim }}>
          BE trades at a steep premium to every peer on every multiple — ~339× EV/EBITDA
          and 128× forward earnings vs. a peer median near 38×. The market is paying
          up for the growth and the moat; the Street&apos;s consensus target (+
          {(((peers[0].priceTarget / peers[0].price) - 1) * 100).toFixed(0)}%) implies
          it&apos;s close to fully valued. <span style={{ color: t.fgMute }}>nm = negative EBITDA/earnings.</span>
        </p>
      </div>
    </Reveal>
  );
}
