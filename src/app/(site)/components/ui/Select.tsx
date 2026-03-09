// src/app/(site)/components/ui/Select.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string; disabled?: boolean };
type Pos = { top: number; left: number; width: number };

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  buttonClassName,
  menuClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const listboxRef = React.useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = React.useState<Pos>({ top: 0, left: 0, width: 0 });

  const rafIdRef = React.useRef<number | null>(null);
  const lastPosRef = React.useRef<Pos>({ top: 0, left: 0, width: 0 });

  // Keyboard highlight (index into `options`)
  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const optionBtnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const active = options.find((o) => o.value === value);

  React.useEffect(() => setMounted(true), []);

  const measure = React.useCallback((): Pos | null => {
    const btn = btnRef.current;
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { top: r.bottom + 8, left: r.left, width: r.width };
  }, []);

  const applyPosToMenu = React.useCallback((p: Pos) => {
    const el = menuRef.current;
    if (!el) return;
    el.style.top = `${p.top}px`;
    el.style.left = `${p.left}px`;
    el.style.width = `${p.width}px`;
  }, []);

  const scheduleSync = React.useCallback(() => {
    if (rafIdRef.current != null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      const p = measure();
      if (!p) return;

      const last = lastPosRef.current;
      const changed =
        Math.abs(p.top - last.top) > 0.5 ||
        Math.abs(p.left - last.left) > 0.5 ||
        Math.abs(p.width - last.width) > 0.5;

      if (!changed) return;

      lastPosRef.current = p;
      applyPosToMenu(p);
    });
  }, [applyPosToMenu, measure]);

  React.useLayoutEffect(() => {
    if (!open) return;
    const p = measure();
    if (!p) return;
    lastPosRef.current = p;
    setPos(p);
  }, [open, measure]);

  React.useEffect(() => {
    if (!open) return;

    const onScroll = () => scheduleSync();
    const onResize = () => scheduleSync();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onScroll);

      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [open, scheduleSync]);

  React.useEffect(() => {
    if (!open) return;

    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ---------- keyboard helpers ----------
  const isEnabledIndex = React.useCallback(
    (i: number) => {
      const opt = options[i];
      return !!opt && !opt.disabled;
    },
    [options],
  );

  const firstEnabledIndex = React.useCallback(() => {
    for (let i = 0; i < options.length; i++) if (isEnabledIndex(i)) return i;
    return -1;
  }, [isEnabledIndex, options.length]);

  const lastEnabledIndex = React.useCallback(() => {
    for (let i = options.length - 1; i >= 0; i--) if (isEnabledIndex(i)) return i;
    return -1;
  }, [isEnabledIndex, options.length]);

  const nextEnabledIndex = React.useCallback(
    (from: number, dir: 1 | -1) => {
      if (!options.length) return -1;
      let i = from;
      for (let step = 0; step < options.length; step++) {
        i = (i + dir + options.length) % options.length;
        if (isEnabledIndex(i)) return i;
      }
      return -1;
    },
    [isEnabledIndex, options.length],
  );

  const focusHighlighted = React.useCallback((i: number) => {
    const btn = optionBtnRefs.current[i];
    btn?.focus();
  }, []);

  const selectIndex = React.useCallback(
    (i: number) => {
      const opt = options[i];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      setOpen(false);
      btnRef.current?.focus();
    },
    [onChange, options],
  );

  const onListboxKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const base = highlighted >= 0 ? highlighted : firstEnabledIndex();
        const nxt = highlighted >= 0 ? nextEnabledIndex(base, 1) : base;
        if (nxt >= 0) {
          setHighlighted(nxt);
          focusHighlighted(nxt);
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const base = highlighted >= 0 ? highlighted : lastEnabledIndex();
        const nxt = highlighted >= 0 ? nextEnabledIndex(base, -1) : base;
        if (nxt >= 0) {
          setHighlighted(nxt);
          focusHighlighted(nxt);
        }
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        const i = firstEnabledIndex();
        if (i >= 0) {
          setHighlighted(i);
          focusHighlighted(i);
        }
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        const i = lastEnabledIndex();
        if (i >= 0) {
          setHighlighted(i);
          focusHighlighted(i);
        }
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlighted >= 0) selectIndex(highlighted);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      }
    },
    [
      open,
      highlighted,
      firstEnabledIndex,
      lastEnabledIndex,
      nextEnabledIndex,
      focusHighlighted,
      selectIndex,
    ],
  );

  // When opening: set highlighted to active option (or first enabled) and focus
  React.useEffect(() => {
    if (!open) return;

    optionBtnRefs.current = [];

    let start = options.findIndex((o) => o.value === value);
    if (start < 0 || options[start]?.disabled) start = firstEnabledIndex();

    setHighlighted(start);

    queueMicrotask(() => {
      if (start >= 0) focusHighlighted(start);
      else listboxRef.current?.focus();
    });
  }, [open, value, options, firstEnabledIndex, focusHighlighted]);

  const menu = open ? (
    <div
      ref={(node) => {
        menuRef.current = node;
        if (node) applyPosToMenu(lastPosRef.current);
      }}
      className="fixed z-[40]"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div
        ref={listboxRef}
        className={cn(
          // neutral defaults; overridden by menuClassName reliably via twMerge
          "w-full overflow-hidden rounded-xl border shadow-lg",
          "border-black/10 bg-white text-slate-900",
          "backdrop-blur-md",
          menuClassName,
        )}
        role="listbox"
        tabIndex={-1}
        onKeyDown={onListboxKeyDown}
      >
        <div className="max-h-72 overflow-auto p-1">
          {options.map((opt, i) => {
            const isActive = opt.value === value;
            const isHighlighted = i === highlighted;

            return (
              <button
                key={opt.value}
                ref={(el) => {
                  optionBtnRefs.current[i] = el;
                }}
                id={`npt-select-opt-${opt.value}`}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={opt.disabled}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm",
                  "text-inherit",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  // Works on both light and dark; menuClassName controls overall theme
                  "hover:bg-black/5 hover:backdrop-blur",
                  isActive && "bg-black/5",
                  isHighlighted && "ring-1 ring-white/20",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isActive ? <Check className="h-4 w-4 opacity-90" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onKeyDown={(e) => {
          if (disabled) return;

          if (
            !open &&
            (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
          ) {
            e.preventDefault();
            const p = measure();
            if (p) {
              lastPosRef.current = p;
              setPos(p);
            }
            setOpen(true);
          }
        }}
        onClick={() => {
          if (disabled) return;
          const p = measure();
          if (p) {
            lastPosRef.current = p;
            setPos(p);
          }
          setOpen((v) => !v);
        }}
        className={cn(
          // neutral defaults; overridden by buttonClassName reliably via twMerge
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm",
          "border-black/10 bg-white text-slate-900 shadow-sm",
          "hover:bg-black/5",
          "focus:ring-2 focus:ring-red-500/30 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          buttonClassName,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("truncate", !active?.label && "opacity-70")}>
          {active?.label ?? placeholder ?? "Select"}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-70 transition", open && "rotate-180")} />
      </button>

      {mounted && typeof document !== "undefined" ? createPortal(menu, document.body) : null}
    </div>
  );
}
