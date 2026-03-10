// src/components/forms/fields/SelectField.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type Pos = { top: number; left: number; width: number };

export type SelectFieldProps<TFieldValues extends FieldValues, TValue extends string = string> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  ui: FieldUi;
  fieldPathAttr?: string;
  options: ReadonlyArray<SelectOption<TValue>>;
  placeholder?: string;
  selectProps?: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "onChange" | "name" | "ref" | "type"
  >;
  invalidClassName?: string;

  /**
   * Optional overrides for the floating dropdown.
   * Default styling is intentionally light so dark site themes do not leak in.
   * Admin can override these for a dark menu.
   */
  menuPanelClassName?: string;
  menuScrollAreaClassName?: string;
};

export function SelectField<TFieldValues extends FieldValues, TValue extends string = string>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  fieldPathAttr,
  options,
  placeholder = "Select...",
  selectProps,
  invalidClassName = "border-red-500 focus:ring-red-500/15",
  menuPanelClassName,
  menuScrollAreaClassName,
}: SelectFieldProps<TFieldValues, TValue>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const invalid = !!error;
  const path = fieldPathAttr ?? String(name);
  const inputId = `${path}-input`;
  const hintId = `${path}-hint`;
  const errorId = `${path}-error`;
  const listboxId = `${path}-listbox`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const listboxRef = React.useRef<HTMLDivElement | null>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<Pos>({ top: 0, left: 0, width: 0 });
  const [highlighted, setHighlighted] = React.useState<number>(-1);

  const rafIdRef = React.useRef<number | null>(null);
  const lastPosRef = React.useRef<Pos>({ top: 0, left: 0, width: 0 });

  const typeaheadRef = React.useRef("");
  const typeaheadResetRef = React.useRef<number | null>(null);

  const value = (field.value ?? "") as string;
  const activeIndex = options.findIndex((opt) => opt.value === value);
  const activeOption = activeIndex >= 0 ? options[activeIndex] : null;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const clearTypeahead = React.useCallback(() => {
    typeaheadRef.current = "";
    if (typeaheadResetRef.current != null) {
      window.clearTimeout(typeaheadResetRef.current);
      typeaheadResetRef.current = null;
    }
  }, []);

  const queueTypeaheadReset = React.useCallback(() => {
    if (typeaheadResetRef.current != null) {
      window.clearTimeout(typeaheadResetRef.current);
    }

    typeaheadResetRef.current = window.setTimeout(() => {
      typeaheadRef.current = "";
      typeaheadResetRef.current = null;
    }, 500);
  }, []);

  React.useEffect(() => {
    return () => {
      if (typeaheadResetRef.current != null) {
        window.clearTimeout(typeaheadResetRef.current);
      }
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const assignButtonRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      btnRef.current = node;

      if (typeof field.ref === "function") {
        field.ref(node);
      } else if (field.ref) {
        (field.ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    },
    [field],
  );

  const measure = React.useCallback((): Pos | null => {
    const btn = btnRef.current;
    if (!btn) return null;

    const rect = btn.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    };
  }, []);

  const applyPosToMenu = React.useCallback((nextPos: Pos) => {
    const el = menuRef.current;
    if (!el) return;

    el.style.top = `${nextPos.top}px`;
    el.style.left = `${nextPos.left}px`;
    el.style.width = `${nextPos.width}px`;
  }, []);

  const scheduleSync = React.useCallback(() => {
    if (rafIdRef.current != null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      const nextPos = measure();
      if (!nextPos) return;

      const prevPos = lastPosRef.current;
      const changed =
        Math.abs(nextPos.top - prevPos.top) > 0.5 ||
        Math.abs(nextPos.left - prevPos.left) > 0.5 ||
        Math.abs(nextPos.width - prevPos.width) > 0.5;

      if (!changed) return;

      lastPosRef.current = nextPos;
      applyPosToMenu(nextPos);
    });
  }, [applyPosToMenu, measure]);

  React.useLayoutEffect(() => {
    if (!open) return;
    const nextPos = measure();
    if (!nextPos) return;

    lastPosRef.current = nextPos;
    setPos(nextPos);
  }, [open, measure]);

  React.useEffect(() => {
    if (!open) return;

    const onResize = () => scheduleSync();
    const onScroll = () => scheduleSync();

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
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;

      setOpen(false);
      clearTypeahead();
      field.onBlur();
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        clearTypeahead();
        btnRef.current?.focus();
        field.onBlur();
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open, field, clearTypeahead]);

  const isEnabledIndex = React.useCallback(
    (index: number) => {
      const opt = options[index];
      return !!opt && !opt.disabled;
    },
    [options],
  );

  const firstEnabledIndex = React.useCallback(() => {
    for (let i = 0; i < options.length; i += 1) {
      if (isEnabledIndex(i)) return i;
    }
    return -1;
  }, [isEnabledIndex, options.length]);

  const lastEnabledIndex = React.useCallback(() => {
    for (let i = options.length - 1; i >= 0; i -= 1) {
      if (isEnabledIndex(i)) return i;
    }
    return -1;
  }, [isEnabledIndex, options.length]);

  const nextEnabledIndex = React.useCallback(
    (from: number, dir: 1 | -1) => {
      if (!options.length) return -1;

      let i = from;
      for (let step = 0; step < options.length; step += 1) {
        i = (i + dir + options.length) % options.length;
        if (isEnabledIndex(i)) return i;
      }

      return -1;
    },
    [isEnabledIndex, options.length],
  );

  const focusHighlighted = React.useCallback((index: number) => {
    optionRefs.current[index]?.focus();
  }, []);

  const commitValue = React.useCallback(
    (nextValue: string) => {
      field.onChange(nextValue);
      field.onBlur();
      clearTypeahead();
      setOpen(false);
      btnRef.current?.focus();
    },
    [field, clearTypeahead],
  );

  const selectIndex = React.useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      commitValue(opt.value);
    },
    [commitValue, options],
  );

  const findTypeaheadMatch = React.useCallback(
    (search: string, startFrom: number) => {
      if (!search) return -1;

      const normalized = search.trim().toLocaleLowerCase();
      if (!normalized) return -1;

      for (let step = 1; step <= options.length; step += 1) {
        const index = (startFrom + step) % options.length;
        const opt = options[index];
        if (!opt || opt.disabled) continue;

        if (opt.label.toLocaleLowerCase().startsWith(normalized)) {
          return index;
        }
      }

      return -1;
    },
    [options],
  );

  React.useEffect(() => {
    if (!open) return;

    optionRefs.current = [];

    let start = options.findIndex((opt) => opt.value === value);
    if (start < 0 || options[start]?.disabled) start = firstEnabledIndex();

    setHighlighted(start);
    clearTypeahead();

    queueMicrotask(() => {
      if (start >= 0) focusHighlighted(start);
      else listboxRef.current?.focus();
    });
  }, [open, options, value, firstEnabledIndex, focusHighlighted, clearTypeahead]);

  const openMenu = React.useCallback(() => {
    const nextPos = measure();
    if (nextPos) {
      lastPosRef.current = nextPos;
      setPos(nextPos);
    }
    clearTypeahead();
    setOpen(true);
  }, [measure, clearTypeahead]);

  const closeMenu = React.useCallback(() => {
    clearTypeahead();
    setOpen(false);
    field.onBlur();
  }, [field, clearTypeahead]);

  const onTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (selectProps?.disabled) return;

      if (
        !open &&
        (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        openMenu();
        return;
      }

      if (open && e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        btnRef.current?.focus();
      }
    },
    [closeMenu, open, openMenu, selectProps?.disabled],
  );

  const onListboxKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const base = highlighted >= 0 ? highlighted : firstEnabledIndex();
        const next = highlighted >= 0 ? nextEnabledIndex(base, 1) : base;
        if (next >= 0) {
          setHighlighted(next);
          focusHighlighted(next);
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const base = highlighted >= 0 ? highlighted : lastEnabledIndex();
        const next = highlighted >= 0 ? nextEnabledIndex(base, -1) : base;
        if (next >= 0) {
          setHighlighted(next);
          focusHighlighted(next);
        }
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        const next = firstEnabledIndex();
        if (next >= 0) {
          setHighlighted(next);
          focusHighlighted(next);
        }
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        const next = lastEnabledIndex();
        if (next >= 0) {
          setHighlighted(next);
          focusHighlighted(next);
        }
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlighted >= 0) selectIndex(highlighted);
        return;
      }

      if (e.key === "Tab") {
        closeMenu();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        btnRef.current?.focus();
        return;
      }

      if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();

        const char = e.key.toLocaleLowerCase();
        const prevBuffer = typeaheadRef.current;
        const nextBuffer = prevBuffer + char;

        const currentIndex = highlighted >= 0 ? highlighted : activeIndex >= 0 ? activeIndex : -1;
        const searchStart = currentIndex >= 0 ? currentIndex : -1;

        let match = findTypeaheadMatch(nextBuffer, searchStart);

        if (match < 0) {
          match = findTypeaheadMatch(char, searchStart);
          typeaheadRef.current = char;
        } else {
          typeaheadRef.current = nextBuffer;
        }

        queueTypeaheadReset();

        if (match >= 0) {
          setHighlighted(match);
          focusHighlighted(match);
        }
      }
    },
    [
      open,
      highlighted,
      firstEnabledIndex,
      nextEnabledIndex,
      focusHighlighted,
      lastEnabledIndex,
      selectIndex,
      closeMenu,
      activeIndex,
      findTypeaheadMatch,
      queueTypeaheadReset,
    ],
  );

  const menu = open ? (
    <div
      ref={(node) => {
        menuRef.current = node;
        if (node) applyPosToMenu(lastPosRef.current);
      }}
      className="fixed z-[60]"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={label ? inputId : undefined}
        className={cn(
          "overflow-hidden rounded-xl border",
          "border-neutral-200 bg-white text-neutral-900",
          "shadow-[0_12px_32px_rgba(15,23,42,0.08)]",
          "ring-1 ring-black/4",
          "backdrop-blur-sm",
          "[color-scheme:light]",
          menuPanelClassName,
        )}
        onKeyDown={onListboxKeyDown}
      >
        <div
          className={cn(
            "max-h-72 overflow-auto p-1.5",
            "[color-scheme:light]",
            "[scrollbar-gutter:stable]",
            "scrollbar-thin",
            "scrollbar-track-transparent",
            "scrollbar-thumb-neutral-300",
            "hover:scrollbar-thumb-neutral-400",
            menuScrollAreaClassName,
          )}
          style={{
            scrollbarColor: "#d4d4d4 transparent",
          }}
        >
          {options.map((opt, index) => {
            const isActive = opt.value === value;
            const isHighlighted = index === highlighted;

            return (
              <button
                key={opt.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                id={`${listboxId}-opt-${String(opt.value)}`}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={opt.disabled}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => {
                  if (opt.disabled) return;
                  commitValue(opt.value);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                  "text-neutral-900",
                  "disabled:cursor-not-allowed disabled:opacity-45",
                  "hover:bg-neutral-50",
                  isActive && "bg-neutral-50",
                  isHighlighted && "bg-[#F8F8F8] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.14)]",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isActive ? <Check className="h-4 w-4 text-neutral-700" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={ui.container} data-field-path={path}>
      {label ? (
        <label htmlFor={inputId} className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <input type="hidden" name={field.name} value={value} readOnly />

      <button
        id={inputId}
        {...selectProps}
        ref={assignButtonRef}
        type="button"
        disabled={selectProps?.disabled}
        onBlur={(e) => {
          selectProps?.onBlur?.(e);
          if (!open) field.onBlur();
        }}
        onKeyDown={(e) => {
          selectProps?.onKeyDown?.(e);
          if (e.defaultPrevented) return;
          onTriggerKeyDown(e);
        }}
        onClick={(e) => {
          selectProps?.onClick?.(e);
          if (e.defaultPrevented || selectProps?.disabled) return;
          setOpen((prev) => {
            if (!prev) {
              const nextPos = measure();
              if (nextPos) {
                lastPosRef.current = nextPos;
                setPos(nextPos);
              }
              clearTypeahead();
            }
            return !prev;
          });
        }}
        aria-invalid={invalid}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className={cn(
          ui.control,
          "flex items-center justify-between gap-3 text-left",
          "pr-3",
          "[&>span]:min-w-0",
          invalid && invalidClassName,
        )}
      >
        <span className={cn("block flex-1 truncate text-sm", !activeOption && "text-neutral-400")}>
          {activeOption?.label ?? placeholder}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-neutral-500 transition duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {error ? (
        <p id={errorId} role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}

      {mounted && typeof document !== "undefined" ? createPortal(menu, document.body) : null}
    </div>
  );
}
