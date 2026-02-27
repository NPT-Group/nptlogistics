"use client";

import * as React from "react";
import { IconCubeStack } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type ShipmentType = "FTL" | "LTL";

const LTL_PENALTY = 12;
const STRESS_THRESHOLD = 85;
const OVERSTRESS_DENSITY = 90;
const STRESS_EFFICIENCY_PENALTY = 10;

function computeEfficiency(density: number, shipmentType: ShipmentType): number {
  let base = density;
  if (shipmentType === "LTL") base -= LTL_PENALTY;
  const stressRisk = density > STRESS_THRESHOLD;
  return Math.round(Math.max(0, Math.min(100, base - (stressRisk ? STRESS_EFFICIENCY_PENALTY : 0))));
}

function getStatus(
  density: number,
  efficiency: number
): "Optimized" | "Acceptable" | "Underutilized" | "Overstress Risk" {
  if (density > OVERSTRESS_DENSITY) return "Overstress Risk";
  if (efficiency >= 85) return "Optimized";
  if (efficiency >= 60) return "Acceptable";
  return "Underutilized";
}

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const f = () => setReduce(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return reduce;
}

export function LoadOptimizationWidget({ accentColor }: { accentColor?: string }) {
  const [density, setDensity] = React.useState(55);
  const [shipmentType, setShipmentType] = React.useState<ShipmentType>("FTL");
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const efficiency = React.useMemo(
    () => computeEfficiency(density, shipmentType),
    [density, shipmentType]
  );
  const status = getStatus(density, efficiency);
  const stressRisk = density > STRESS_THRESHOLD;
  const overstress = density > OVERSTRESS_DENSITY;
  const isLTL = shipmentType === "LTL";

  // Visual params: suspension squat (trailer lowers when heavy), block opacity/darkness, tilt when heavy + LTL
  const suspensionY = reduceMotion ? 0 : Math.min(4, ((density - 70) / 30) * 4);
  const tiltDeg = reduceMotion ? 0 : isLTL && density > 80 ? ((density - 80) / 20) * 3 : 0;
  const blockDarkness = 0.3 + (density / 100) * 0.6; // 0.3 → 0.9
  const fillHeight = 0.25 + (density / 100) * 0.65; // 25% → 90% of trailer interior height

  const statusColor =
    status === "Optimized"
      ? accent
      : status === "Acceptable"
        ? "var(--color-amber-600)"
        : status === "Overstress Risk"
          ? "rgb(220,38,38)"
          : "var(--color-muted-light)";

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconCubeStack />}
      title="Load Optimization Studio"
      accentColor={accentColor}
      howToUse="Slide material density and switch FTL/LTL. The trailer fill and utilization update to show efficiency and stress."
      aria-labelledby="load-optimization-title"
      didYouKnow="FTL = full trailer, clean fill. LTL = mixed loads, natural gaps. High density can trigger overstress."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Material density
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${density}%`, backgroundColor: accent }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={density}
                  aria-label="Material density from light to heavy"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
                <span>Light</span>
                <span>Heavy</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Shipment type
              </span>
              <PillToggle
                value={shipmentType}
                options={[
                  { id: "FTL", label: "FTL" },
                  { id: "LTL", label: "LTL" },
                ]}
                onChange={setShipmentType}
                accentColor={accentColor}
                aria-label="Full truckload or less than truckload"
              />
              <p className="mt-1 text-[9px] text-[color:var(--color-muted-light)]">
                {isLTL ? "Mixed loads, natural gaps" : "Full trailer, clean fill"}
              </p>
            </div>
          </div>

          {/* Right: trailer scene + output */}
          <div className="flex flex-col gap-2.5 min-h-0">
            <div
              className="relative flex-1 min-h-[100px] max-h-[140px] overflow-hidden rounded-xl shadow-inner"
              style={{
                background:
                  "linear-gradient(180deg, rgba(241,245,249,0.98) 0%, rgba(226,232,240,0.95) 100%)",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(15,23,42,0.06)",
              }}
            >
              <TrailerScene
                density={density}
                shipmentType={shipmentType}
                fillHeight={fillHeight}
                blockDarkness={blockDarkness}
                suspensionY={suspensionY}
                tiltDeg={tiltDeg}
                stressRisk={stressRisk}
                overstress={overstress}
                accent={accent}
              />
            </div>

            {/* Utilization + status */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm"
              style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Utilization
                </span>
                <div className="h-2 min-w-[72px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${efficiency}%`,
                      background:
                        status === "Overstress Risk"
                          ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                          : status === "Underutilized"
                            ? "linear-gradient(90deg, #94a3b8, #64748b)"
                            : status === "Acceptable"
                              ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                              : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tabular-nums shrink-0"
                  style={{ color: statusColor }}
                >
                  {efficiency}%
                </span>
              </div>
              <span
                className="inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold shrink-0"
                style={{
                  backgroundColor: `${statusColor}14`,
                  borderColor: `${statusColor}40`,
                  color: statusColor,
                }}
              >
                {status}
              </span>
              {efficiency >= 85 && !overstress && (
                <span className="text-[10px] text-[color:var(--color-muted-light)] shrink-0">
                  Structural efficiency: High
                </span>
              )}
            </div>
          </div>
        </div>
      }
      controls={<></>}
    />
  );
}

function TrailerScene({
  density,
  shipmentType,
  fillHeight,
  blockDarkness,
  suspensionY,
  tiltDeg,
  stressRisk,
  overstress,
  accent: _accent,
}: {
  density: number;
  shipmentType: ShipmentType;
  fillHeight: number;
  blockDarkness: number;
  suspensionY: number;
  tiltDeg: number;
  stressRisk: boolean;
  overstress: boolean;
  accent: string;
}) {
  const isLTL = shipmentType === "LTL";
  const viewW = 320;
  const viewH = 100;
  const trailerX = 24;
  const trailerY = 18;
  const trailerW = viewW - 48;
  const trailerH = viewH - 36;
  const innerY = trailerY + 4;
  const innerH = trailerH - 8;

  // Block layout: FTL = uniform rows; LTL = mixed sizes with gaps
  // fillHeight is 0.25–0.9; we draw blocks up to that fraction of innerH
  const fillPx = innerH * fillHeight;
  const hasTiltWarning = isLTL && density > 80;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="h-full w-full max-h-[120px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="lo-trailer-bed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <pattern
            id="lo-block-stripe"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(0)"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
          </pattern>
          <filter id="lo-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Ground line */}
        <line
          x1={trailerX}
          y1={viewH - 10}
          x2={viewW - trailerX}
          y2={viewH - 10}
          stroke="#94a3b8"
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* Trailer body (suspension squat: move down when heavy) */}
        <g transform={`translate(0, ${suspensionY})`}>
          {/* Main container outline */}
          <rect
            x={trailerX}
            y={trailerY}
            width={trailerW}
            height={trailerH}
            rx="3"
            fill="url(#lo-trailer-bed)"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          {/* Inner floor */}
          <rect
            x={trailerX + 2}
            y={innerY + innerH - 2}
            width={trailerW - 4}
            height="2"
            fill="rgba(148,163,184,0.4)"
            rx="0.5"
          />

          {/* Cargo blocks (clip to inner area) */}
          <g transform={`translate(${trailerX + 4}, ${innerY + innerH - 4})`}>
            <g transform={`rotate(${-tiltDeg}, ${(trailerW - 8) / 2}, 0)`}>
              {isLTL ? (
                <LTLBlocks
                  w={trailerW - 8}
                  fillPx={fillPx}
                  blockDarkness={blockDarkness}
                  density={density}
                />
              ) : (
                <FTLBlocks
                  w={trailerW - 8}
                  fillPx={fillPx}
                  blockDarkness={blockDarkness}
                  density={density}
                />
              )}
            </g>
          </g>

          {/* Axle pressure bars (subtle) when stress risk */}
          {stressRisk && (
            <g>
              <rect
                x={trailerX + trailerW * 0.25 - 12}
                y={viewH - 14}
                width="24"
                height="4"
                rx="1"
                fill="rgba(148,163,184,0.3)"
              />
              <rect
                x={trailerX + trailerW * 0.75 - 12}
                y={viewH - 14}
                width="24"
                height="4"
                rx="1"
                fill="rgba(148,163,184,0.3)"
              />
              <rect
                x={trailerX + trailerW * 0.25 - 12}
                y={viewH - 14}
                width={Math.min(24, (density / 100) * 24)}
                height="4"
                rx="1"
                fill={overstress ? "rgb(220,38,38)" : "var(--color-amber-500)"}
                opacity="0.9"
              />
              <rect
                x={trailerX + trailerW * 0.75 - 12}
                y={viewH - 14}
                width={Math.min(24, (density / 100) * 24)}
                height="4"
                rx="1"
                fill={overstress ? "rgb(220,38,38)" : "var(--color-amber-500)"}
                opacity="0.9"
              />
            </g>
          )}
        </g>

        {/* Tilt warning icon when heavy + LTL */}
        {hasTiltWarning && (
          <g transform={`translate(${viewW - 28}, 22)`} aria-hidden>
            <circle r="10" fill="rgba(245,158,11,0.2)" stroke="rgb(245,158,11)" strokeWidth="1.2" />
            <path
              d="M-4 -2 L4 0 L-4 2 Z"
              fill="rgb(245,158,11)"
              transform="rotate(-15)"
            />
            <path
              d="M0 -5 v10"
              stroke="rgb(245,158,11)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Optional tiny forklift icon (decorative) */}
        <g transform={`translate(${trailerX - 14}, ${viewH - 22})`} opacity="0.35" aria-hidden>
          <rect x="0" y="4" width="8" height="6" rx="0.5" fill="#94a3b8" />
          <rect x="2" y="0" width="4" height="5" fill="#64748b" />
          <circle cx="3" cy="12" r="1.2" fill="#475569" />
          <circle cx="7" cy="12" r="1.2" fill="#475569" />
        </g>
      </svg>
    </div>
  );
}

/** FTL: uniform blocks, clean fill, no gaps */
function FTLBlocks({
  w,
  fillPx,
  blockDarkness,
  density,
}: {
  w: number;
  fillPx: number;
  blockDarkness: number;
  density: number;
}) {
  const blockH = Math.max(8, fillPx / 3);
  const gap = 2;
  const cols = 5;
  const blockW = (w - gap * (cols - 1)) / cols;
  const base = `rgb(${Math.round(120 - blockDarkness * 80)},${Math.round(140 - blockDarkness * 60)},${Math.round(160 - blockDarkness * 50)})`;
  const blocks: { x: number; y: number; w: number; h: number }[] = [];
  const numRows = Math.max(1, Math.min(5, Math.floor((fillPx + gap) / (blockH + gap))));
  for (let row = 0; row < numRows; row++) {
    const y = -fillPx + row * (blockH + gap);
    if (y + blockH > 0) break;
    for (let c = 0; c < cols; c++) {
      blocks.push({ x: c * (blockW + gap), y, w: blockW, h: blockH });
    }
  }
  return (
    <>
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="1"
          fill={base}
          fillOpacity={0.85 + (density / 100) * 0.15}
          stroke="#94a3b8"
          strokeWidth="0.6"
          filter="url(#lo-shadow)"
        />
      ))}
    </>
  );
}

/** LTL: mixed block sizes, small gaps */
function LTLBlocks({
  w,
  fillPx,
  blockDarkness,
  density,
}: {
  w: number;
  fillPx: number;
  blockDarkness: number;
  density: number;
}) {
  const base = `rgb(${Math.round(120 - blockDarkness * 80)},${Math.round(140 - blockDarkness * 60)},${Math.round(160 - blockDarkness * 50)})`;
  // Mixed layout: 2–3 rows of varying widths with gaps
  const layout = [
    { x: 0, y: -fillPx + 4, w: w * 0.28, h: Math.min(18, fillPx * 0.4) },
    { x: w * 0.3 + 4, y: -fillPx + 4, w: w * 0.22, h: Math.min(16, fillPx * 0.35) },
    { x: w * 0.56 + 6, y: -fillPx + 4, w: w * 0.38, h: Math.min(20, fillPx * 0.45) },
    { x: 0, y: -fillPx * 0.55, w: w * 0.35, h: Math.min(16, fillPx * 0.35) },
    { x: w * 0.38 + 4, y: -fillPx * 0.52, w: w * 0.25, h: Math.min(14, fillPx * 0.3) },
    { x: w * 0.66 + 6, y: -fillPx * 0.58, w: w * 0.28, h: Math.min(18, fillPx * 0.4) },
    { x: w * 0.15, y: -fillPx * 0.15, w: w * 0.4, h: Math.min(14, fillPx * 0.28) },
    { x: w * 0.58 + 4, y: -fillPx * 0.12, w: w * 0.32, h: Math.min(12, fillPx * 0.25) },
  ];
  return (
    <>
      {layout.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="1"
          fill={base}
          fillOpacity={0.8 + (density / 100) * 0.2}
          stroke="#94a3b8"
          strokeWidth="0.6"
          filter="url(#lo-shadow)"
        />
      ))}
      {/* Empty grey gaps hint (visible when density low) */}
      {density < 50 && (
        <rect
          x={w * 0.52}
          y={-fillPx * 0.2}
          width={w * 0.15}
          height={fillPx * 0.25}
          rx="1"
          fill="rgba(148,163,184,0.25)"
          stroke="rgba(148,163,184,0.3)"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
      )}
    </>
  );
}
