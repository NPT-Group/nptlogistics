// src/app/(site)/components/LogisticsQuoteForm/index.tsx
"use client";

import * as React from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type Control,
  type UseFormSetValue,
  type SubmitHandler,
  type Resolver,
} from "react-hook-form";
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

function ServiceResetEffects({
  control,
  setValue,
}: {
  control: Control<LogisticsQuoteSubmitValues>;
  setValue: UseFormSetValue<LogisticsQuoteSubmitValues>;
}) {
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
    if (primaryService !== ELogisticsPrimaryService.FTL) {
      prevEquipmentRef.current = undefined;
      return;
    }
    if (!equipment) {
      prevEquipmentRef.current = undefined;
      return;
    }

    const prev = prevEquipmentRef.current;

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

function SectionDivider() {
  return (
    <div className="py-2">
      <div
        className={[
          "mx-auto h-px w-[88%]",
          // thin edges, clearer in the center
          "bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.16),rgba(15,23,42,0.22),rgba(15,23,42,0.16),transparent)]",
        ].join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}

export default function LogisticsQuoteForm() {
  const resolver = zodResolver(
    logisticsQuoteSubmitSchema,
  ) as unknown as Resolver<LogisticsQuoteSubmitValues>;

  const methods = useForm<LogisticsQuoteSubmitValues>({
    resolver,
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

  const onSubmit: SubmitHandler<LogisticsQuoteSubmitValues> = async (values) => {
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

    reset(LOGISTICS_QUOTE_SUBMIT_DEFAULTS);
  };

  const onInvalid = () => {
    focusFirstError(errors);
  };

  return (
    <FormProvider {...methods}>
      <input type="hidden" {...register("turnstileToken")} />

      <ServiceResetEffects control={methods.control} setValue={setValue} />

      {/* White form card */}
      <div
        className={[
          "rounded-3xl bg-white shadow-sm",
          "border border-[color:var(--color-border-light)]",
        ].join(" ")}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6 px-5 py-6 sm:px-7 sm:py-7"
        >
          <ServiceSelectionSection />

          <SectionDivider />

          <ServiceConfigurationSection />

          <SectionDivider />

          <IdentificationSection />

          <SectionDivider />

          <ContactSection />

          <SectionDivider />

          <FinalNotesSection />

          <AttachmentsSection />

          <SectionDivider />

          <SubmitSection />
        </form>
      </div>
    </FormProvider>
  );
}
