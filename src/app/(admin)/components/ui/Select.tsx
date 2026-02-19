// src/app/(admin)/components/ui/Select.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

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
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const active = options.find((o) => o.value === value);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const syncPosition = React.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPos({
      top: r.bottom + 8, // mt-2
      left: r.left,
      width: r.width,
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    syncPosition();

    const onScroll = () => syncPosition();
    const onResize = () => syncPosition();

    // capture scrolls from any scroll container
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, syncPosition]);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      const root = rootRef.current;
      const menu = menuRef.current;
      const t = e.target as Node;

      // Treat BOTH the trigger area and the portal menu as "inside"
      if (root?.contains(t)) return;
      if (menu?.contains(t)) return;

      setOpen(false);
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
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={btnRef}
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

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              className={cn(
                "fixed z-[40] overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
                "border-[var(--dash-border)] bg-[var(--dash-surface)]",
              )}
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
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
                  const isActive = o.value === value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                        isActive
                          ? "bg-[var(--dash-surface-2)] text-[var(--dash-text)]"
                          : "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
                      )}
                    >
                      <span>{o.label}</span>
                      {isActive ? <Check className="h-4 w-4 text-[var(--dash-red)]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
