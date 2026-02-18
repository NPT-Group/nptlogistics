// src/app/(admin)/components/ui/Select.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Check, ChevronDown } from "lucide-react";

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const active = options.find((o) => o.value === value);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 w-full items-center justify-between gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
          "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
          "hover:bg-[var(--dash-surface-2)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(!active ? "font-medium text-[var(--dash-muted)]" : "")}>
          {active?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-[var(--dash-muted)] transition", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className={cn(
            "absolute z-[90] mt-2 w-full overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-1">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                value === ""
                  ? "bg-[var(--dash-surface-2)] text-[var(--dash-text)]"
                  : "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
              )}
            >
              <span className="text-[var(--dash-muted)]">{placeholder}</span>
              {value === "" ? <Check className="h-4 w-4 text-[var(--dash-red)]" /> : null}
            </button>

            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                    active
                      ? "bg-[var(--dash-surface-2)] text-[var(--dash-text)]"
                      : "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
                  )}
                >
                  <span>{o.label}</span>
                  {active ? <Check className="h-4 w-4 text-[var(--dash-red)]" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
