// src/app/(site)/components/LogisticsQuoteForm/sections/ServiceSelectionSection.tsx
"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Truck, Boxes, Globe2, Warehouse, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

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
    description: "Dedicated truck, best for larger shipments and time-sensitive loads.",
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
    description: "Storage and fulfillment support with flexible durations and volume.",
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
    <section
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      data-field-path="serviceDetails.primaryService"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-neutral-900">Select a service</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Choose the primary service first. We’ll show only the fields that apply.
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
                    <div className="text-sm font-semibold text-neutral-900">{svc.label}</div>
                    {active ? (
                      <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{svc.description}</p>
                </div>
              </div>

              <span
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-2xl",
                  active ? "shadow-[0_0_0_2px_rgba(0,0,0,0.08)]" : "",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
