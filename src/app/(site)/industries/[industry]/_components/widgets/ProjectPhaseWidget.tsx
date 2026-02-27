"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { IconShield } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type LoadType = "oversized" | "hazmat";
const COMPLEXITY_MIN = 0;
const COMPLEXITY_MAX = 100;

function clamp(v: number) {
  return Math.max(COMPLEXITY_MIN, Math.min(COMPLEXITY_MAX, v));
}

export function ProjectPhaseWidget({ accentColor }: { accentColor?: string }) {
  const [complexity, setComplexity] = React.useState(40);
  const [loadType, setLoadType] = React.useState<LoadType>("oversized");

  const stops = Math.round(2 + (complexity / 100) * 6 + (loadType === "hazmat" ? 3 : 0));
  const enhanced = loadType === "hazmat" || complexity > 70;

  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <WidgetCard
      icon={<IconShield />}
      title="Permit & compliance route"
      accentColor={accentColor}
      howToUse="Slide complexity to add stops on the route; switch to Hazmat to see enhanced compliance."
      aria-labelledby="permit-widget-title"
      didYouKnow="Complexity adds checkpoints; hazmat adds compliance nodes."
      visual={
        <div className="relative min-h-[120px] rounded-xl bg-slate-100/80 p-4">
          {/* Route line + checkpoints (SVG) */}
          <svg viewBox="0 0 200 50" className="h-14 w-full" aria-hidden>
            <path
              d="M 0 25 Q 50 10 100 25 T 200 25"
              fill="none"
              stroke="rgb(148,163,184)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Checkpoint dots */}
            {Array.from({ length: Math.min(stops, 8) }).map((_, i) => {
              const x = 20 + (i / (Math.min(stops, 8) - 1 || 1)) * 160;
              const y = 25 + Math.sin((i * 0.8) * 0.5) * 8;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={accent} stroke="white" strokeWidth="1.5" />
                  {loadType === "hazmat" && i % 2 === 1 && (
                    <circle cx={x} cy={y} r="2" fill="rgb(220,38,38)" />
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="font-medium text-[color:var(--color-text-light)]">
              Stops: {stops}
            </span>
            <span className={cn("font-medium", enhanced ? "text-amber-600" : "text-[color:var(--color-muted-light)]")}>
              Compliance: {enhanced ? "Enhanced" : "Standard"}
            </span>
          </div>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Route complexity
            </label>
            <input
              type="range"
              min={COMPLEXITY_MIN}
              max={COMPLEXITY_MAX}
              value={complexity}
              onChange={(e) => setComplexity(clamp(Number(e.target.value)))}
              aria-valuemin={COMPLEXITY_MIN}
              aria-valuemax={COMPLEXITY_MAX}
              aria-valuenow={complexity}
              aria-label="Route complexity from simple to complex"
              className="h-2 w-full appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[color:var(--color-text-light)] [&::-webkit-slider-thumb]:shadow"
            />
            <div className="mt-0.5 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
              <span>Simple</span>
              <span>Complex</span>
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Load type
            </span>
            <PillToggle
              value={loadType}
              options={[
                { id: "oversized", label: "Oversized" },
                { id: "hazmat", label: "Hazmat" },
              ]}
              onChange={setLoadType}
              accentColor={accentColor}
              aria-label="Load type"
            />
          </div>
        </>
      }
    />
  );
}
