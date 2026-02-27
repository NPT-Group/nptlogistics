"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Fun operational widget card: icon + title → big visual area → controls.
 * Subtle border + soft shadow, on-brand. No form vibe.
 */
export function WidgetCard({
  icon,
  title,
  accentColor,
  howToUse,
  visual,
  controls,
  didYouKnow,
  "aria-labelledby": ariaLabelledby,
  className,
  /** When true, card uses h-full flex flex-col and visual area is flex-1 min-h-0 for equal-height layouts */
  fillHeight,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor?: string;
  /** One short line so users know what to do without thinking */
  howToUse?: string;
  visual: React.ReactNode;
  controls: React.ReactNode;
  didYouKnow?: string;
  "aria-labelledby"?: string;
  className?: string;
  fillHeight?: boolean;
}) {
  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-[0_2px_12px_rgba(2,6,23,0.04)] overflow-hidden",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[color:var(--color-border-light)]",
        fillHeight && "flex h-full flex-col",
        className,
      )}
      style={{ ["--widget-accent" as string]: accent } as React.CSSProperties}
      role="group"
      aria-labelledby={ariaLabelledby}
    >
      <div className={cn("shrink-0", fillHeight ? "px-4 pt-3 sm:px-5 sm:pt-4" : "px-4 pt-4 sm:px-5 sm:pt-5")}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-surface-0-light)]" style={{ color: accent }}>
            {icon}
          </span>
          <h3
            id={ariaLabelledby}
            className="text-[0.9375rem] font-semibold tracking-tight"
            style={{ color: accent }}
          >
            {title}
          </h3>
        </div>
        {howToUse != null && (
          <p className="mt-1.5 text-[11px] text-[color:var(--color-muted-light)]">
            {howToUse}
          </p>
        )}
      </div>
      <div className={cn(fillHeight ? "flex-1 min-h-0 flex flex-col px-4 pb-2 sm:px-5 sm:pb-3" : "px-4 pb-3 sm:px-5 sm:pb-4")}>
        {visual}
      </div>
      {React.Children.count(controls) > 0 ? (
        <div className="px-4 py-3 sm:px-5 sm:py-4">
          {controls}
        </div>
      ) : null}
      {didYouKnow != null && (
        <p className={cn("shrink-0 border-t border-[color:var(--color-border-light)]/50 px-4 pb-2.5 pt-2.5 text-[10px] text-[color:var(--color-muted-light)] sm:px-5 min-h-[2.75rem] flex items-center bg-[color:var(--color-surface-0-light)]/30")}>
          {didYouKnow}
        </p>
      )}
    </div>
  );
}

/** Pill toggle: 1–2 controls, role="tablist" / role="tab", keyboard usable. Uses accentColor for selected state when provided. */
export function PillToggle<T extends string>({
  value,
  options,
  onChange,
  accentColor,
  "aria-label": ariaLabel,
}: {
  value: T;
  options: ReadonlyArray<{ id: T; label: string }>;
  onChange: (id: T) => void;
  accentColor?: string;
  "aria-label"?: string;
}) {
  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1.5"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          tabIndex={value === opt.id ? 0 : -1}
          onClick={() => onChange(opt.id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            !(value === opt.id) && "bg-[color:var(--color-surface-0-light)] text-[color:var(--color-muted-light)] hover:bg-[color:var(--color-border-light)]/30 hover:text-[color:var(--color-text-light)]",
          )}
          style={value === opt.id ? { backgroundColor: accent, color: "white" } : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
