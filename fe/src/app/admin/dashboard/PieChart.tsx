"use client";
import * as React from "react";

export function PieReturnBorrow({
  totalBorrowed,
  totalReturned,
  className = "w-full aspect-square",
  startAngle = -90, // degrees; -90 = start at 12 o'clock
  colors = {
    returned: "#F27851", // wedge color
  },
}: {
  totalBorrowed: number;
  totalReturned: number;
  className?: string;
  startAngle?: number;
  returnedLabel?: string;
  activeLabel?: string;
  colors?: { returned: string };
  showCenter?: boolean;
}) {
  const total = Math.max(0, totalBorrowed || 0);
  const returned = Math.min(Math.max(0, totalReturned || 0), total);
  const returnedPct = total > 0 ? Math.round((returned / total) * 100) : 0;

  // Pie wedge overlay (only paints the returned slice; the rest lets the base disk show through)
  const wedge = `conic-gradient(from ${startAngle}deg, ${colors.returned} 0% ${returnedPct}%, transparent ${returnedPct}% 100%)`;

  // Base dark glossy disk: layered gradients + inset shadows to match the reference image
  const base1 =
    "radial-gradient(120% 120% at 30% 20%, #1f2a3a 0%, #0b1220 55%, #0a0f1c 100%)"; // body
  const base2 =
    "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0.45) 100%)"; // soft gloss

  return (
    <div className={`relative ${className}`} aria-label={`Returned ${returned}/${total} (${returnedPct}%)`}>
      {/* Base glossy disk */}
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundImage: `${base2}, ${base1}`,
          boxShadow:
            "inset 0 22px 60px rgba(255,255,255,0.08), inset 0 -30px 80px rgba(0,0,0,0.55), 0 10px 40px rgba(0,0,0,0.35)",
        }}
      />

      {/* Returned wedge overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ backgroundImage: wedge, transition: "background-image 600ms ease" }}
      />
    
    </div>
  );
}
