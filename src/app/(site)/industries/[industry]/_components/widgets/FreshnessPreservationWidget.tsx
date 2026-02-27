"use client";

import * as React from "react";
import { IconThermometer } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Product = "dairy" | "frozen" | "produce" | "beverages";

const PRODUCT_RANGES: Record<Product, { min: number; max: number; label: string }> = {
  dairy: { min: 1, max: 4, label: "Dairy" },
  frozen: { min: -20, max: -12, label: "Frozen" },
  produce: { min: 2, max: 8, label: "Fresh Produce" },
  beverages: { min: 4, max: 12, label: "Beverages" },
};

const TEMP_MIN = -25;
const TEMP_MAX = 15;
const DAYS_MIN = 1;
const DAYS_MAX = 14;
const BASE_DECAY_PER_DAY = 2;
const DEVIATION_FACTOR = 1.5;

function getDeviation(temp: number, min: number, max: number): number {
  if (temp >= min && temp <= max) return 0;
  if (temp < min) return min - temp;
  return temp - max;
}

function computeFreshness(temp: number, days: number, product: Product): number {
  const { min, max } = PRODUCT_RANGES[product];
  const deviation = getDeviation(temp, min, max);
  const decayRate = BASE_DECAY_PER_DAY + deviation * DEVIATION_FACTOR;
  return Math.max(0, Math.min(100, 100 - decayRate * days));
}

function getStatus(
  freshness: number,
  _inRange: boolean
): "Preserved" | "Monitor" | "Spoilage Risk" {
  if (freshness >= 85) return "Preserved";
  if (freshness >= 60) return "Monitor";
  return "Spoilage Risk";
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

export function FreshnessPreservationWidget({ accentColor }: { accentColor?: string }) {
  const [temp, setTemp] = React.useState(2);
  const [days, setDays] = React.useState(4);
  const [product, setProduct] = React.useState<Product>("dairy");
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const range = PRODUCT_RANGES[product];
  const inRange = temp >= range.min && temp <= range.max;
  const freshness = React.useMemo(
    () => Math.round(computeFreshness(temp, days, product)),
    [temp, days, product]
  );
  const status = getStatus(freshness, inRange);
  const isPreserved = status === "Preserved";
  const isSpoilage = status === "Spoilage Risk";

  const statusColor =
    status === "Preserved"
      ? accent
      : status === "Monitor"
        ? "var(--color-amber-600)"
        : "rgb(220,38,38)";

  const safeLeft = (range.min - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
  const safeWidth = (range.max - range.min) / (TEMP_MAX - TEMP_MIN);

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconThermometer />}
      title="Freshness Preservation Simulator"
      accentColor={accentColor}
      howToUse="Adjust temperature and transit time. Watch freshness respond. Keep temp in the safe band to flatten decay."
      aria-labelledby="freshness-preservation-title"
      didYouKnow="In-range temp = slow decay. Outside band = decay accelerates. Time multiplies the effect."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Storage temperature
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full opacity-25 transition-all duration-200 pointer-events-none"
                  style={{
                    left: `${safeLeft * 100}%`,
                    width: `${safeWidth * 100}%`,
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={TEMP_MIN}
                  max={TEMP_MAX}
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  aria-valuemin={TEMP_MIN}
                  aria-valuemax={TEMP_MAX}
                  aria-valuenow={temp}
                  aria-label="Temperature in degrees Celsius"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-[color:var(--color-muted-light)]">
                <span>-25°C</span>
                <span className="tabular-nums">{temp}°C</span>
                <span>+15°C</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Transit duration
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200 opacity-80"
                  style={{
                    width: `${((days - DAYS_MIN) / (DAYS_MAX - DAYS_MIN)) * 100}%`,
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={DAYS_MIN}
                  max={DAYS_MAX}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  aria-label="Transit duration in days"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <p className="mt-0.5 text-[9px] text-[color:var(--color-muted-light)]">
                {days} day{days !== 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Product type
              </span>
              <PillToggle
                value={product}
                options={[
                  { id: "dairy", label: "Dairy" },
                  { id: "frozen", label: "Frozen" },
                  { id: "produce", label: "Fresh Produce" },
                  { id: "beverages", label: "Beverages" },
                ]}
                onChange={setProduct}
                accentColor={accentColor}
                aria-label="Product type"
              />
              <p className="mt-1 text-[9px] text-[color:var(--color-muted-light)]">
                Safe band: {range.min} to {range.max}°C
              </p>
            </div>
          </div>

          {/* Right: decay curve + product icon + output */}
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
              <FreshnessScene
                temp={temp}
                days={days}
                product={product}
                freshness={freshness}
                inRange={inRange}
                isPreserved={isPreserved}
                isSpoilage={isSpoilage}
                reduceMotion={reduceMotion}
                accent={accent}
              />
            </div>

            {/* Freshness + status + optional Cold Chain Stable */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm"
              style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Freshness
                </span>
                <div className="h-2 min-w-[60px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${freshness}%`,
                      background:
                        status === "Spoilage Risk"
                          ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                          : status === "Monitor"
                            ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                            : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tabular-nums shrink-0"
                  style={{ color: statusColor }}
                >
                  {freshness}%
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
              {inRange && (
                <span
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-medium shrink-0"
                  style={{
                    backgroundColor: `${accent}12`,
                    borderColor: `${accent}35`,
                    color: accent,
                  }}
                >
                  Cold chain stable
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

function FreshnessScene({
  temp: _temp,
  days,
  product,
  freshness,
  inRange,
  isPreserved: _isPreserved,
  isSpoilage,
  reduceMotion: _reduceMotion,
  accent,
}: {
  temp: number;
  days: number;
  product: Product;
  freshness: number;
  inRange: boolean;
  isPreserved: boolean;
  isSpoilage: boolean;
  reduceMotion: boolean;
  accent: string;
}) {
  const viewW = 280;
  const viewH = 100;
  const pad = { l: 36, r: 12, t: 10, b: 24 };
  const graphW = viewW - pad.l - pad.r;
  const graphH = viewH - pad.t - pad.b;

  // Decay curve: line from (0, 100) to (days, freshness). X scale: 0..days -> pad.l .. pad.l+graphW. Y scale: 0..100 -> bottom..top (inverted).
  const endX = pad.l + (days / DAYS_MAX) * graphW;
  const endY = pad.t + graphH * (1 - freshness / 100);

  const curveColor =
    freshness >= 85
      ? accent
      : freshness >= 60
        ? "var(--color-amber-600)"
        : "rgb(220,38,38)";

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="h-full w-full max-h-[120px]" aria-hidden>
        <defs>
          <linearGradient id="fp-curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={curveColor} stopOpacity="0.95" />
          </linearGradient>
          <filter id="fp-desat" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="saturate" values="0.4" />
          </filter>
        </defs>

        {/* Subtle grid */}
        <g stroke="rgba(148,163,184,0.2)" strokeWidth="0.5">
          {[0.25, 0.5, 0.75].map((q) => (
            <line
              key={q}
              x1={pad.l}
              y1={pad.t + graphH * (1 - q)}
              x2={viewW - pad.r}
              y2={pad.t + graphH * (1 - q)}
            />
          ))}
          {[0.33, 0.66].map((q) => (
            <line
              key={q}
              x1={pad.l + graphW * q}
              y1={pad.t + graphH}
              x2={pad.l + graphW * q}
              y2={pad.t}
            />
          ))}
        </g>

        {/* Safe zone fill (when in range, subtle) */}
        {inRange && (
          <rect
            x={pad.l}
            y={pad.t}
            width={graphW}
            height={graphH}
            fill={accent}
            opacity="0.06"
            rx="2"
          />
        )}

        {/* Decay curve: line from start to end */}
        <path
          d={`M ${pad.l} ${pad.t + graphH} L ${endX} ${endY}`}
          fill="none"
          stroke="url(#fp-curve-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={endX}
          cy={endY}
          r="4"
          fill={curveColor}
          stroke="white"
          strokeWidth="1.2"
        />

        {/* Axis labels */}
        <text
          x={pad.l - 4}
          y={pad.t + 4}
          textAnchor="end"
          fontSize="8"
          fill="var(--color-muted-light)"
        >
          100%
        </text>
        <text
          x={pad.l - 4}
          y={pad.t + graphH + 4}
          textAnchor="end"
          fontSize="8"
          fill="var(--color-muted-light)"
        >
          0%
        </text>
        <text
          x={pad.l}
          y={viewH - 4}
          textAnchor="start"
          fontSize="8"
          fill="var(--color-muted-light)"
        >
          Time (days)
        </text>

        {/* Product icon (left) */}
        <g transform={`translate(8, ${viewH / 2 - 14})`} filter={isSpoilage ? "url(#fp-desat)" : undefined}>
          <ProductIcon product={product} desaturate={isSpoilage} accent={accent} />
        </g>
      </svg>
    </div>
  );
}

function ProductIcon({
  product,
  desaturate,
  accent,
}: {
  product: Product;
  desaturate: boolean;
  accent: string;
}) {
  const size = 28;
  const fill = desaturate ? "#94a3b8" : accent;
  const stroke = "#64748b";
  switch (product) {
    case "dairy":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" aria-hidden>
          <path d="M6 4h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4z" fill={fill} opacity="0.9" />
          <path d="M8 8h8v2H8z" fill="white" opacity="0.8" />
        </svg>
      );
    case "frozen":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" aria-hidden>
          <path d="M12 2v6l4 2-4 2v6" stroke={fill} fill="none" />
          <path d="M8 8l4 4-4 4" stroke={fill} fill="none" />
          <path d="M16 8l-4 4 4 4" stroke={fill} fill="none" />
        </svg>
      );
    case "produce":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" aria-hidden>
          <path d="M12 4c-2 4-4 8-4 12a4 4 0 0 0 8 0c0-4-2-8-4-12z" fill={fill} opacity="0.9" />
          <path d="M8 10h8M9 14h6" stroke="white" strokeWidth="0.8" opacity="0.7" />
        </svg>
      );
    case "beverages":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.2" aria-hidden>
          <path d="M8 2h8l1 8a4 4 0 0 1-8 0L8 2z" fill={fill} opacity="0.9" />
          <path d="M9 4h6v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4z" fill="white" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}
