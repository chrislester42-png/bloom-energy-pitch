"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Signature motif: a grid of fuel-cell / LEGO-block "cells".
 * Idle cells are faint ink; a clustered subset ignites Bloom green
 * to suggest the reaction firing. CSS-cascade driven (opacity only),
 * memoized + isolated client component.
 */

type Cell = { hot: boolean; delay: number; bright: number };

function buildCells(cols: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const heat = (c / cols) * 0.55 + (r / rows) * 0.55;
      const hot = Math.random() < heat * 0.4;
      cells.push({
        hot,
        delay: Math.random() * 4,
        bright: 0.05 + Math.random() * 0.08,
      });
    }
  }
  return cells;
}

function CellGridBase({ cols = 11, rows = 13 }: { cols?: number; rows?: number }) {
  const cells = useMemo(() => buildCells(cols, rows), [cols, rows]);

  return (
    <div className="relative">
      {/* soft green backdrop where the cells pool */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10"
        style={{
          background:
            "radial-gradient(58% 52% at 74% 78%, rgba(15,138,77,0.14), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
        className="relative grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[3px] ${
              cell.hot ? "cell-ignite bg-accent" : "cell-pulse bg-ink"
            }`}
            style={{
              animationDelay: `${cell.delay}s`,
              opacity: cell.hot ? undefined : cell.bright,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export const CellGrid = memo(CellGridBase);
export default CellGrid;
