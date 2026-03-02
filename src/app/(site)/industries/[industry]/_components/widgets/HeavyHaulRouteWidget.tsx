"use client";

import * as React from "react";
import { IconRoute } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type LoadType = "heavy" | "oversized" | "hazardous";

const LOAD_FACTOR: Record<LoadType, number> = {
  heavy: 1.0,
  oversized: 1.4,
  hazardous: 1.8,
};

const COMPLEXITY_MIN = 0;
const COMPLEXITY_MAX = 100;
const DISTANCE_MIN = 100;
const DISTANCE_MAX = 1500;

function getStatus(complianceLoad: number): "Standard Transport" | "Enhanced Control" | "Special Handling Required" {
  if (complianceLoad < 50) return "Standard Transport";
  if (complianceLoad < 90) return "Enhanced Control";
  return "Special Handling Required";
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

export function HeavyHaulRouteWidget({ accentColor }: { accentColor?: string }) {
  const [complexity, setComplexity] = React.useState(35);
  const [loadType, setLoadType] = React.useState<LoadType>("heavy");
  const [distance, setDistance] = React.useState(500);
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const loadFactor = LOAD_FACTOR[loadType];
  const complianceLoad = Math.min(100, Math.round(complexity * loadFactor));
  const permits = Math.ceil(complianceLoad / 25);
  const escortRequired = loadType !== "heavy" && complexity > 40;
  const status = getStatus(complianceLoad);
  const isSpecialHandling = status === "Special Handling Required";

  const statusColor =
    status === "Standard Transport"
      ? accent
      : status === "Enhanced Control"
        ? "var(--color-amber-600)"
        : "rgb(220,38,38)";

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconRoute />}
      title="Heavy-Haul Route Control Model"
      accentColor={accentColor}
      howToUse="Adjust route complexity and load class to evaluate compliance load, permit needs, and escort posture."
      aria-labelledby="heavy-haul-route-title"
      didYouKnow="Oversized and hazardous loads increase control requirements; route complexity raises checkpoint density."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Route complexity
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${complexity}%`, backgroundColor: accent }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={COMPLEXITY_MIN}
                  max={COMPLEXITY_MAX}
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  aria-valuemin={COMPLEXITY_MIN}
                  aria-valuemax={COMPLEXITY_MAX}
                  aria-valuenow={complexity}
                  aria-label="Route complexity from flat highway to mountain passes"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
                <span>Flat highway</span>
                <span>Urban</span>
                <span>Mountain</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Load type
              </span>
              <PillToggle
                value={loadType}
                options={[
                  { id: "heavy", label: "Heavy" },
                  { id: "oversized", label: "Oversized" },
                  { id: "hazardous", label: "Hazardous" },
                ]}
                onChange={setLoadType}
                accentColor={accentColor}
                aria-label="Heavy, oversized, or hazardous"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Distance
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200 opacity-70"
                  style={{
                    width: `${((distance - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)) * 100}%`,
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={DISTANCE_MIN}
                  max={DISTANCE_MAX}
                  step={50}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  aria-label="Distance in km"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-300 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <p className="mt-0.5 text-[9px] text-[color:var(--color-muted-light)]">
                {distance} km
              </p>
            </div>
          </div>

          {/* Right: route scene + output */}
          <div className="flex flex-col gap-2.5 min-h-0">
            <div
              className="relative flex-1 min-h-[100px] max-h-[140px] overflow-hidden rounded-xl shadow-inner"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(226,232,240,0.95) 100%)",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(15,23,42,0.06)",
              }}
            >
              <RouteScene
                complexity={complexity}
                loadType={loadType}
                escortRequired={escortRequired}
                isSpecialHandling={isSpecialHandling}
                reduceMotion={reduceMotion}
                accent={accent}
              />
            </div>

            {/* Compliance + Permits + Escort + Status */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm"
              style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Compliance
                </span>
                <div className="h-2 min-w-[50px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${complianceLoad}%`,
                      background:
                        status === "Special Handling Required"
                          ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                          : status === "Enhanced Control"
                            ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                            : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: statusColor }}>
                  {complianceLoad}
                </span>
              </div>
              <span className="text-[10px] text-[color:var(--color-muted-light)] shrink-0">
                Permits: {permits}
              </span>
              <span className="text-[10px] font-medium shrink-0" style={{ color: escortRequired ? "var(--color-amber-600)" : "var(--color-muted-light)" }}>
                Escort: {escortRequired ? "Yes" : "No"}
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

function RouteScene({
  complexity,
  loadType,
  escortRequired,
  isSpecialHandling,
  reduceMotion,
  accent,
}: {
  complexity: number;
  loadType: LoadType;
  escortRequired: boolean;
  isSpecialHandling: boolean;
  reduceMotion: boolean;
  accent: string;
}) {
  const viewW = 300;
  const viewH = 100;
  const pathY = viewH / 2;
  const checkpointCount = Math.min(6, Math.max(0, Math.floor((complexity / 100) * 5) + (loadType === "hazardous" ? 2 : 0)));
  const showBridge = complexity > 35;
  const showSpeedRestriction = complexity > 55 && loadType !== "heavy";

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="h-full w-full max-h-[120px]" aria-hidden>
        <defs>
          <filter id="hhr-risk-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feFlood floodColor="rgb(220,38,38)" floodOpacity="0.25" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Risk glow when special handling */}
        {isSpecialHandling && !reduceMotion && (
          <rect x="0" y="0" width={viewW} height={viewH} fill="none" filter="url(#hhr-risk-glow)" />
        )}

        {/* Route path: start to destination with slight curve */}
        <path
          d={`M 24 ${pathY} Q ${viewW / 2} ${pathY - 12} ${viewW - 24} ${pathY}`}
          fill="none"
          stroke="rgb(148,163,184)"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Start / End labels */}
        <g>
          <circle cx="24" cy={pathY} r="6" fill={accent} stroke="white" strokeWidth="1.5" />
          <text x="24" y={pathY + 22} textAnchor="middle" fontSize="8" fill="var(--color-muted-light)">Start</text>
        </g>
        <g>
          <circle cx={viewW - 24} cy={pathY} r="6" fill={accent} stroke="white" strokeWidth="1.5" />
          <text x={viewW - 24} y={pathY + 22} textAnchor="middle" fontSize="8" fill="var(--color-muted-light)">End</text>
        </g>

        {/* Checkpoints along path (on curve: quadratic Bezier) */}
        {Array.from({ length: checkpointCount }).map((_, i) => {
          const t = (i + 1) / (checkpointCount + 1);
          const x = 24 + (viewW - 48) * t + (complexity / 100) * 3 * Math.sin(i * 0.8);
          const y = pathY - 24 * t * (1 - t); // on curve
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={accent} stroke="white" strokeWidth="1.2" />
              {loadType === "hazardous" && i % 2 === 0 && (
                <circle cx={x} cy={y} r="1.5" fill="rgb(220,38,38)" />
              )}
            </g>
          );
        })}

        {/* Bridge / weight limit icon when moderate+ */}
        {showBridge && (
          <g transform={`translate(${viewW * 0.45}, ${pathY - 20})`}>
            <path d="M0 8 L8 0 L16 8 L12 8 L12 14 L4 14 L4 8 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8" />
            <text x="8" y="12" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">W</text>
          </g>
        )}

        {/* Speed restriction when relevant */}
        {showSpeedRestriction && (
          <g transform={`translate(${viewW * 0.62}, ${pathY + 14})`}>
            <circle cx="0" cy="0" r="8" fill="var(--color-amber-500)" opacity="0.9" />
            <text x="0" y="3" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">40</text>
          </g>
        )}

        {/* Hazard placard when hazardous */}
        {loadType === "hazardous" && (
          <g transform={`translate(${viewW * 0.28}, ${pathY - 22})`}>
            <rect x="-10" y="-8" width="20" height="16" rx="2" fill="rgb(220,38,38)" stroke="#b91c1c" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">!</text>
          </g>
        )}

        {/* Main truck (center) */}
        <g transform={`translate(${viewW / 2 - 18}, ${pathY - 10})`}>
          <rect x="0" y="4" width="28" height="12" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="4" y="0" width="10" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.6" />
          <circle cx="8" cy="18" r="3" fill="#64748b" />
          <circle cx="24" cy="18" r="3" fill="#64748b" />
        </g>

        {/* Escort vehicles */}
        {escortRequired && (
          <>
            <g transform={`translate(${viewW / 2 - 50}, ${pathY - 28})`}>
              <rect x="0" y="0" width="14" height="8" rx="0.5" fill="var(--color-amber-500)" opacity="0.9" stroke="#b45309" strokeWidth="0.6" />
              <circle cx="4" cy="12" r="2" fill="#475569" />
              <circle cx="10" cy="12" r="2" fill="#475569" />
            </g>
            <g transform={`translate(${viewW / 2 + 36}, ${pathY - 28})`}>
              <rect x="0" y="0" width="14" height="8" rx="0.5" fill="var(--color-amber-500)" opacity="0.9" stroke="#b45309" strokeWidth="0.6" />
              <circle cx="4" cy="12" r="2" fill="#475569" />
              <circle cx="10" cy="12" r="2" fill="#475569" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
