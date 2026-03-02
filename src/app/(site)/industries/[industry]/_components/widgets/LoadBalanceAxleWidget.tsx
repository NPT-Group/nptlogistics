"use client";

import * as React from "react";
import { IconWeight } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type LoadLength = "short" | "standard" | "extended";

const WEIGHT_MIN = 10;
const WEIGHT_MAX = 80;
const COG_MIN = -100;
const COG_MAX = 100;
const MAX_TONS_PER_AXLE = 30;

const CENTER_SHARE: Record<LoadLength, number> = {
  short: 0.25,
  standard: 0.3,
  extended: 0.35,
};

function computeAxles(weight: number, cog: number, loadLength: LoadLength) {
  const centerShare = CENTER_SHARE[loadLength];
  const centerAxle = weight * centerShare;
  const endAxles = weight * (1 - centerShare);
  const leftAxle = endAxles * (0.5 - cog / 200);
  const rightAxle = endAxles * (0.5 + cog / 200);
  return { leftAxle: Math.max(0, leftAxle), rightAxle: Math.max(0, rightAxle), centerAxle };
}

function pressurePct(tons: number): number {
  return Math.min(100, Math.round((tons / MAX_TONS_PER_AXLE) * 100));
}

function stabilityScore(
  leftPressure: number,
  rightPressure: number,
  weight: number
): number {
  const imbalance = Math.abs(leftPressure - rightPressure);
  return Math.max(0, Math.min(100, Math.round(100 - imbalance - weight * 0.5)));
}

function getStatus(
  stability: number,
  leftPressure: number,
  rightPressure: number,
  centerPressure: number
): "Balanced" | "High Load" | "Overstress Risk" {
  const anyOverstress = leftPressure >= 100 || rightPressure >= 100 || centerPressure >= 100;
  if (anyOverstress || stability < 60) return "Overstress Risk";
  if (stability >= 85) return "Balanced";
  return "High Load";
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

export function LoadBalanceAxleWidget({ accentColor }: { accentColor?: string }) {
  const [weight, setWeight] = React.useState(35);
  const [cog, setCog] = React.useState(0);
  const [loadLength, setLoadLength] = React.useState<LoadLength>("standard");
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const { leftAxle, rightAxle, centerAxle } = React.useMemo(
    () => computeAxles(weight, cog, loadLength),
    [weight, cog, loadLength]
  );
  const leftPressure = pressurePct(leftAxle);
  const rightPressure = pressurePct(rightAxle);
  const centerPressure = pressurePct(centerAxle);
  const stability = stabilityScore(leftPressure, rightPressure, weight);
  const status = getStatus(stability, leftPressure, rightPressure, centerPressure);

  const statusColor =
    status === "Balanced"
      ? accent
      : status === "High Load"
        ? "var(--color-amber-600)"
        : "rgb(220,38,38)";

  const tiltDeg = reduceMotion ? 0 : (cog / 100) * 1.8;
  const coilOffsetX = (cog / 100) * 18;
  const maxPressure = Math.max(leftPressure, rightPressure, centerPressure);
  const barColor =
    maxPressure >= 100
      ? "rgb(220,38,38)"
      : maxPressure >= 80
        ? "var(--color-amber-600)"
        : accent;

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconWeight />}
      title="Load Balance and Axle Stress Model"
      accentColor={accentColor}
      howToUse="Adjust weight and center of gravity to evaluate axle pressure distribution and stability."
      aria-labelledby="load-balance-axle-title"
      didYouKnow="Center-of-gravity shift redistributes axle load; balanced placement improves stability under heavy weight."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Load weight
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
                  style={{
                    width: `${((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%`,
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={WEIGHT_MIN}
                  max={WEIGHT_MAX}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  aria-label="Load weight in tons"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <p className="mt-1 text-[9px] text-[color:var(--color-muted-light)]">
                {weight} tons
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Center of gravity
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200 opacity-60"
                  style={{
                    left: "50%",
                    width: "4px",
                    transform: "translateX(-50%)",
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={COG_MIN}
                  max={COG_MAX}
                  value={cog}
                  onChange={(e) => setCog(Number(e.target.value))}
                  aria-label="Center of gravity left to right"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
                <span>Left</span>
                <span>Balanced</span>
                <span>Right</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Load length
              </span>
              <PillToggle
                value={loadLength}
                options={[
                  { id: "short", label: "Short" },
                  { id: "standard", label: "Standard" },
                  { id: "extended", label: "Extended" },
                ]}
                onChange={setLoadLength}
                accentColor={accentColor}
                aria-label="Load length"
              />
            </div>
          </div>

          {/* Right: flatbed + axle bars + output */}
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
              <FlatbedScene
                weight={weight}
                cog={cog}
                tiltDeg={tiltDeg}
                coilOffsetX={coilOffsetX}
                leftPressure={leftPressure}
                rightPressure={rightPressure}
                centerPressure={centerPressure}
                status={status}
                accent={accent}
                barColor={barColor}
              />
            </div>

            {/* Stability + axle bars summary + status */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm"
              style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Stability
                </span>
                <div className="h-2 min-w-[50px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${stability}%`,
                      background:
                        status === "Overstress Risk"
                          ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                          : status === "High Load"
                            ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                            : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: statusColor }}>
                  {stability}
                </span>
              </div>
              <span className="text-[9px] text-[color:var(--color-muted-light)] shrink-0">
                L {leftPressure}% · C {centerPressure}% · R {rightPressure}%
              </span>
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
            </div>
          </div>
        </div>
      }
      controls={<></>}
    />
  );
}

function FlatbedScene({
  weight: _weight,
  cog: _cog,
  tiltDeg,
  coilOffsetX,
  leftPressure,
  rightPressure,
  centerPressure,
  status,
  accent: _accent,
  barColor,
}: {
  weight: number;
  cog: number;
  tiltDeg: number;
  coilOffsetX: number;
  leftPressure: number;
  rightPressure: number;
  centerPressure: number;
  status: string;
  accent: string;
  barColor: string;
}) {
  const viewW = 280;
  const viewH = 100;
  const isOverstress = status === "Overstress Risk";
  const leftOver = leftPressure >= 100;
  const rightOver = rightPressure >= 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="h-full w-full max-h-[120px]" aria-hidden>
        <defs>
          <linearGradient id="lba-bed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="lba-coil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Axle pressure bars (under trailer) — bars grow upward */}
        <g transform={`translate(0, ${viewH - 28})`}>
          {[
            { x: 28, pressure: leftPressure, over: leftOver },
            { x: 128, pressure: centerPressure, over: false },
            { x: 228, pressure: rightPressure, over: rightOver },
          ].map(({ x, pressure, over }, i) => {
            const h = Math.max(1, (pressure / 100) * 10);
            const y = 22 - h;
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                <rect x="0" y="12" width="24" height="10" rx="1" fill="rgba(148,163,184,0.25)" />
                <rect
                  x="1"
                  y={y}
                  width="22"
                  height={h}
                  rx="1"
                  fill={over ? "rgb(220,38,38)" : barColor}
                  opacity="0.95"
                  className="transition-all duration-300"
                />
                <text x="12" y="10" textAnchor="middle" fontSize="7" fill="var(--color-muted-light)">
                  {i === 0 ? "L" : i === 1 ? "C" : "R"}
                </text>
              </g>
            );
          })}
        </g>

        {/* Flatbed + load (tilt by CoG, rotate around bed center) */}
        <g transform={`translate(${viewW / 2}, 38)`}>
          <g transform={`translate(-120, -10) rotate(${tiltDeg}, 120, 10)`}>
            <rect x="0" y="0" width="240" height="20" rx="2" fill="url(#lba-bed)" stroke="#94a3b8" strokeWidth="1" />
            <g transform={`translate(${coilOffsetX}, 0)`}>
              <ellipse cx="60" cy="10" rx="22" ry="8" fill="url(#lba-coil)" stroke="#475569" strokeWidth="0.8" />
              <ellipse cx="120" cy="10" rx="28" ry="9" fill="url(#lba-coil)" stroke="#475569" strokeWidth="0.8" />
              <ellipse cx="180" cy="10" rx="22" ry="8" fill="url(#lba-coil)" stroke="#475569" strokeWidth="0.8" />
            </g>
          </g>
        </g>

        {/* Overstress glow under left/right axle when red */}
        {isOverstress && (
          <>
            {leftOver && <ellipse cx="40" cy={viewH - 8} rx="20" ry="4" fill="rgb(220,38,38)" opacity="0.2" />}
            {rightOver && <ellipse cx={viewW - 40} cy={viewH - 8} rx="20" ry="4" fill="rgb(220,38,38)" opacity="0.2" />}
          </>
        )}
      </svg>
    </div>
  );
}
