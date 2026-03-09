// src/app/(site)/components/LogisticsQuoteForm/components/IconCardSelector.tsx
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
          "group relative w-full border text-left transition",
          "hover:cursor-pointer hover:border-neutral-300 hover:bg-neutral-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
          active
            ? "border-black bg-neutral-50 ring-1 ring-black/10"
            : "border-neutral-200 bg-white",
          invalid && !active && "border-red-300",

          isPrimary &&
            cn(
              "rounded-xl p-4",
              isCenter
                ? "flex flex-col items-center justify-center text-center"
                : "flex items-start gap-3",
            ),

          variant === "secondary" &&
            cn(
              "rounded-lg px-3 py-3",
              isCenter
                ? "flex flex-col items-center justify-center text-center"
                : "flex items-start gap-3",
            ),

          isDetailed && cn("rounded-2xl px-4", (opt.description ?? opt.hint) ? "py-3" : "py-2.5"),
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
            isDetailed ? "rounded-2xl" : isPrimary ? "rounded-xl" : "rounded-lg",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]",
            active && "opacity-100",
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
                    "inline-flex shrink-0 items-center justify-center border transition",
                    hasSupportingText ? "mt-0.5 h-9 w-9 rounded-xl" : "h-8 w-8 rounded-lg",
                    active
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)]",
                  )}
                >
                  <Icon className={cn(hasSupportingText ? "h-4.5 w-4.5" : "h-4 w-4")} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
                      {opt.label}
                    </div>

                    {active ? (
                      <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-medium text-white shadow-sm">
                        {selectedLabel}
                      </span>
                    ) : null}
                  </div>

                  {hasSupportingText ? (
                    <p className="mt-0.5 text-[11px] leading-4 text-[color:var(--color-muted-light)]">
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
                "relative flex items-center justify-center border transition",
                isPrimary ? "mb-2 size-10 rounded-full" : "mb-2 size-8 rounded-full",
                active
                  ? "border-black bg-black text-white"
                  : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)]",
              )}
            >
              <Icon className={cn(isPrimary ? "h-5 w-5" : "h-4 w-4")} />
            </div>

            <div className={cn("relative min-w-0", isCenter ? "text-center" : "text-left")}>
              <div
                className={cn(
                  "font-semibold text-[color:var(--color-text-light)]",
                  isPrimary ? "text-sm" : "text-xs sm:text-sm",
                )}
              >
                {opt.label}
              </div>

              {(opt.description || opt.hint) && !isCenter ? (
                <p className="mt-0.5 text-[11px] leading-4 text-[color:var(--color-muted-light)]">
                  {opt.description ?? opt.hint}
                </p>
              ) : null}
            </div>
          </>
        )}

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
        initial={{ opacity: 0, y: 6 }}
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

  return <div className={cn("grid gap-3", columnsClassName, className)}>{content}</div>;
}
