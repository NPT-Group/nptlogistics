"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Unified shell for all industry Operational Control Modules.
 * Same card, spacing, and structure. Client island only for controls.
 */
export function WidgetShell({
  title,
  subtitle,
  accentColor,
  children,
  className,
  "aria-labelledby": ariaLabelledby,
}: {
  title: string;
  subtitle: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
  "aria-labelledby"?: string;
}) {
  const accent = accentColor ?? "var(--color-brand-500)";
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--color-border-light)]/80 bg-white shadow-[0_2px_12px_rgba(2,6,23,0.04)]",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[color:var(--color-border-light)]",
        className,
      )}
      style={{ ["--widget-accent" as string]: accent } as React.CSSProperties}
      role="group"
      aria-labelledby={ariaLabelledby}
    >
      <div className="border-b border-[color:var(--color-border-light)]/60 px-5 py-4 sm:px-6 sm:py-4">
        <h3
          id={ariaLabelledby}
          className="text-[0.9375rem] font-semibold tracking-tight text-[color:var(--color-text-light)]"
          style={{ color: accent }}
        >
          {title}
        </h3>
        <p className="mt-0.5 text-[11px] font-medium text-[color:var(--color-muted-light)]">
          {subtitle}
        </p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/** Output card: live system readout. Same spacing, data-driven feel. */
export function OutputCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[color:var(--color-border-light)]/70 bg-[color:var(--color-surface-0-light)]/50 p-4 transition-[opacity] duration-200 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Single output row: label + value. */
export function OutputRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-muted-light)]">
        {label}
      </span>
      <span className="text-right">
        <span className="text-[13px] font-semibold tabular-nums text-[color:var(--color-text-light)]">
          {value}
        </span>
        {sub != null && (
          <span className="ml-1 text-[11px] text-[color:var(--color-muted-light)]">{sub}</span>
        )}
      </span>
    </div>
  );
}

/** NPT proof line shown at bottom of each widget. */
export function NptProofLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border-t border-[color:var(--color-border-light)]/60 pt-4 text-[11px] font-medium text-[color:var(--color-muted-light)]">
      {children}
    </p>
  );
}

/** Control group for widget inputs. */
export function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-light)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/** Select option button: minimal, keyboard accessible. */
export function SelectOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-1",
        selected
          ? "border-transparent bg-[color:var(--color-text-light)] text-white"
          : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:border-[color:var(--color-muted-light)]"
      )}
    >
      {label}
    </button>
  );
}
