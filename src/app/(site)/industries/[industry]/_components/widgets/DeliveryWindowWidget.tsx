"use client";

import * as React from "react";
import { IconTruck } from "./WidgetIcons";
import { PillToggle, WidgetCard } from "./WidgetCard";

type Timing = "early" | "ontime" | "late";
type Lane = "local" | "cross-border";
type DeliveryMode = "parts" | "cars";

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

export function DeliveryWindowWidget({ accentColor }: { accentColor?: string }) {
  const [mode, setMode] = React.useState<DeliveryMode>("cars");
  const [timing, setTiming] = React.useState<Timing>("ontime");
  const [lane, setLane] = React.useState<Lane>("local");
  const reduceMotion = useReducedMotion();
  const accent = accentColor ?? "var(--color-brand-500)";

  const isLate = timing === "late";
  const isEarly = timing === "early";
  const isOntime = timing === "ontime";
  const lineSpeed = isLate ? 0.3 : isEarly ? 0.6 : 1;
  const yardCongestion = isEarly ? 0.7 : 0;

  const statusParts = isOntime ? "Smooth flow" : isLate ? "Line stutter — delay" : "Buffer filling";
  const statusCars = isOntime ? "Delivery window met" : isLate ? "Customer waiting" : "Ready at dealer";

  return (
    <WidgetCard
      icon={<IconTruck />}
      title="When it arrives"
      accentColor={accentColor}
      howToUse="Pick parts (factory) or car to customer, then choose arrival time. See how early, on time, or late changes the outcome."
      aria-labelledby="delivery-widget-title"
      didYouKnow={mode === "parts" ? "On time = smooth flow; late = line stutter; early = yard congestion." : "On time = window met; late = customer waiting; early = cars pile at dealer."}
      visual={
        <div className="relative min-h-[120px] rounded-xl bg-slate-100/80 p-4">
          {mode === "parts" ? (
            <>
              {/* Assembly line: belt + blocks */}
              <div className="relative h-14 overflow-hidden rounded-lg bg-slate-200/90">
                <div
                  className="absolute inset-y-0 w-full"
                  style={{
                    background: `repeating-linear-gradient(90deg, transparent 0, transparent 24px, rgba(0,0,0,0.06) 24px, rgba(0,0,0,0.06) 26px)`,
                  }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `repeating-linear-gradient(90deg, transparent 0, transparent 16px, rgba(0,0,0,0.08) 16px, rgba(0,0,0,0.08) 18px)`,
                    animation: reduceMotion || isLate ? "none" : "jit-belt 1.5s linear infinite",
                    animationDuration: `${1.5 / lineSpeed}s`,
                  }}
                  aria-hidden
                />
                <div className="absolute left-[10%] top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-slate-500 opacity-90" aria-hidden />
                <div className="absolute left-[40%] top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-slate-500 opacity-90" aria-hidden />
                <div className="absolute left-[70%] top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-slate-500 opacity-90" aria-hidden />
                {isLate && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                )}
                {isOntime && (
                  <div
                    className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full opacity-90"
                    style={{ backgroundColor: accent, boxShadow: `0 0 0 4px ${accent}4D` }}
                    aria-hidden
                  />
                )}
              </div>
              {yardCongestion > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600">
                  <span className="h-1.5 flex-1 rounded-full bg-amber-200 overflow-hidden">
                    <span className="block h-full rounded-full bg-amber-500 transition-all" style={{ width: `${yardCongestion * 100}%` }} />
                  </span>
                  <span>Yard congestion</span>
                </div>
              )}
            </>
          ) : (
            /* Car-to-customer: delivery outcome */
            <div className="flex flex-col items-center justify-center gap-3 py-2">
              <div className="flex items-center gap-4 text-slate-400">
                <svg className="h-8 w-10 shrink-0" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 14h8l2-4h14l2 4h4M4 14v4M36 14v4M10 18h20" />
                </svg>
                <span className="text-slate-300">→</span>
                <svg className="h-8 w-10 shrink-0" viewBox="0 0 40 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 28V12M20 12L12 20M20 12l8 8M8 28h24" />
                </svg>
              </div>
              <div
                className="rounded-lg px-3 py-2 text-center text-[11px] font-medium"
                style={{
                  backgroundColor: isOntime ? `${accent}18` : isLate ? "rgba(245,158,11,0.15)" : "rgba(148,163,184,0.2)",
                  color: isOntime ? accent : isLate ? "var(--color-amber-700)" : "var(--color-muted-light)",
                }}
              >
                {statusCars}
              </div>
            </div>
          )}
          <p className="mt-2 text-[11px] font-medium" style={{ color: isOntime ? accent : isLate ? "var(--color-amber-600)" : "var(--color-muted-light)" }}>
            {mode === "parts" ? statusParts : statusCars}
          </p>
          <style>{`@keyframes jit-belt { from { transform: translateX(0); } to { transform: translateX(18px); } }`}</style>
        </div>
      }
      controls={
        <>
          <div className="mb-3">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              What we’re delivering
            </span>
            <PillToggle
              value={mode}
              options={[
                { id: "parts", label: "Parts to line" },
                { id: "cars", label: "Car to customer" },
              ]}
              onChange={setMode}
              accentColor={accentColor}
              aria-label="Delivery type: parts to factory or car to customer"
            />
          </div>
          <div className="mb-3">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Arrival vs slot
            </span>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {(["early", "ontime", "late"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTiming(t)}
                  className={timing === t ? "flex-1 rounded-md py-2 text-[11px] font-medium text-white shadow-sm transition-colors" : "flex-1 rounded-md py-2 text-[11px] font-medium text-[color:var(--color-muted-light)] transition-colors hover:text-[color:var(--color-text-light)]"}
                  style={timing === t ? { backgroundColor: accent } : undefined}
                >
                  {t === "ontime" ? "On time" : t === "early" ? "Early" : "Late"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
              Lane
            </span>
            <PillToggle
              value={lane}
              options={[
                { id: "local", label: "Local" },
                { id: "cross-border", label: "Cross-border" },
              ]}
              onChange={setLane}
              accentColor={accentColor}
              aria-label="Lane type"
            />
          </div>
        </>
      }
    />
  );
}
