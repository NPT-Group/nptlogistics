"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { IconCart } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Channel = "store" | "ecomm";
const DEMAND_MIN = 0;
const DEMAND_MAX = 100;

function clamp(v: number) {
  return Math.max(DEMAND_MIN, Math.min(DEMAND_MAX, v));
}

export function DeliveryPromiseWidget({ accentColor }: { accentColor?: string }) {
  const [demand, setDemand] = React.useState(30);
  const [channel, setChannel] = React.useState<Channel>("store");

  const waveHeight = 20 + (demand / 100) * 40;
  const fulfillmentLevel = Math.max(0, 100 - demand * 0.8 - (channel === "ecomm" ? 15 : 0));
  const slaStrained = fulfillmentLevel < 60;

  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <WidgetCard
      icon={<IconCart />}
      title="Demand wave + fulfillment"
      accentColor={accentColor}
      howToUse="Move the slider toward Peak to see demand rise; switch to E-comm for parcel volume. The bar shows system load."
      aria-labelledby="demand-widget-title"
      didYouKnow="Peak raises the wave; e-comm adds parcel load."
      visual={
        <div className="relative min-h-[140px] rounded-xl bg-slate-100/80 p-4">
          {/* Wave (SVG) */}
          <svg viewBox="0 0 200 60" className="h-20 w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(148,163,184)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(148,163,184)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d={`M0,30 Q40,${30 - waveHeight / 2} 80,30 T160,30 T200,30 V60 H0 Z`}
              fill="url(#waveGrad)"
              className="transition-all duration-200"
            />
            <path
              d={`M0,30 Q40,${30 - waveHeight / 2} 80,30 T160,30 T200,30`}
              fill="none"
              stroke="rgb(100,116,139)"
              strokeWidth="1.5"
              strokeOpacity="0.6"
              className="transition-all duration-200"
            />
          </svg>
          {/* Fulfillment meter */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{ width: `${fulfillmentLevel}%`, backgroundColor: accent }}
              />
            </div>
            <span className="text-[10px] font-medium text-[color:var(--color-muted-light)] w-16">
              System load
            </span>
          </div>
          {/* SLA badge */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded px-2 py-0.5 text-[10px] font-semibold",
                slaStrained && "bg-amber-100 text-amber-800",
              )}
              style={!slaStrained ? { backgroundColor: `${accent}20`, color: accent } : undefined}
            >
              {slaStrained ? "Strained" : "Stable"}
            </span>
            <span className="text-[10px] text-[color:var(--color-muted-light)]">
              NPT response: Surge ready
            </span>
          </div>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Demand wave
            </label>
            <input
              type="range"
              min={DEMAND_MIN}
              max={DEMAND_MAX}
              value={demand}
              onChange={(e) => setDemand(clamp(Number(e.target.value)))}
              aria-valuemin={DEMAND_MIN}
              aria-valuemax={DEMAND_MAX}
              aria-valuenow={demand}
              aria-label="Demand from normal to peak"
              className="h-2 w-full appearance-none rounded-full bg-slate-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow"
              style={{ accentColor: accent } as React.CSSProperties}
            />
            <div className="mt-0.5 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
              <span>Normal</span>
              <span>Peak</span>
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Channel
            </span>
            <PillToggle
              value={channel}
              options={[
                { id: "store", label: "Store" },
                { id: "ecomm", label: "E-comm" },
              ]}
              onChange={setChannel}
              accentColor={accentColor}
              aria-label="Channel"
            />
          </div>
        </>
      }
    />
  );
}
