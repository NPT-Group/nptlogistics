// src/components/forms/fields/PillCheckboxButton.tsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type PillCheckboxButtonProps = {
  label: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
};

export function PillCheckboxButton({
  label,
  checked,
  onToggle,
  invalid,
  disabled,
  className,
}: PillCheckboxButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      disabled={disabled}
      className={cn(
        "group relative inline-flex min-h-10 items-center gap-2.5 rounded-full border px-3.5 py-2 text-sm transition-colors duration-200 hover:cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        checked
          ? [
              "border-neutral-200",
              "bg-neutral-50/70",
              "text-[color:var(--color-text-light)]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
            ]
          : [
              "border-neutral-200",
              "bg-white",
              "text-[color:var(--color-text-light)]",
              "hover:border-neutral-300 hover:bg-neutral-50/80",
            ],
        invalid && !checked && "border-red-300",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          checked
            ? "border-[color:var(--color-brand-600)] bg-[color:var(--color-brand-600)] text-white"
            : "border-neutral-200 bg-white text-transparent group-hover:border-neutral-300",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={2.75} />
      </span>

      <span className="font-medium">{label}</span>
    </button>
  );
}
