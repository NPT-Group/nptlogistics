"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };
type Pos = { top: number; left: number; width: number };

type Item = { value: string; label: string; disabled?: boolean; isPlaceholder?: boolean };

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
  const listboxRef = React.useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Pos>({ top: 0, left: 0, width: 0 });

  const rafIdRef = React.useRef<number | null>(null);
  const lastPosRef = React.useRef<Pos>({ top: 0, left: 0, width: 0 });

  // Build items: placeholder + options
  const items: Item[] = React.useMemo(
    () => [{ value: "", label: placeholder, isPlaceholder: true }, ...options],
    [options, placeholder],
  );

  const active = options.find((o) => o.value === value);

  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const itemBtnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const measure = React.useCallback((): Pos | null => {
    const btn = btnRef.current;
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return {
      top: r.bottom + 8,
      left: r.left,
      width: r.width,
    };
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

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onScroll);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [open, scheduleSync]);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      const root = rootRef.current;
      const menu = menuRef.current;
      const t = e.target as Node;

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

  // ---------- keyboard helpers ----------
  const isEnabledIndex = React.useCallback(
    (i: number) => {
      const it = items[i];
      return !!it && !it.disabled;
    },
    [items],
  );

  const firstEnabledIndex = React.useCallback(() => {
    for (let i = 0; i < items.length; i++) if (isEnabledIndex(i)) return i;
    return -1;
  }, [isEnabledIndex, items.length]);

  const lastEnabledIndex = React.useCallback(() => {
    for (let i = items.length - 1; i >= 0; i--) if (isEnabledIndex(i)) return i;
    return -1;
  }, [isEnabledIndex, items.length]);

  const nextEnabledIndex = React.useCallback(
    (from: number, dir: 1 | -1) => {
      if (!items.length) return -1;
      let i = from;
      for (let step = 0; step < items.length; step++) {
        i = (i + dir + items.length) % items.length;
        if (isEnabledIndex(i)) return i;
      }
      return -1;
    },
    [isEnabledIndex, items.length],
  );

  const focusHighlighted = React.useCallback((i: number) => {
    const btn = itemBtnRefs.current[i];
    btn?.focus();
  }, []);

  const selectIndex = React.useCallback(
    (i: number) => {
      const it = items[i];
      if (!it || it.disabled) return;
      onChange(it.value);
      setOpen(false);
      btnRef.current?.focus();
    },
    [items, onChange],
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

  // On open: highlight current value (including placeholder), then focus
  React.useEffect(() => {
    if (!open) return;

    itemBtnRefs.current = [];

    let start = items.findIndex((it) => it.value === value);
    if (start < 0) start = items.findIndex((it) => it.value === "");
    if (start < 0 || items[start]?.disabled) start = firstEnabledIndex();

    setHighlighted(start);

    queueMicrotask(() => {
      if (start >= 0) focusHighlighted(start);
      else listboxRef.current?.focus();
    });
  }, [open, value, items, firstEnabledIndex, focusHighlighted]);

  const portalMenu =
    mounted && open
      ? createPortal(
          <div
            ref={(node) => {
              menuRef.current = node;
              if (node) applyPosToMenu(lastPosRef.current);
            }}
            role="presentation"
            className={cn("fixed z-[40]")}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div
              ref={listboxRef}
              role="listbox"
              tabIndex={-1}
              onKeyDown={onListboxKeyDown}
              className={cn(
                "overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
                "border-[var(--dash-border)] bg-[var(--dash-surface)]",
              )}
            >
              <div className="p-1">
                {items.map((it, i) => {
                  const isActive = it.value === value;
                  const isHighlighted = i === highlighted;

                  return (
                    <button
                      key={it.isPlaceholder ? "__placeholder__" : it.value}
                      ref={(el) => {
                        itemBtnRefs.current[i] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => {
                        onChange(it.value);
                        setOpen(false);
                        btnRef.current?.focus();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                        isActive
                          ? "bg-[var(--dash-surface-2)] text-[var(--dash-text)]"
                          : "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
                        it.isPlaceholder && !isActive && "text-[var(--dash-muted)]",
                        isHighlighted && "ring-1 ring-[var(--dash-red-soft)]",
                      )}
                    >
                      <span className={cn(it.isPlaceholder ? "text-[var(--dash-muted)]" : "")}>
                        {it.label}
                      </span>
                      {isActive ? <Check className="h-4 w-4 text-[var(--dash-red)]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

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

      {portalMenu}
    </div>
  );
}
