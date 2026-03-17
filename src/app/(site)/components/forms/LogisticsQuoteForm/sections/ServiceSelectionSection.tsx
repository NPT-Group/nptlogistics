// src/app/(site)/components/forms/LogisticsQuoteForm/sections/ServiceSelectionSection.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Truck, Boxes, Globe2, Warehouse, AlertTriangle } from "lucide-react";

import {
  ELogisticsPrimaryService,
  type ELogisticsPrimaryService as PrimaryService,
} from "@/types/logisticsQuote.types";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { buildServiceDetailsOnPrimaryServiceChange } from "../helpers";
import { IconCardSelector, type IconCardOption } from "../components/IconCardSelector";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";

const SERVICES: readonly IconCardOption<PrimaryService>[] = [
  {
    value: ELogisticsPrimaryService.FTL,
    label: "Full Truckload",
    icon: Truck,
  },
  {
    value: ELogisticsPrimaryService.LTL,
    label: "LTL Freight",
    icon: Boxes,
  },
  {
    value: ELogisticsPrimaryService.INTERNATIONAL,
    label: "International",
    icon: Globe2,
  },
  {
    value: ELogisticsPrimaryService.WAREHOUSING,
    label: "Warehousing",
    icon: Warehouse,
  },
];

export function ServiceSelectionSection() {
  const {
    control,
    getValues,
    clearErrors,
    reset,
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

    trackCtaClick({
      ctaId: "quote_service_selected",
      location: "logistics_quote_form_service_selection",
      label: toCtaSlug(String(next)),
    });

    const nextDefaults = buildServiceDetailsOnPrimaryServiceChange(next);
    const allValues = getValues();

    reset(
      {
        ...allValues,
        serviceDetails: nextDefaults as any,
      },
      {
        keepErrors: false,
        keepDirty: true,
        keepTouched: true,
        keepSubmitCount: true,
      },
    );

    clearErrors("serviceDetails" as any);
  }

  return (
    <section
      data-field-path="serviceDetails.primaryService"
      aria-invalid={Boolean(serviceError)}
      aria-describedby="serviceDetails.primaryService-error"
    >
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-[color:var(--color-text-light)]">
          Select a service
        </h2>

        <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
          Pick the primary service. We’ll show only the fields that apply.
        </p>

        {serviceError ? (
          <div
            id="serviceDetails.primaryService-error"
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{serviceError}</div>
          </div>
        ) : null}
      </div>

      <IconCardSelector<PrimaryService>
        options={SERVICES}
        value={current as PrimaryService | undefined}
        onChange={selectService}
        invalid={Boolean(serviceError)}
        errorId="serviceDetails.primaryService-error"
        name="serviceDetails.primaryService"
        variant="primary"
        columnsClassName="grid-cols-2 gap-3 md:grid-cols-4"
        animateItems
        staggerDelay={0.03}
      />
    </section>
  );
}
