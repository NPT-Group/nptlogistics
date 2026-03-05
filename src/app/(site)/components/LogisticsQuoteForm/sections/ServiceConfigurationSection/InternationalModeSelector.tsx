// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/InternationalModeSelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Plane, Ship } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EInternationalMode } from "@/types/logisticsQuote.types";
import { cn } from "@/lib/utils/cn";

export function InternationalModeSelector() {
  const { control, setValue } = useFormContext<LogisticsQuoteSubmitValues>();

  const mode = useWatch({
    control,
    name: "serviceDetails.mode",
  }) as EInternationalMode | undefined;

  function choose(next: EInternationalMode) {
    if (mode === next) return;

    setValue("serviceDetails.mode" as any, next as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  const cards = [
    {
      value: EInternationalMode.AIR,
      label: "Air freight",
      description: "Fastest option for time-sensitive shipments.",
      icon: Plane,
    },
    {
      value: EInternationalMode.OCEAN,
      label: "Ocean freight",
      description: "Best for larger shipments and cost efficiency.",
      icon: Ship,
    },
  ] as const;

  return (
    <section
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      data-field-path="serviceDetails.mode"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-900">Mode</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Choose air or ocean. This helps us price and route correctly.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((c) => {
          const active = mode === c.value;
          const Icon = c.icon;

          return (
            <button
              key={c.value}
              type="button"
              onClick={() => choose(c.value)}
              className={cn(
                "group relative rounded-2xl border p-4 text-left transition",
                "hover:border-neutral-300 hover:bg-neutral-50",
                active
                  ? "border-black bg-neutral-50 ring-1 ring-black/10"
                  : "border-neutral-200 bg-white",
              )}
              aria-pressed={active}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border",
                    active ? "border-black bg-black text-white" : "border-neutral-200 bg-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-neutral-900">{c.label}</div>
                    {active ? (
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{c.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
