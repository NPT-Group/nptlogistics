// src/app/(site)/components/forms/LogisticsQuoteForm/components/IconCardSelector.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type IconCardOption<T extends string> = {
  value: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  description?: string;
};

type IconCardSelectorProps<T extends string> = {
  options: readonly IconCardOption<T>[];
  value?: T;
  onChange: (next: T) => void;
  onBlur?: () => void;
  name?: string;
  invalid?: boolean;
  errorId?: string;
  columnsClassName?: string;
  variant?: "primary" | "secondary" | "detailed";
  className?: string;
  align?: "center" | "left";
  selectedLabel?: string;
  animateItems?: boolean;
  staggerDelay?: number;
};

export function IconCardSelector<T extends string>({
  options,
  value,
  onChange,
  onBlur,
  name,
  invalid,
  errorId,
  columnsClassName = "grid-cols-2 md:grid-cols-4",
  variant = "secondary",
  className,
  align = "center",
  selectedLabel = "Selected",
  animateItems = false,
  staggerDelay = 0.045,
}: IconCardSelectorProps<T>) {
  const isPrimary = variant === "primary";
  const isDetailed = variant === "detailed";
  const isCenter = align === "center";

  const content = options.map((opt, idx) => {
    const active = value === opt.value;
    const Icon = opt.icon;

    const card = (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        onBlur={onBlur}
        aria-pressed={active}
        aria-describedby={errorId}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden border text-left transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
          "hover:cursor-pointer",

          active
            ? cn(
                "rounded-2xl border border-neutral-200 bg-neutral-50/60",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
              )
            : cn("border-neutral-200 bg-white", "hover:border-neutral-300 hover:bg-neutral-50/80"),

          invalid && !active && "border-red-300",

          isPrimary &&
            cn(
              "rounded-2xl p-4",
              isCenter
                ? "flex flex-col items-center justify-center text-center"
                : "flex items-start gap-3",
            ),

          variant === "secondary" &&
            cn(
              "rounded-2xl px-3.5 py-3.5",
              isCenter
                ? "flex flex-col items-center justify-center text-center"
                : "flex items-start gap-3",
            ),

          isDetailed && cn("rounded-2xl px-4", (opt.description ?? opt.hint) ? "py-3.5" : "py-3"),
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200",
            active && "opacity-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]",
          )}
        />

        {isDetailed ? (
          (() => {
            const supportingText = opt.description ?? opt.hint;
            const hasSupportingText = Boolean(supportingText);

            return (
              <div
                className={cn(
                  "relative flex gap-3",
                  hasSupportingText ? "items-start" : "items-center",
                )}
              >
                <div
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-all duration-200",
                    hasSupportingText ? "mt-0.5 h-10 w-10" : "h-9 w-9",
                    active
                      ? "border-[color:var(--color-brand-600)]"
                      : "border-neutral-200 bg-white group-hover:border-neutral-300",
                  )}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(180deg, rgba(239,68,68,1) 0%, rgba(220,38,38,1) 100%)",
                        }
                      : undefined
                  }
                >
                  <Icon
                    className={cn(
                      "absolute transition-all duration-200 ease-out",
                      hasSupportingText ? "h-4.5 w-4.5" : "h-4 w-4",
                      active
                        ? "scale-75 text-[color:var(--color-text-light)] opacity-0"
                        : "scale-100 text-[color:var(--color-text-light)] opacity-100",
                    )}
                  />

                  <Icon
                    className={cn(
                      "absolute transition-all duration-200 ease-out",
                      hasSupportingText ? "h-4.5 w-4.5" : "h-4 w-4",
                      active ? "scale-100 text-white opacity-100" : "scale-75 text-white opacity-0",
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold tracking-[-0.01em] text-[color:var(--color-text-light)]">
                      {opt.label}
                    </div>

                    {active ? (
                      <span className="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-red-700 uppercase">
                        {selectedLabel}
                      </span>
                    ) : null}
                  </div>

                  {hasSupportingText ? (
                    <p className="mt-1 text-[11px] leading-4 text-[color:var(--color-muted-light)]">
                      {supportingText}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })()
        ) : (
          <>
            <div
              className={cn(
                "relative mb-2 flex items-center justify-center overflow-hidden rounded-full border transition-all duration-200",
                isPrimary ? "size-10" : "size-9",
                active
                  ? "border-[color:var(--color-brand-600)]"
                  : "border-neutral-200 bg-white group-hover:border-neutral-300",
              )}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(180deg, rgba(239,68,68,1) 0%, rgba(220,38,38,1) 100%)",
                    }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  "absolute transition-all duration-200 ease-out",
                  isPrimary ? "h-5 w-5" : "h-4 w-4",
                  active
                    ? "scale-75 text-[color:var(--color-text-light)] opacity-0"
                    : "scale-100 text-[color:var(--color-text-light)] opacity-100",
                )}
              />

              <Icon
                className={cn(
                  "absolute transition-all duration-200 ease-out",
                  isPrimary ? "h-5 w-5" : "h-4 w-4",
                  active ? "scale-100 text-white opacity-100" : "scale-75 text-white opacity-0",
                )}
              />
            </div>

            <div className={cn("relative min-w-0", isCenter ? "text-center" : "text-left")}>
              <div
                className={cn(
                  "font-semibold tracking-[-0.01em] text-[color:var(--color-text-light)]",
                  isPrimary ? "text-sm" : "text-[13px] sm:text-sm",
                )}
              >
                {opt.label}
              </div>

              {(opt.description || opt.hint) && !isCenter ? (
                <p className="mt-1 text-[11px] leading-4 text-[color:var(--color-muted-light)]">
                  {opt.description ?? opt.hint}
                </p>
              ) : null}
            </div>
          </>
        )}

        {active && !isDetailed ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full border border-red-200 bg-white/95"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
          </span>
        ) : null}

        {name ? (
          <input
            tabIndex={idx === 0 ? 0 : -1}
            className="sr-only"
            type="radio"
            name={name}
            checked={active}
            readOnly
            aria-hidden="true"
          />
        ) : null}
      </button>
    );

    if (!animateItems) {
      return <React.Fragment key={opt.value}>{card}</React.Fragment>;
    }

    return (
      <motion.div
        key={opt.value}
        className="w-full"
        // Visible-first: options should remain readable if animation timing fails.
        initial={{ opacity: 1, y: 6, scale: 0.995 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
          delay: idx * staggerDelay,
        }}
      >
        {card}
      </motion.div>
    );
  });

  return (
    <div className={cn("grid items-stretch gap-3", columnsClassName, className)}>{content}</div>
  );
}
