// src/components/blocknote/BlockNoteSkeleton.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type BlockNoteSkeletonProps = {
  className?: string;
  style?: React.CSSProperties;

  heightClassName?: string;
  paddingClassName?: string;
  surfaceClassName?: string;

  animate?: boolean;
  lines?: number;

  showToolbar?: boolean;
  showTitleLine?: boolean;

  lineClassName?: string;
  lineWidths?: number[];

  footer?: React.ReactNode;

  variant?: "public" | "admin";
};

export function BlockNoteSkeleton({
  className,
  style,
  heightClassName = "min-h-[280px]",
  paddingClassName = "p-4 sm:p-6",
  surfaceClassName,
  animate = true,
  lines = 8,
  showToolbar = true,
  showTitleLine = false,
  lineClassName,
  lineWidths,
  footer,
  variant = "public",
}: BlockNoteSkeletonProps) {
  const surface =
    surfaceClassName ??
    (variant === "admin"
      ? "border border-[var(--dash-border)] bg-[var(--dash-surface)]"
      : "border border-slate-200/70 bg-white");

  // Admin should respect tokens automatically in both themes
  const baseFill = variant === "admin" ? "bg-[color:var(--dash-border)]/70" : "bg-slate-200/70";

  const subtleFill = variant === "admin" ? "bg-[color:var(--dash-border)]/45" : "bg-slate-100";

  const anim = animate ? "animate-pulse" : "";

  const defaultWidths = React.useMemo(() => {
    const pattern = [92, 88, 80, 94, 76, 86, 68, 90, 72, 84];
    return Array.from({ length: Math.max(1, lines) }, (_, i) => pattern[i % pattern.length]);
  }, [lines]);

  const widths = lineWidths?.length ? lineWidths : defaultWidths;

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-3xl shadow-[var(--dash-shadow)]",
        surface,
        paddingClassName,
        heightClassName,
        className,
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading editor…"
      role="status"
    >
      {showToolbar ? (
        <div className={cn("flex items-center gap-2", anim)}>
          <div className={cn("h-8 w-24 rounded-xl", subtleFill)} />
          <div className={cn("h-8 w-10 rounded-xl", subtleFill)} />
          <div className={cn("h-8 w-10 rounded-xl", subtleFill)} />
          <div className={cn("h-8 w-10 rounded-xl", subtleFill)} />
          <div className="flex-1" />
          <div className={cn("h-8 w-20 rounded-xl", subtleFill)} />
        </div>
      ) : null}

      {showTitleLine ? <div className={cn("mt-4 h-5 w-[55%] rounded-lg", baseFill, anim)} /> : null}

      <div className={cn("mt-4 space-y-3", anim)}>
        {Array.from({ length: Math.max(1, lines) }).map((_, i) => {
          const w = Math.max(30, Math.min(100, widths[i] ?? 80));
          return (
            <div
              key={i}
              className={cn("h-4 rounded-lg", baseFill, lineClassName)}
              style={{ width: `${w}%` }}
            />
          );
        })}
        <div className={cn("mt-2 h-20 w-full rounded-2xl", subtleFill)} />
      </div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}

export default BlockNoteSkeleton;
