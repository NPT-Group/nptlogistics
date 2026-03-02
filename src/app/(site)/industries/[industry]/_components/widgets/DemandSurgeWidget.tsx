"use client";

import * as React from "react";
import { IconPulse } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Channel = "store" | "ecom" | "hybrid";

const CHANNEL_FACTOR: Record<Channel, number> = {
  store: 0.8,
  ecom: 1.2,
  hybrid: 1.0,
};

const NODES_MIN = 2;
const NODES_MAX = 8;

function computeMetrics(
  demand: number,
  channel: Channel,
  nodes: number
): { systemLoad: number; fulfillment: number; queue: number } {
  const channelFactor = CHANNEL_FACTOR[channel];
  const systemLoad = (demand / 100) * channelFactor * 100 / (nodes * 0.9);
  const fulfillment = Math.round(Math.max(0, Math.min(100, 100 - systemLoad)));
  const queue = Math.round(Math.max(0, Math.min(100, systemLoad - 40)));
  return { systemLoad, fulfillment, queue };
}

function getStatus(
  fulfillment: number
): "Stable" | "High Load" | "Surge Mode Activated" {
  if (fulfillment > 85) return "Stable";
  if (fulfillment >= 60) return "High Load";
  return "Surge Mode Activated";
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

export function DemandSurgeWidget({ accentColor }: { accentColor?: string }) {
  const [demand, setDemand] = React.useState(35);
  const [channel, setChannel] = React.useState<Channel>("hybrid");
  const [nodes, setNodes] = React.useState(4);
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const { systemLoad, fulfillment, queue } = React.useMemo(
    () => computeMetrics(demand, channel, nodes),
    [demand, channel, nodes]
  );
  const status = getStatus(fulfillment);
  const isSurge = status === "Surge Mode Activated";
  const isStable = status === "Stable";

  const statusColor =
    status === "Stable"
      ? accent
      : status === "High Load"
        ? "var(--color-amber-600)"
        : "rgb(220,38,38)";

  return (
    <WidgetCard
      fillHeight
      className="h-full shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
      icon={<IconPulse />}
      title="Demand Surge Model"
      accentColor={accentColor}
      howToUse="Adjust demand, channel mix, and node count to evaluate system load, queue pressure, and fulfillment posture."
      aria-labelledby="demand-surge-title"
      didYouKnow="Additional nodes distribute load; higher e-commerce mix increases velocity and peak sensitivity."
      visual={
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[1fr,1.4fr]">
          {/* Left: controls */}
          <div className="space-y-3 min-w-0">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Demand intensity
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${demand}%`, backgroundColor: accent }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={demand}
                  aria-label="Demand from normal to Black Friday"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <div className="mt-1 flex justify-between gap-2 text-[9px] text-[color:var(--color-muted-light)]">
                <span>Normal</span>
                <span className="flex-1 text-center">Seasonal</span>
                <span>Black Friday</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Channel mix
              </span>
              <PillToggle
                value={channel}
                options={[
                  { id: "store", label: "Store" },
                  { id: "ecom", label: "E-commerce" },
                  { id: "hybrid", label: "Hybrid" },
                ]}
                onChange={setChannel}
                accentColor={accentColor}
                aria-label="Store, e-commerce, or hybrid"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)]">
                Distribution nodes
              </label>
              <div className="relative">
                <div className="h-2 w-full rounded-full bg-slate-200/90" aria-hidden />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-200 opacity-70"
                  style={{
                    width: `${((nodes - NODES_MIN) / (NODES_MAX - NODES_MIN)) * 100}%`,
                    backgroundColor: accent,
                  }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={NODES_MIN}
                  max={NODES_MAX}
                  value={nodes}
                  onChange={(e) => setNodes(Number(e.target.value))}
                  aria-valuemin={NODES_MIN}
                  aria-valuemax={NODES_MAX}
                  aria-valuenow={nodes}
                  aria-label="Number of warehouses"
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white"
                  style={{ accentColor: accent } as React.CSSProperties}
                />
              </div>
              <p className="mt-0.5 text-[9px] text-[color:var(--color-muted-light)]">
                {nodes} warehouse{nodes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Right: flow scene + output */}
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
              <FlowScene
                demand={demand}
                systemLoad={systemLoad}
                queue={queue}
                nodes={nodes}
                isStable={isStable}
                isSurge={isSurge}
                reduceMotion={reduceMotion}
                accent={accent}
              />
            </div>

            {/* Fulfillment + Queue + Status */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-sm"
              style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-light)] shrink-0">
                  Fulfillment
                </span>
                <div className="h-2 min-w-[60px] flex-1 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${fulfillment}%`,
                      background:
                        status === "Surge Mode Activated"
                          ? "linear-gradient(90deg, rgb(185,28,28), rgb(220,38,38))"
                          : status === "High Load"
                            ? "linear-gradient(90deg, rgb(180,83,9), rgb(245,158,11))"
                            : `linear-gradient(90deg, ${accent}, ${accent}dd)`,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tabular-nums shrink-0"
                  style={{ color: statusColor }}
                >
                  {fulfillment}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-medium text-[color:var(--color-muted-light)]">
                  Queue
                </span>
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-200/90">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${queue}%`,
                      backgroundColor:
                        queue > 60 ? "rgb(220,38,38)" : queue > 30 ? "rgb(245,158,11)" : "rgb(148,163,184)",
                    }}
                  />
                </div>
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
            </div>
          </div>
        </div>
      }
      controls={<></>}
    />
  );
}

function FlowScene({
  demand,
  systemLoad,
  queue,
  nodes,
  isStable,
  isSurge,
  reduceMotion,
  accent,
}: {
  demand: number;
  systemLoad: number;
  queue: number;
  nodes: number;
  isStable: boolean;
  isSurge: boolean;
  reduceMotion: boolean;
  accent: string;
}) {
  const flowSpeed = 2 + (demand / 100) * 4; // 2s to 6s duration
  const viewW = 320;
  const viewH = 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-2">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="h-full w-full max-h-[120px]" aria-hidden>
        <defs>
          <linearGradient id="ds-warehouse" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          {isSurge && !reduceMotion && (
            <filter id="ds-surge-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feFlood floodColor="rgb(220,38,38)" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
          {isStable && !reduceMotion && (
            <filter id="ds-stable-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feFlood floodColor={accent} floodOpacity="0.25" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Order stream (left): flowing dots — SMIL drives cx so React doesn't overwrite */}
        <g className="overflow-visible">
          {[0, 1, 2, 3, 4].map((i) => {
            const cy = viewH / 2 - 10 + (i % 3) * 10;
            const staticCx = 40 + i * 55;
            return (
              <circle
                key={i}
                {...(reduceMotion ? { cx: staticCx } : {})}
                cy={cy}
                r="3"
                fill={accent}
                opacity={0.5 + (demand / 100) * 0.4}
              >
                {!reduceMotion && (
                  <animate
                    attributeName="cx"
                    from="-10"
                    to={viewW + 10}
                    dur={`${flowSpeed}s`}
                    repeatCount="indefinite"
                    begin={`${i * (flowSpeed / 5)}s`}
                  />
                )}
              </circle>
            );
          })}
        </g>

        {/* Warehouse blocks (middle) */}
        <g
          transform={`translate(${viewW * 0.28}, ${viewH / 2 - 20})`}
          filter={isSurge ? "url(#ds-surge-glow)" : isStable ? "url(#ds-stable-glow)" : undefined}
        >
          {Array.from({ length: Math.min(nodes, 6) }).map((_, i) => {
            const n = Math.min(nodes, 6);
            const bw = 24;
            const gap = 6;
            const totalW = n * bw + (n - 1) * gap;
            const x = -totalW / 2 + i * (bw + gap) + bw / 2;
            const loadHeight = 12 + (systemLoad / 100) * 18;
            return (
              <g key={i}>
                <rect
                  x={x - bw / 2}
                  y={-8}
                  width={bw}
                  height={24}
                  rx="2"
                  fill="url(#ds-warehouse)"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <rect
                  x={x - bw / 2 + 2}
                  y={16 - loadHeight}
                  width={bw - 4}
                  height={loadHeight}
                  rx="1"
                  fill={accent}
                  opacity={0.25 + (systemLoad / 100) * 0.5}
                />
              </g>
            );
          })}
        </g>

        {/* Queue stack (next to warehouses) */}
        {queue > 15 && (
          <g transform={`translate(${viewW * 0.55}, ${viewH / 2 + 12})`}>
            {[0, 1, 2].slice(0, Math.min(3, Math.ceil(queue / 25))).map((i) => (
              <rect
                key={i}
                x={i * 6}
                y={-i * 4}
                width="10"
                height="6"
                rx="0.5"
                fill="#94a3b8"
                opacity={0.5 + (queue / 100) * 0.3}
              />
            ))}
          </g>
        )}

        {/* Delivery truck (right) */}
        <g transform={`translate(${viewW * 0.82}, ${viewH / 2 + 4})`}>
          <rect x="0" y="4" width="28" height="14" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="4" y="0" width="12" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.6" />
          <circle cx="8" cy="20" r="3" fill="#64748b" />
          <circle cx="22" cy="20" r="3" fill="#64748b" />
        </g>
      </svg>
    </div>
  );
}
