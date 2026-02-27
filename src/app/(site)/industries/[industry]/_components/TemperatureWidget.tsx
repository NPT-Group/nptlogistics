"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type TempRange = "deep-freezer" | "freezer" | "refrigerated" | "chilled" | "ambient";

const RANGES: { key: TempRange; label: string; min: number; max: number; description: string }[] = [
  { key: "deep-freezer", label: "Deep freezer", min: -25, max: -15, description: "Optimal for long-term frozen storage and sensitive products requiring strict temperature control." },
  { key: "freezer", label: "Freezer", min: -15, max: -5, description: "Ideal for frozen goods, ice cream, and products that require consistent sub-zero handling." },
  { key: "refrigerated", label: "Refrigerated", min: -5, max: 5, description: "Optimal for most perishable foods including dairy, meat, and most fruits and vegetables." },
  { key: "chilled", label: "Chilled", min: 5, max: 15, description: "Suitable for produce and products that need cool but not cold conditions." },
  { key: "ambient", label: "Ambient", min: 15, max: 25, description: "Dry goods and shelf-stable products that do not require temperature control." },
];

function getRangeForTemp(celsius: number): (typeof RANGES)[number] {
  for (let i = RANGES.length - 1; i >= 0; i--) {
    if (celsius >= RANGES[i].min && celsius <= RANGES[i].max) return RANGES[i];
  }
  if (celsius < RANGES[0].min) return RANGES[0];
  return RANGES[RANGES.length - 1];
}

const DEFAULT_ACCENT = "var(--color-brand-500)";

export function TemperatureWidget({ accentColor }: { accentColor?: string }) {
  const [temp, setTemp] = React.useState(-9);
  const range = getRangeForTemp(temp);
  const accent = accentColor ?? DEFAULT_ACCENT;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white/98 p-6 shadow-[0_2px_12px_rgba(2,6,23,0.04)] sm:p-7",
        "focus-within:ring-2 focus-within:ring-offset-2",
      )}
      role="group"
      aria-labelledby="temperature-widget-title"
    >
      <div className="flex items-center gap-2" style={{ color: accent }}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3M3 12h18M3 12l3-3m0 6l-3 3M21 12l-3 3m0-6l3-3M12 21l-3-3m3 3l3-3" />
        </svg>
        <h3 id="temperature-widget-title" className="text-[1rem] font-bold" style={{ color: accent }}>
          Temperature control
        </h3>
      </div>
      <p className="mt-1 text-[11px] font-medium text-[color:var(--color-muted-light)]">Explore storage ranges (engagement only)</p>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="industry-temp-slider" className="text-[12px] font-medium text-[color:var(--color-muted-light)]">
            Current temperature
          </label>
          <span className="text-[1.1rem] font-bold tabular-nums" style={{ color: accent }}>
            {temp}°C
          </span>
        </div>
        <input
          id="industry-temp-slider"
          type="range"
          min={-20}
          max={25}
          step={1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="mt-2 h-2 w-full appearance-none rounded-full bg-[color:var(--color-border-light)]/60 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          style={{
            ["--tw-accent" as string]: accent,
            background: `linear-gradient(to right, ${accent} 0%, ${accent} ${((temp + 20) / 45) * 100}%, rgba(15,23,42,0.1) ${((temp + 20) / 45) * 100}%, rgba(15,23,42,0.1) 100%)`,
          }}
          aria-valuemin={-20}
          aria-valuemax={25}
          aria-valuenow={temp}
          aria-valuetext={`${temp} degrees Celsius`}
        />
        <div className="mt-1 flex justify-between text-[10px] text-[color:var(--color-muted-light)]">
          <span>-20°C</span>
          <span>-10°C</span>
          <span>0°C</span>
          <span>10°C</span>
          <span>25°C</span>
        </div>
      </div>
      <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: `${accent}18` }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
          Temperature status
        </p>
        <p className="mt-1 font-semibold text-[color:var(--color-text-light)]">{range.label}</p>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-[color:var(--color-muted-light)]">
          {range.description}
        </p>
      </div>
    </div>
  );
}
