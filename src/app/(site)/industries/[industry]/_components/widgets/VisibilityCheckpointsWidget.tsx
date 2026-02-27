"use client";

import * as React from "react";
import { IconFactory } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Mode = "ftl" | "ltl";
const DENSITY_MIN = 0;
const DENSITY_MAX = 100;

function clamp(v: number) {
  return Math.max(DENSITY_MIN, Math.min(DENSITY_MAX, v));
}

export function VisibilityCheckpointsWidget({ accentColor }: { accentColor?: string }) {
  const [density, setDensity] = React.useState(60);
  const [mode, setMode] = React.useState<Mode>("ftl");

  const blockCount = Math.round(8 + (density / 100) * 16);
  const utilization = Math.round(40 + (density / 100) * 55);
  const repackRisk = mode === "ltl" && density > 70;

  return (
    <WidgetCard
      icon={<IconFactory />}
      title="Load stack builder"
      accentColor={accentColor}
      howToUse="Slide density to fill the trailer with pallets. Switch to LTL at high density to see repack risk."
      aria-labelledby="load-stack-title"
      didYouKnow="Dense + LTL can trigger repack risk."
      visual={
        <div className="relative min-h-[140px] rounded-xl bg-slate-100/80 p-4">
          {/* Container outline + blocks */}
          <div className="relative h-24 rounded-lg border-2 border-slate-300 bg-slate-50/90 overflow-hidden">
            <div className="absolute inset-2 flex flex-wrap content-end gap-0.5 align-bottom">
              {Array.from({ length: blockCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-sm transition-all duration-200"
                  style={{ opacity: 0.85 - (i % 3) * 0.1, backgroundColor: accentColor ?? "rgb(100,116,139)" }}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          {/* Repack risk glow */}
          {repackRisk && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200"
              style={{ boxShadow: "inset 0 0 30px rgba(245,158,11,0.25)" }}
              aria-hidden
            />
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-[color:var(--color-text-light)]">
              Utilization {utilization}%
            </span>
            {repackRisk && (
              <span className="text-[10px] font-semibold text-amber-600">Repack risk</span>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Pallet density
            </label>
            <input
              type="range"
              min={DENSITY_MIN}
              max={DENSITY_MAX}
              value={density}
              onChange={(e) => setDensity(clamp(Number(e.target.value)))}
              aria-valuemin={DENSITY_MIN}
              aria-valuemax={DENSITY_MAX}
              aria-valuenow={density}
              aria-label="Pallet density from light to dense"
              className="h-2 w-full appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
              style={{ accentColor: accentColor ?? "var(--color-brand-500)" } as React.CSSProperties}
            />
            <div className="mt-0.5 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
              <span>Light</span>
              <span>Dense</span>
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Mode
            </span>
            <PillToggle
              value={mode}
              options={[
                { id: "ftl", label: "FTL" },
                { id: "ltl", label: "LTL" },
              ]}
              onChange={setMode}
              accentColor={accentColor}
              aria-label="Transport mode"
            />
          </div>
        </>
      }
    />
  );
}
