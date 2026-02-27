"use client";

import * as React from "react";
import { IconShield } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Protection = "open" | "covered" | "enclosed";
type Cargo = "vehicles" | "parts";

const PROTECTION_FACTOR: Record<Protection, number> = {
  open: 1.0,
  covered: 0.72,
  enclosed: 0.45,
};

function computeRisks(
  conditions: number,
  protection: Protection,
  cargo: Cargo
): [number, number, number] {
  const pf = PROTECTION_FACTOR[protection];
  const c = conditions; // 0–100
  if (cargo === "vehicles") {
    return [c * 0.55 * pf, c * 0.7 * pf, c * 0.35 * pf];
  }
  return [c * 0.75 * pf, c * 0.6 * pf, c * 0.45 * pf];
}

function protectionScore(risks: [number, number, number]): number {
  const avgRisk = (risks[0] + risks[1] + risks[2]) / 3;
  return Math.round(Math.max(0, Math.min(100, 100 - avgRisk)));
}

function statusFromScore(score: number): "Protected" | "Caution" | "High Risk" {
  if (score >= 80) return "Protected";
  if (score >= 55) return "Caution";
  return "High Risk";
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

const VEHICLE_RISK_LABELS = ["Weather", "Road debris", "Handling"] as const;
const PARTS_RISK_LABELS = ["Shock", "Moisture", "Stack stability"] as const;

export function TransportProtectionWidget({ accentColor }: { accentColor?: string }) {
  const [conditions, setConditions] = React.useState(35);
  const [protection, setProtection] = React.useState<Protection>("covered");
  const [cargo, setCargo] = React.useState<Cargo>("vehicles");
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const risks = React.useMemo(
    () => computeRisks(conditions, protection, cargo),
    [conditions, protection, cargo]
  );
  const score = protectionScore(risks);
  const status = statusFromScore(score);

  const jigglePx = reduceMotion ? 0 : Math.min(2, (conditions / 100) * 2);
  const roadRoughness = conditions / 100;
  const dustOpacity = cargo === "vehicles" ? roadRoughness * (1 - PROTECTION_FACTOR[protection]) * 0.6 : 0;
  const rainOpacity = cargo === "vehicles" && conditions > 40 ? roadRoughness * 0.4 * (1 - PROTECTION_FACTOR[protection] * 0.7) : 0;
  const chipOpacity = cargo === "vehicles" ? roadRoughness * 0.5 * (1 - PROTECTION_FACTOR[protection] * 0.5) : 0;
  const shakeAmount = cargo === "parts" ? roadRoughness * 1.5 : 0;
  const moistureOpacity = cargo === "parts" ? (risks[1] / 100) * 0.8 : 0;
  const tiltDeg = cargo === "parts" ? (risks[2] / 100) * 8 : 0;

  const statusColor =
    status === "Protected" ? accent : status === "Caution" ? "var(--color-amber-600)" : "rgb(220,38,38)";

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconShield />}
      title="Transport protection simulator"
      accentColor={accentColor}
      howToUse="Slide drive conditions, pick protection level, and switch cargo type. The scene and protection score update to show risk."
      aria-labelledby="transport-protection-title"
      didYouKnow="Open = exposed; enclosed = best. Rough conditions raise risk."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Drive conditions
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${conditions}%`, backgroundColor: accent }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={conditions}
                  onChange={(e) => setConditions(Number(e.target.value))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={conditions}
                  aria-label="Drive conditions from smooth to rough"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
                <span>Smooth</span>
                <span>Rough</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                  Protection level
                </span>
                <PillToggle
                  value={protection}
                  options={[
                    { id: "open", label: "Open" },
                    { id: "covered", label: "Covered" },
                    { id: "enclosed", label: "Enclosed" },
                  ]}
                  onChange={setProtection}
                  accentColor={accentColor}
                  aria-label="Protection level"
                />
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                  Cargo type
                </span>
                <PillToggle
                  value={cargo}
                  options={[
                    { id: "vehicles", label: "Finished vehicles" },
                    { id: "parts", label: "Parts" },
                  ]}
                  onChange={setCargo}
                  accentColor={accentColor}
                  aria-label="Cargo type"
                />
              </div>
            </div>
          </div>

          {/* Right: simulator */}
          <div className="flex flex-col gap-2.5 min-h-0">
            <div
              className="relative flex-1 min-h-[100px] max-h-[120px] overflow-hidden rounded-xl shadow-inner"
              style={{
                background: "linear-gradient(180deg, rgba(241,245,249,0.98) 0%, rgba(226,232,240,0.95) 100%)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(15,23,42,0.06)",
              }}
            >
              {cargo === "vehicles" ? (
                <FinishedVehiclesScene
                  jigglePx={jigglePx}
                  roadRoughness={roadRoughness}
                  dustOpacity={dustOpacity}
                  rainOpacity={rainOpacity}
                  chipOpacity={chipOpacity}
                  accent={accent}
                />
              ) : (
                <PartsScene
                  shakeAmount={shakeAmount}
                  moistureOpacity={moistureOpacity}
                  tiltDeg={tiltDeg}
                  risks={risks}
                />
              )}
            </div>

            {/* Protection score + status + pills in compact row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm" style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Score
                </span>
                <div className="h-2 min-w-[72px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${score}%`,
                      background: status === "High Risk"
                        ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                        : status === "Caution"
                          ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                          : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: statusColor }}>
                  {score}
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
              <div className="flex flex-wrap gap-1.5">
              {(cargo === "vehicles" ? VEHICLE_RISK_LABELS : PARTS_RISK_LABELS).map((label, i) => {
                const r = risks[i]; // 0–100 scale
                const active = r > 35;
                const high = r > 60;
                return (
                  <span
                    key={label}
                    className="rounded-md border px-1.5 py-0.5 text-[9px] font-medium transition-all duration-200"
                    style={{
                      backgroundColor: high ? "rgba(220,38,38,0.08)" : active ? "rgba(245,158,11,0.1)" : "rgba(148,163,184,0.08)",
                      borderColor: high ? "rgba(220,38,38,0.25)" : active ? "rgba(245,158,11,0.3)" : "rgba(148,163,184,0.2)",
                      color: high ? "rgb(185,28,28)" : active ? "rgb(161,98,7)" : "var(--color-muted-light)",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      }
      controls={<></>}
    />
  );
}

function FinishedVehiclesScene({
  jigglePx,
  roadRoughness,
  dustOpacity,
  rainOpacity,
  chipOpacity,
  accent: _accent,
}: {
  jigglePx: number;
  roadRoughness: number;
  dustOpacity: number;
  rainOpacity: number;
  chipOpacity: number;
  accent: string;
}) {
  return (
    <div className="absolute inset-0">
      {/* Sky-to-road gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(226,232,240,0.85) 45%, rgba(203,213,225,0.9) 70%, rgba(148,163,184,0.95) 100%)",
        }}
        aria-hidden
      />
      {/* Road band (darker strip) */}
      <div
        className="absolute left-0 right-0 bottom-0 h-14"
        style={{
          background: "linear-gradient(180deg, rgba(148,163,184,0.4) 0%, rgba(100,116,139,0.5) 100%)",
          boxShadow: "0 -2px 8px rgba(15,23,42,0.06)",
        }}
        aria-hidden
      />
      {/* Road stripes (denser with roughness) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 opacity-40"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0, transparent ${Math.max(6, 14 - roadRoughness * 8)}px, rgba(255,255,255,0.5) ${Math.max(6, 14 - roadRoughness * 8)}px, rgba(255,255,255,0.5) ${Math.max(8, 16 - roadRoughness * 8)}px)`,
        }}
        aria-hidden
      />
      {/* Car on carrier — refined SVG with depth */}
      <div
        className="absolute bottom-8 left-1/2 transition-transform duration-150"
        style={{ transform: `translate(-50%, 0) translateY(${jigglePx}px)` }}
      >
        <svg
          className="h-20 w-28 shrink-0 drop-shadow-md"
          viewBox="0 0 112 72"
          fill="none"
          stroke="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="tp-trailer" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="tp-car" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="tp-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>
          {/* Trailer bed */}
          <path d="M8 48h96v10H8z" fill="url(#tp-trailer)" stroke="#64748b" strokeWidth="1.2" />
          <path d="M12 28h88v20H12z" fill="url(#tp-trailer)" stroke="#64748b" strokeWidth="1.2" />
          {/* Car body */}
          <path d="M22 32h68v14H22z" fill="url(#tp-car)" stroke="#64748b" strokeWidth="1.2" filter="url(#tp-shadow)" />
          <path d="M28 36h56v6H28z" fill="rgba(255,255,255,0.9)" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Wheels */}
          <circle cx="28" cy="58" r="7" fill="#475569" stroke="#334155" strokeWidth="1.2" />
          <circle cx="28" cy="58" r="3" fill="#64748b" />
          <circle cx="84" cy="58" r="7" fill="#475569" stroke="#334155" strokeWidth="1.2" />
          <circle cx="84" cy="58" r="3" fill="#64748b" />
        </svg>
      </div>
      {/* Dust */}
      {dustOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 25% 65%, rgba(180,160,120,0.35) 0%, transparent 50%),
                          radial-gradient(ellipse 50% 30% at 75% 70%, rgba(180,160,120,0.3) 0%, transparent 45%)`,
            opacity: dustOpacity,
          }}
          aria-hidden
        />
      )}
      {/* Rain */}
      {rainOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `repeating-linear-gradient(93deg, transparent 0, transparent 6px, rgba(148,163,184,0.2) 6px, rgba(148,163,184,0.2) 7px)`,
            opacity: rainOpacity,
          }}
          aria-hidden
        />
      )}
      {/* Chip indicator */}
      {chipOpacity > 0 && (
        <div className="pointer-events-none absolute left-[42%] top-[38%] flex gap-0.5" style={{ opacity: chipOpacity }} aria-hidden>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="h-0.5 w-0.5 rounded-full bg-slate-500" />
          <span className="h-1 w-1 rounded-full bg-slate-600" />
        </div>
      )}
    </div>
  );
}

function PartsScene({
  shakeAmount,
  moistureOpacity,
  tiltDeg,
  risks,
}: {
  shakeAmount: number;
  moistureOpacity: number;
  tiltDeg: number;
  risks: [number, number, number];
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      {/* Floor shadow */}
      <div
        className="absolute bottom-8 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse 80% 50%, rgba(15,23,42,0.4), transparent)", filter: "blur(4px)" }}
        aria-hidden
      />
      {/* Stack of crates with tilt and gradient */}
      <div
        className="transition-transform duration-200 drop-shadow-md"
        style={{
          transform: `rotate(${tiltDeg}deg) translateX(${shakeAmount}px)`,
        }}
      >
        <svg className="h-24 w-28" viewBox="0 0 112 88" fill="none" stroke="none" aria-hidden>
          <defs>
            <linearGradient id="tp-crate-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="tp-crate-light" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <rect x="10" y="36" width="32" height="28" fill="url(#tp-crate-dark)" stroke="#94a3b8" strokeWidth="1.2" rx="1" />
          <rect x="14" y="40" width="24" height="20" fill="url(#tp-crate-light)" stroke="#cbd5e1" strokeWidth="0.8" rx="0.5" />
          <rect x="44" y="28" width="32" height="28" fill="url(#tp-crate-dark)" stroke="#94a3b8" strokeWidth="1.2" rx="1" />
          <rect x="48" y="32" width="24" height="20" fill="url(#tp-crate-light)" stroke="#cbd5e1" strokeWidth="0.8" rx="0.5" />
          <rect x="78" y="44" width="20" height="20" fill="url(#tp-crate-dark)" stroke="#94a3b8" strokeWidth="1.2" rx="1" />
          <rect x="81" y="47" width="14" height="14" fill="url(#tp-crate-light)" stroke="#cbd5e1" strokeWidth="0.8" rx="0.5" />
        </svg>
      </div>
      {/* Shake lines (when shock risk high) */}
      {risks[0] > 40 && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: Math.min(0.7, risks[0] / 100) }}
          aria-hidden
        >
          <svg className="absolute h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M15 50 Q 35 47 55 50 Q 75 53 85 50" stroke="rgba(100,116,139,0.12)" strokeWidth="1.5" fill="none" />
            <path d="M20 55 Q 40 52 60 55 Q 80 52 90 55" stroke="rgba(100,116,139,0.08)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )}
      {/* Moisture droplets */}
      {moistureOpacity > 0 && (
        <div
          className="pointer-events-none absolute right-6 top-6 flex gap-1.5"
          style={{ opacity: moistureOpacity }}
          aria-hidden
        >
          <span className="h-2 w-2 rounded-full bg-slate-500/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500/70" />
          <span className="h-2 w-2 rounded-full bg-slate-500/80" />
        </div>
      )}
    </div>
  );
}
