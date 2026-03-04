// src/app/(site)/components/LogisticsQuoteForm/index.tsx
"use client";

import * as React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ELogisticsPrimaryService,
  type EFTLEquipmentType,
  type EFTLAddon,
} from "@/types/logisticsQuote.types";

import { logisticsQuoteSubmitSchema, type LogisticsQuoteSubmitValues } from "./schema";

import { LOGISTICS_QUOTE_SUBMIT_DEFAULTS } from "./defaults";
import { focusFirstError, toApiSubmitBody, resetFtlAddonsOnEquipmentChange } from "./helpers";

import { ServiceSelectionSection } from "./sections/ServiceSelectionSection";
import { ServiceConfigurationSection } from "./sections/ServiceConfigurationSection";
import { IdentificationSection } from "./sections/IdentificationSection";
import { ContactSection } from "./sections/ContactSection";
import { AttachmentsSection } from "./sections/AttachmentsSection";
import { FinalNotesSection } from "./sections/FinalNotesSection";
import { SubmitSection } from "./sections/SubmitSection";

/**
 * Reset logic effects (must obey the guidelines strictly):
 * - When Primary Service changes:
 *   ServiceSelectionSection replaces entire serviceDetails subtree.
 * - When Equipment changes (FTL only):
 *   Reset ONLY serviceDetails.addons
 *   Do NOT reset shipment inputs.
 */
function ServiceResetEffects({ control, setValue }: { control: any; setValue: any }) {
  // serviceDetails is optional now
  const primaryService = useWatch({
    control,
    name: "serviceDetails.primaryService",
  }) as ELogisticsPrimaryService | undefined;

  const equipment = useWatch({
    control,
    name: "serviceDetails.equipment",
  }) as EFTLEquipmentType | undefined;

  const prevEquipmentRef = React.useRef<EFTLEquipmentType | undefined>(undefined);

  React.useEffect(() => {
    // Only applies to FTL with equipment selected
    if (primaryService !== ELogisticsPrimaryService.FTL) {
      prevEquipmentRef.current = undefined;
      return;
    }

    if (!equipment) {
      prevEquipmentRef.current = undefined;
      return;
    }

    const prev = prevEquipmentRef.current;

    // first time selecting equipment should NOT force reset (addons already default [])
    if (!prev) {
      prevEquipmentRef.current = equipment;
      return;
    }

    if (equipment !== prev) {
      const nextAddons = resetFtlAddonsOnEquipmentChange() as EFTLAddon[];

      setValue("serviceDetails.addons", nextAddons as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    prevEquipmentRef.current = equipment;
  }, [equipment, primaryService, setValue]);

  return null;
}

export default function LogisticsQuoteForm() {
  const methods = useForm<LogisticsQuoteSubmitValues>({
    resolver: zodResolver(logisticsQuoteSubmitSchema),
    defaultValues: LOGISTICS_QUOTE_SUBMIT_DEFAULTS,
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  async function onSubmit(values: LogisticsQuoteSubmitValues) {
    const body = toApiSubmitBody(values);

    const res = await fetch("/api/v1/quotes/logistics/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json?.message || json?.error?.message || "Failed to submit quote.";
      throw new Error(msg);
    }

    // success: reset entire form to initial blank (no service selected)
    reset(LOGISTICS_QUOTE_SUBMIT_DEFAULTS);
  }

  function onInvalid() {
    focusFirstError(errors);
  }

  return (
    <FormProvider {...methods}>
      {/* Ensure turnstileToken is registered in RHF even though TurnstileWidget writes via setValue */}
      <input type="hidden" {...register("turnstileToken")} />

      {/* Reset effects (equipment => reset only addons) */}
      <ServiceResetEffects control={methods.control} setValue={setValue} />

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        {/* Always visible */}
        <ServiceSelectionSection />

        {/* Dynamic (animated) */}
        <ServiceConfigurationSection />

        <div className="border-t border-neutral-200" />

        {/* Stable sections */}
        <IdentificationSection />
        <ContactSection />
        <AttachmentsSection />
        <FinalNotesSection />

        <SubmitSection />
      </form>
    </FormProvider>
  );
}
