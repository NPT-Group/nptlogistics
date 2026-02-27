"use client";

import * as React from "react";
import { IconThermometer } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Product = "dairy" | "frozen" | "produce" | "beverage";

const PRODUCT_SAFE: Record<Product, { min: number; max: number; label: string }> = {
  dairy: { min: 2, max: 6, label: "Dairy" },
  frozen: { min: -18, max: -12, label: "Frozen" },
  produce: { min: 0, max: 4, label: "Produce" },
  beverage: { min: 4, max: 10, label: "Beverage" },
};

const TEMP_MIN = -25;
const TEMP_MAX = 15;
const SNAP_STEP = 1;

function clampTemp(v: number) {
  return Math.max(TEMP_MIN, Math.min(TEMP_MAX, Math.round(v)));
}

export function ColdChainJourneyWidget({ accentColor }: { accentColor?: string }) {
  const [temp, setTemp] = React.useState(2);
  const [product, setProduct] = React.useState<Product>("dairy");

  const safe = PRODUCT_SAFE[product];
  const inRange = temp >= safe.min && temp <= safe.max;
  const freshnessLevel = inRange ? 1 : Math.max(0, 1 - Math.abs(temp - (temp < safe.min ? safe.min : safe.max)) / 20);
  const frostOpacity = temp <= 0 ? Math.min(0.4, (0 - temp) / 30) : 0;
  const riskGlow = inRange ? 0 : Math.min(0.5, (Math.abs(temp - safe.min) + Math.abs(temp - safe.max)) / 40);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemp(clampTemp(Number(e.target.value)));
  };
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") setTemp((t) => clampTemp(t - SNAP_STEP));
    if (e.key === "ArrowRight") setTemp((t) => clampTemp(t + SNAP_STEP));
  };

  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <WidgetCard
      icon={<IconThermometer />}
      title="Cold chain dial"
      accentColor={accentColor}
      howToUse="Pick a product, then move the slider. The coloured band is the safe temperature range; the marker is current temp."
      aria-labelledby="cold-chain-widget-title"
      didYouKnow="Safe band and freshness react to product type."
      visual={
        <div className="relative min-h-[140px] rounded-xl bg-gradient-to-b from-slate-100 to-slate-50 p-4 transition-colors duration-200">
          <div
            className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.9),transparent_70%)] transition-opacity duration-200"
            style={{ opacity: frostOpacity }}
            aria-hidden
          />
          {riskGlow > 0 && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200"
              style={{ boxShadow: `inset 0 0 40px rgba(220,38,38,${riskGlow})`, opacity: 1 }}
              aria-hidden
            />
          )}
          <div className="relative h-10 rounded-full bg-slate-200/80 overflow-hidden">
            <div
              className="absolute inset-y-0 rounded-full transition-all duration-200"
              style={{
                left: `${((safe.min - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100}%`,
                width: `${((safe.max - safe.min) / (TEMP_MAX - TEMP_MIN)) * 100}%`,
                backgroundColor: accent,
                opacity: 0.85,
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 rounded-full shadow-md transition-[left] duration-150"
              style={{ left: `${((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100}%`, transform: "translateX(-50%)", backgroundColor: accent }}
              aria-hidden
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{ width: `${freshnessLevel * 100}%`, backgroundColor: accent }}
              />
            </div>
            <span className="text-[10px] font-medium tabular-nums text-[color:var(--color-muted-light)] w-8">
              {temp}°C
            </span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-[color:var(--color-text-light)]">
            Safe band: {safe.min} to {safe.max}°C
          </p>
          <p className="mt-0.5 text-[11px] font-medium" style={{ color: inRange ? accent : "var(--color-amber-600)" }}>
            Status: {inRange ? "Stable" : "At risk"}
          </p>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Temperature
            </label>
            <input
              type="range"
              min={TEMP_MIN}
              max={TEMP_MAX}
              step={SNAP_STEP}
              value={temp}
              onChange={handleSlider}
              onKeyDown={handleKey}
              aria-valuemin={TEMP_MIN}
              aria-valuemax={TEMP_MAX}
              aria-valuenow={temp}
              aria-label="Temperature in degrees Celsius"
              className="h-2 w-full appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow transition-colors"
              style={{
                accentColor: accent,
              } as React.CSSProperties}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Product type
            </span>
            <PillToggle
              value={product}
              options={[
                { id: "dairy", label: "Dairy" },
                { id: "frozen", label: "Frozen" },
                { id: "produce", label: "Produce" },
                { id: "beverage", label: "Beverage" },
              ]}
              onChange={setProduct}
              accentColor={accentColor}
              aria-label="Product type"
            />
          </div>
        </>
      }
    />
  );
}
