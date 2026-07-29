"use client";

import { useEffect, useMemo, useState } from "react";
import { useLivePrice } from "./LivePrice";
import { triggerPrice, TRIGGER } from "./BuyTrigger";
import { latest } from "@/data/financials";
import { market } from "@/data/content";

/**
 * TearSheet, the classic one-page equity-research front page, generated
 * from the live model. Print it (or Save as PDF) the morning you present:
 * the price, cap, and distance-to-trigger refresh from the live quote.
 *
 * Deliberately self-styled (not Tailwind-token-dependent) so the print
 * output is identical to the screen.
 */

const S = {
  ink: "#0a0a0a", ink2: "#404040", dim: "rgba(10,10,10,.62)", mute: "rgba(10,10,10,.45)",
  line: "rgba(10,10,10,.1)", strong: "rgba(10,10,10,.2)",
  accent: "#0f8a4d", soft: "rgba(15,138,77,.1)", hot: "#dc2626", hotsoft: "rgba(220,38,38,.07)",
  mono: "var(--font-mono, ui-monospace, monospace)",
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ font: `650 9.5px ${S.mono}`, letterSpacing: ".16em", textTransform: "uppercase", color: S.accent, margin: "14px 0 6px", borderBottom: `1px solid ${S.line}`, paddingBottom: 4 }}>
      {children}
    </h2>
  );
}

export function TearSheet() {
  const { ok, price } = useLivePrice();
  const p = ok && price != null ? price : 300;
  const trig = useMemo(() => triggerPrice(), []);
  const cap = (p * latest.dilutedShares) / 1e9;
  const toTrig = ((trig / p - 1) * 100).toFixed(0);
  // Client-only date to avoid a build-time/hydration mismatch on static export.
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  }, []);

  const strip: [string, string][] = [
    [ok ? "Last price (live)" : "Reference price", `$${p.toFixed(2)}`],
    ["Market cap", `$${cap.toFixed(1)}B`],
    ["FY25 revenue", "$2.02B"],
    ["FY26 guide", "$3.4–3.8B"],
    ["Backlog", "~$20B"],
    ["Consensus PT", `$${market.consensusPT.toFixed(0)}`],
  ];

  return (
    <div style={{ background: "#e8e8e8", padding: "34px 12px 60px" }} className="ts-outer">
      <style>{`
        @media print {
          nav, header, .ts-noprint { display: none !important; }
          .ts-outer { background: #fff !important; padding: 0 !important; }
          .ts-page { box-shadow: none !important; margin: 0 !important; max-width: none !important; min-height: 0 !important; }
          @page { size: letter; margin: 10mm; }
        }
      `}</style>
      <div className="ts-noprint" style={{ maxWidth: 820, margin: "0 auto 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ font: `500 11px ${S.mono}`, letterSpacing: ".12em", textTransform: "uppercase", color: S.mute }}>
          One-page tear sheet · numbers refresh from the live quote
        </span>
        <button
          onClick={() => window.print()}
          style={{ border: `1px solid ${S.accent}`, background: S.soft, color: S.accent, borderRadius: 999, padding: "9px 18px", font: "600 13px system-ui", cursor: "pointer" }}
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="ts-page" style={{ maxWidth: 820, minHeight: 1040, margin: "0 auto", background: "#fff", boxShadow: "0 2px 24px rgba(10,10,10,.14)", padding: "36px 42px", position: "relative", color: S.ink, fontSize: 12.5, lineHeight: 1.45 }}>
        {/* masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `2.5px solid ${S.ink}`, paddingBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Diaz &amp; Lester <span style={{ color: S.accent }}>Equity Research</span></div>
          <div style={{ font: `600 9px ${S.mono}`, letterSpacing: ".16em", textTransform: "uppercase", color: S.mute }}>
            Initiation of coverage · {today} · Educational research, not investment advice
          </div>
        </div>

        {/* title + rating */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", marginTop: 14 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 650, letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>Bloom Energy (NYSE: BE)</h1>
            <div style={{ marginTop: 4, fontSize: 11.5, color: S.dim }}>
              Solid-oxide fuel cells · on-site power for AI data centers · A real franchise, at an unforgiving price
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <div style={{ borderRadius: 10, padding: "8px 13px", textAlign: "center", minWidth: 104, background: S.hotsoft, border: `1.5px solid ${S.hot}`, color: S.hot }}>
              <div style={{ font: `600 8px ${S.mono}`, letterSpacing: ".14em", textTransform: "uppercase", opacity: 0.75 }}>Short term</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>SELL / AVOID</div>
              <div style={{ font: `600 8px ${S.mono}`, letterSpacing: ".14em", textTransform: "uppercase", opacity: 0.75 }}>at ${p.toFixed(0)}</div>
            </div>
            <div style={{ borderRadius: 10, padding: "8px 13px", textAlign: "center", minWidth: 104, background: S.soft, border: `1.5px solid ${S.accent}`, color: S.accent }}>
              <div style={{ font: `600 8px ${S.mono}`, letterSpacing: ".14em", textTransform: "uppercase", opacity: 0.75 }}>Long term</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>BUY &lt; ${trig.toFixed(0)}</div>
              <div style={{ font: `600 8px ${S.mono}`, letterSpacing: ".14em", textTransform: "uppercase", opacity: 0.75 }}>{toTrig}% to trigger</div>
            </div>
          </div>
        </div>

        {/* stock data strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", border: `1px solid ${S.line}`, borderRadius: 10, overflow: "hidden", marginTop: 14 }}>
          {strip.map(([k, v], i) => (
            <div key={k} style={{ padding: "8px 10px", borderLeft: i ? `1px solid ${S.line}` : "none" }}>
              <div style={{ font: `600 7.5px ${S.mono}`, letterSpacing: ".12em", textTransform: "uppercase", color: S.mute }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 650, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22, marginTop: 12 }}>
          <div>
            <H2>The two-sided call</H2>
            <p style={{ color: S.ink2, fontSize: 12, margin: 0 }}>
              Bloom is the only company that can drop gigawatt-scale power next
              to an AI data center in months instead of years, a 17-year SOFC
              lead, ~$20B backlog, first sustained profit. We like the company
              and won&apos;t pay this price for it: at ${p.toFixed(0)} a buyer earns a
              negative-to-low return <i>even if the full bull case plays out</i>.
              Below ${trig.toFixed(0)} the same bull case pays a {(TRIGGER.hurdle * 100).toFixed(0)}% hurdle.
              Between those prices, we wait.
            </p>

            <H2>What the price requires (reverse DCF)</H2>
            <div style={{ background: "#fafafa", border: `1px solid ${S.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 11, color: S.ink2 }}>
              At our 21% WACC the price implies <b style={{ color: S.accent }}>124% growth next year</b> and
              FY2036 revenue of <b style={{ color: S.accent }}>5.6× Bloom&apos;s maximum factory output</b>. Even
              discounted like a mature industrial, the required path only just
              fits: the disclosed 5 GW/yr ceiling binds exactly near a{" "}
              <b style={{ color: S.accent }}>9.5%</b> rate. No reported beta (FactSet 2.02 → Kshana 3.93)
              produces a rate at which today&apos;s price is comfortably paid for.
            </div>

            <H2>Model price targets · v5 audited workbook</H2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <tbody>
                {([
                  ["Perpetuity DCF (g = 3.5%, WACC 21.0%)", "$10.36"],
                  ["EBITDA exit (13.5× FY2030)", "$32.81"],
                  ["Blended 50 / 50", "$21.59"],
                ] as const).map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: "5px 6px", borderBottom: `1px solid ${S.line}` }}>{k}</td>
                    <td style={{ padding: "5px 6px", borderBottom: `1px solid ${S.line}`, textAlign: "right", fontFamily: S.mono, fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "5px 6px" }}><b>Entry trigger, bull case at a {(TRIGGER.hurdle * 100).toFixed(0)}% hurdle</b></td>
                  <td style={{ padding: "5px 6px", textAlign: "right", fontFamily: S.mono, fontWeight: 700, color: S.accent }}>${trig.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <H2>Bull vs bear, one line each</H2>
            <ul style={{ paddingLeft: 15, color: S.ink2, fontSize: 11.5, margin: 0 }}>
              <li style={{ marginBottom: 4 }}><b style={{ color: S.ink }}>Bull:</b> signed hyperscale demand (Oracle 2.8 GW, AEP 1 GW, Brookfield $25B framework, Nebius) into a power crunch the grid can&apos;t fix in time.</li>
              <li><b style={{ color: S.ink }}>Bear:</b> ~50% related-party revenue, firm RPO only ~$0.5B of the $20B &quot;backlog&quot;, scandium/FEOC supply-chain questions, priced past its own bull case.</li>
            </ul>
          </div>

          <div>
            <H2>Catalysts · next 90 days</H2>
            {([
              ["JUL 28", "Q2 2026 print, graded against our pre-registered scorecard (/scorecard)"],
              ["OCT", "New Mexico air-permit hearing on Project Jupiter's fuel cells (pipeline blocked twice)"],
              ["DEC 31", "Treasury FEOC safe-harbor tables due, the compliance-risk clock"],
            ] as const).map(([d, txt]) => (
              <div key={d} style={{ display: "flex", gap: 8, fontSize: 11, color: S.ink2, marginBottom: 4 }}>
                <span style={{ fontFamily: S.mono, fontWeight: 600, color: S.ink, whiteSpace: "nowrap", fontSize: 10, paddingTop: 1 }}>{d}</span>
                <span>{txt}</span>
              </div>
            ))}

            <H2>What would change our mind</H2>
            <ul style={{ paddingLeft: 15, color: S.ink2, fontSize: 11.5, margin: 0 }}>
              {[
                "Arm's-length growth sustained above mid-teens",
                "A quarter of CFO not carried by affiliate collections",
                "MACR (FEOC) certification evidence on 2026 projects",
                "Jupiter fuel-path resolution on primary sources",
                "Next GW of capacity landing near the claimed ~$100M",
              ].map((f) => <li key={f} style={{ marginBottom: 3 }}>{f}</li>)}
            </ul>

            <H2>The beta dispute, priced</H2>
            <ul style={{ paddingLeft: 15, color: S.ink2, fontSize: 11.5, margin: 0 }}>
              <li style={{ marginBottom: 3 }}>FactSet β 2.02 → 13.3% → ~$28/sh</li>
              <li style={{ marginBottom: 3 }}>Yahoo β 3.74 → 20.9% → ~$18/sh</li>
              <li style={{ marginBottom: 3 }}><b style={{ color: S.ink }}>Ours β 3.77 → 21.0% → $21.59/sh</b></li>
              <li>Bottom-up β ~1.25 → 9.8% → the only rate the price nearly fits</li>
            </ul>

            <H2>Evidence discipline</H2>
            <p style={{ color: S.ink2, fontSize: 11, margin: 0 }}>
              Every figure is tiered: <b style={{ color: "#166534" }}>R</b> reported primary ·{" "}
              <b style={{ color: "#92400e" }}>D</b> derived ·{" "}
              <b style={{ color: "#6b21a8" }}>E</b> estimate, pinned to dated, frozen
              sources, and backed by a 287-note public research vault with the
              full audit changelog at <b>bep2.netlify.app/process</b>.
            </p>
          </div>
        </div>

        {/* footer */}
        <div style={{ position: "absolute", left: 42, right: 42, bottom: 22, borderTop: `1px solid ${S.strong}`, paddingTop: 8, display: "flex", justifyContent: "space-between", font: `500 8.5px ${S.mono}`, letterSpacing: ".08em", textTransform: "uppercase", color: S.mute }}>
          <span>bep2.netlify.app · vault: 287 notes · model v5 (audited Jul 8)</span>
          <span>generated from live data · page 1 / 1</span>
        </div>
      </div>
    </div>
  );
}
