// src/app/(admin)/components/ui/Checkbox.tsx
"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

export function Checkbox({
  checked,
  onChange,
  disabled,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[18px] w-[18px] items-center justify-center rounded-md border transition",
        "border-[var(--dash-border)] bg-[var(--dash-bg)]",
        "shadow-[var(--dash-shadow)]/10",
        "hover:bg-[var(--dash-surface-2)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-md transition",
          checked ? "bg-[var(--dash-red-soft)]" : "bg-transparent",
        )}
        aria-hidden
      />
      <Check
        className={cn(
          "relative h-4 w-4 transition",
          checked ? "text-[var(--dash-red)] opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}
