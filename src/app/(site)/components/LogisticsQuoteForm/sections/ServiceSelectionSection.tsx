// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceSelectionSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Truck, Boxes, Globe2, Warehouse, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/cn";

import {
  ELogisticsPrimaryService,
  type ELogisticsPrimaryService as PrimaryService,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { buildServiceDetailsOnPrimaryServiceChange } from "../helpers";

type ServiceCard = {
  value: PrimaryService;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SERVICES: readonly ServiceCard[] = [
  {
    value: ELogisticsPrimaryService.FTL,
    label: "Full Truckload (FTL)",
    description: "Dedicated truck for larger, time-sensitive shipments.",
    icon: Truck,
  },
  {
    value: ELogisticsPrimaryService.LTL,
    label: "Less Than Truckload (LTL)",
    description: "Cost-effective for smaller freight by sharing trailer space.",
    icon: Boxes,
  },
  {
    value: ELogisticsPrimaryService.INTERNATIONAL,
    label: "International",
    description: "Air or ocean freight for cross-border and global shipments.",
    icon: Globe2,
  },
  {
    value: ELogisticsPrimaryService.WAREHOUSING,
    label: "Warehousing",
    description: "Storage and fulfillment support with flexible durations.",
    icon: Warehouse,
  },
];

export function ServiceSelectionSection() {
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<LogisticsQuoteSubmitValues>();

  const current = useWatch({
    control,
    name: "serviceDetails.primaryService",
  });

  const serviceError = (errors.serviceDetails as any)?.primaryService?.message as
    | string
    | undefined;

  function selectService(next: PrimaryService) {
    const prev = getValues("serviceDetails.primaryService");
    if (prev === next) return;

    const nextDefaults = buildServiceDetailsOnPrimaryServiceChange(next);

    setValue("serviceDetails", nextDefaults as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    clearErrors("serviceDetails.primaryService" as any);
  }

  return (
    <section data-field-path="serviceDetails.primaryService">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">
          Select a service
        </h2>

        <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
          Pick the primary service. We’ll show only the fields that apply.
        </p>

        {serviceError ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <div>{serviceError}</div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SERVICES.map((svc) => {
          const active = current === svc.value;
          const Icon = svc.icon;

          return (
            <button
              key={svc.value}
              type="button"
              onClick={() => selectService(svc.value)}
              aria-pressed={active}
              className={cn(
                "group relative overflow-hidden rounded-2xl border text-left",
                "p-3 sm:p-4",
                "transition-all duration-200 ease-out",
                // base surface
                "border-[color:var(--color-border-light)] bg-white",
                // hover polish
                "hover:-translate-y-[1px] hover:border-neutral-300 hover:shadow-md",
                // active depth (this is the big change)
                active && [
                  "border-black/80",
                  "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]",
                  "ring-1 ring-black/10",
                ],
              )}
            >
              {/* Subtle surface sheen (makes it feel expensive) */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
                  // tiny black wash + top highlight
                  "bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.00)_60%)]",
                  active && "opacity-100",
                )}
              />

              {/* Inner stroke (inset border look) */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200",
                  "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]",
                  active && "opacity-100",
                )}
              />

              <div className="relative flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition",
                    active
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
                      {svc.label}
                    </div>

                    {active && (
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
                    {svc.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
