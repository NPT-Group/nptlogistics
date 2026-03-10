// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceConfigurationSection/InternationalModeSelector.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Plane, Ship, AlertTriangle } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../../schema";
import { EInternationalMode } from "@/types/logisticsQuote.types";
import { IconCardSelector, type IconCardOption } from "../../components/IconCardSelector";

const MODE_OPTIONS: readonly IconCardOption<EInternationalMode>[] = [
  {
    value: EInternationalMode.AIR,
    label: "Air freight",
    icon: Plane,
  },
  {
    value: EInternationalMode.OCEAN,
    label: "Ocean freight",
    icon: Ship,
  },
];

export function InternationalModeSelector() {
  const { control, setValue, formState, clearErrors } =
    useFormContext<LogisticsQuoteSubmitValues>();

  const mode = useWatch({
    control,
    name: "serviceDetails.mode",
  }) as EInternationalMode | undefined;

  const error = (formState.errors.serviceDetails as any)?.mode?.message as string | undefined;

  function choose(next: EInternationalMode) {
    if (mode === next) return;

    setValue("serviceDetails.mode" as any, next as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    clearErrors("serviceDetails.mode" as any);
  }

  return (
    <section
      data-field-path="serviceDetails.mode"
      aria-invalid={Boolean(error)}
      aria-describedby="serviceDetails.mode-error"
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">Mode</h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
          Choose air or ocean. This helps us price and route correctly.
        </p>

        {error ? (
          <div
            id="serviceDetails.mode-error"
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{error}</div>
          </div>
        ) : null}
      </div>

      <IconCardSelector<EInternationalMode>
        options={MODE_OPTIONS}
        value={mode}
        onChange={choose}
        name="serviceDetails.mode"
        invalid={Boolean(error)}
        errorId="serviceDetails.mode-error"
        variant="detailed"
        align="left"
        columnsClassName="grid gap-3 md:grid-cols-2"
        animateItems
        staggerDelay={0.03}
      />
    </section>
  );
}
