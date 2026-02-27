"use client";

import * as React from "react";
import { IconWeight } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Weight = "medium" | "heavy";
const COG_MIN = -100;
const COG_MAX = 100;

function clamp(v: number) {
  return Math.max(COG_MIN, Math.min(COG_MAX, v));
}

export function LoadTypeWidget({ accentColor }: { accentColor?: string }) {
  const [cog, setCog] = React.useState(0);
  const [weight, setWeight] = React.useState<Weight>("medium");

  const leftPct = cog <= 0 ? 50 + (cog / 100) * 40 : 50 - (cog / 100) * 30;
  const rightPct = 100 - leftPct;
  const sensitivity = weight === "heavy" ? 1.4 : 1;
  const imbalance = Math.abs(cog) > 80 / sensitivity;
  const axleLeft = Math.round(leftPct);
  const axleRight = Math.round(rightPct);

  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <WidgetCard
      icon={<IconWeight />}
      title="Axle load balance"
      accentColor={accentColor}
      howToUse="Move the slider to shift load left or right. The bars show steer vs drive axle pressure; red means reposition."
      aria-labelledby="axle-widget-title"
      didYouKnow="CoG shift changes axle pressure; heavy increases sensitivity."
      visual={
        <div className="relative min-h-[140px] rounded-xl bg-slate-100/80 p-4">
          {/* Truck bed outline (simple SVG) */}
          <svg viewBox="0 0 200 60" className="h-16 w-full" aria-hidden>
            <rect x="10" y="20" width="180" height="24" rx="2" fill="rgb(226,232,240)" stroke="rgb(148,163,184)" strokeWidth="1" />
            {/* Load blob position by CoG */}
            <ellipse
              cx={100 + (cog / 100) * 40}
              cy="32"
              rx="25"
              ry="10"
              fill="rgb(100,116,139)"
              opacity="0.9"
              className="transition-all duration-200"
            />
          </svg>
          {/* Axle pressure bars */}
          <div className="mt-2 flex gap-4">
            <div className="flex-1">
              <div className="text-[9px] font-medium text-[color:var(--color-muted-light)] mb-0.5">Steer</div>
              <div className="h-8 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-200"
                  style={{
                    width: `${axleLeft}%`,
                    backgroundColor: imbalance ? "rgb(239,68,68)" : accent,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-medium text-[color:var(--color-muted-light)] mb-0.5">Drive</div>
              <div className="h-8 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-200"
                  style={{
                    width: `${axleRight}%`,
                    backgroundColor: imbalance ? "rgb(239,68,68)" : accent,
                  }}
                />
              </div>
            </div>
          </div>
          {/* Balance + axle spec */}
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="font-medium" style={{ color: imbalance ? "rgb(220,38,38)" : accent }}>
              Balance: {imbalance ? "Risk" : "OK"}
            </span>
            <span className="text-[color:var(--color-muted-light)]">
              Axle load: {imbalance ? "reposition" : "within spec"}
            </span>
          </div>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Center of gravity
            </label>
            <input
              type="range"
              min={COG_MIN}
              max={COG_MAX}
              value={cog}
              onChange={(e) => setCog(clamp(Number(e.target.value)))}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setCog((v) => clamp(v - 10));
                if (e.key === "ArrowRight") setCog((v) => clamp(v + 10));
              }}
              aria-valuemin={COG_MIN}
              aria-valuemax={COG_MAX}
              aria-valuenow={cog}
              aria-label="Center of gravity from left to right"
              className="h-2 w-full appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[color:var(--color-text-light)] [&::-webkit-slider-thumb]:shadow"
            />
            <div className="mt-0.5 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
              <span>Left</span>
              <span>Balanced</span>
              <span>Right</span>
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Weight
            </span>
            <PillToggle
              value={weight}
              options={[
                { id: "medium", label: "Medium" },
                { id: "heavy", label: "Heavy" },
              ]}
              onChange={setWeight}
              accentColor={accentColor}
              aria-label="Load weight"
            />
          </div>
        </>
      }
    />
  );
}
