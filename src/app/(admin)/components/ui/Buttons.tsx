// src/components/admin/ui/Buttons.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function SoftButton({
  icon,
  label,
  disabled,
  onClick,
  className,
  iconClassName,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
        "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
        "shadow-[var(--dash-shadow)]/18",
        "hover:bg-[var(--dash-surface-2)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span className={cn("text-[var(--dash-muted)]", iconClassName)}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function IconButton({
  title,
  disabled,
  onClick,
  children,
  tone = "neutral",
  className,
}: {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "neutral" | "danger";
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-2xl border transition",
        "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
        "shadow-[var(--dash-shadow)]/15",
        "hover:bg-[var(--dash-surface-2)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger" && "text-red-500",
        className,
      )}
    >
      {children}
    </button>
  );
}
