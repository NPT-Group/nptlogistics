// src/app/(site)/components/forms/LogisticsQuoteForm/index.tsx
// src/app/(site)/components/forms/LogisticsQuoteForm/index.tsx
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
  EInternationalMode,
  ELogisticsPrimaryService,
  EOceanLoadType,
} from "@/types/logisticsQuote.types";

import { logisticsQuoteSubmitSchema, type LogisticsQuoteSubmitValues } from "./schema";
import { LOGISTICS_QUOTE_SUBMIT_DEFAULTS } from "./defaults";
import {
  focusFirstError,
  toApiSubmitBody,
  resetFtlAddonsOnEquipmentChange,
  resetLtlAddonsOnEquipmentChange,
  LOGISTICS_FORM_ERROR_FOCUS_OPTIONS,
} from "./helpers";

import { ServiceSelectionSection } from "./sections/ServiceSelectionSection";
import { ServiceConfigurationSection } from "./sections/ServiceConfigurationSection";
import { IdentificationSection } from "./sections/IdentificationSection";
import { ContactSection } from "./sections/ContactSection";
import { SubmitSection } from "./sections/SubmitSection";
import { Divider } from "../components/Divider";
import { NotesAttachmentsSection } from "./sections/NotesAttachmentsSection";
import { TurnstileWidgetHandle } from "@/components/TurnstileWidget";
import {
  FeedbackBanner,
  type FeedbackBannerData,
} from "@/app/(site)/components/forms/components/FeedbackBanner";
import { FormCardShell } from "../components/FormCardShell";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";

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
  });

  const prevEquipmentRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (
      primaryService !== ELogisticsPrimaryService.FTL &&
      primaryService !== ELogisticsPrimaryService.LTL
    ) {
      prevEquipmentRef.current = undefined;
      return;
    }

    if (!equipment || typeof equipment !== "string") {
      prevEquipmentRef.current = undefined;
      return;
    }

    const prev = prevEquipmentRef.current;

    if (!prev) {
      prevEquipmentRef.current = equipment;
      return;
    }

    if (equipment !== prev) {
      const nextAddons =
        primaryService === ELogisticsPrimaryService.FTL
          ? resetFtlAddonsOnEquipmentChange()
          : resetLtlAddonsOnEquipmentChange();

      setValue("serviceDetails.addons" as never, nextAddons as never, {
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
  const resolver = zodResolver(
    logisticsQuoteSubmitSchema,
  ) as unknown as Resolver<LogisticsQuoteSubmitValues>;

  const methods = useForm<LogisticsQuoteSubmitValues>({
    resolver,
    defaultValues: LOGISTICS_QUOTE_SUBMIT_DEFAULTS,
    shouldUnregister: false,
    shouldFocusError: false,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { handleSubmit, register, setValue, reset } = methods;

  const [feedback, setFeedback] = React.useState<FeedbackBannerData | null>(null);

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const feedbackRef = React.useRef<HTMLDivElement | null>(null);
  const turnstileRef = React.useRef<TurnstileWidgetHandle | null>(null);

  const scrollToTopArea = React.useCallback(() => {
    const target = feedbackRef.current ?? cardRef.current;
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });

    window.setTimeout(() => {
      target.focus?.();
    }, 250);
  }, []);

  const onSubmit: SubmitHandler<LogisticsQuoteSubmitValues> = async (values) => {
    setFeedback(null);

    try {
      const normalizedValues = structuredClone(values) as LogisticsQuoteSubmitValues;

      if (normalizedValues.serviceDetails?.primaryService === ELogisticsPrimaryService.LTL) {
        const total = (normalizedValues.serviceDetails.cargoLines ?? []).reduce((sum, line) => {
          const quantity = Number(line?.quantity ?? 0);
          const weightPerUnit = Number(line?.weightPerUnit ?? 0);
          return sum + quantity * weightPerUnit;
        }, 0);

        normalizedValues.serviceDetails.approximateTotalWeight = total;
      }

      if (
        normalizedValues.serviceDetails?.primaryService ===
          ELogisticsPrimaryService.INTERNATIONAL &&
        normalizedValues.serviceDetails.mode === EInternationalMode.AIR
      ) {
        const total = (normalizedValues.serviceDetails.cargoLines ?? []).reduce((sum, line) => {
          const quantity = Number(line?.quantity ?? 0);
          const weightPerUnit = Number(line?.weightPerUnit ?? 0);
          return sum + quantity * weightPerUnit;
        }, 0);

        normalizedValues.serviceDetails.approximateTotalWeight = total;
      }

      if (
        normalizedValues.serviceDetails?.primaryService ===
          ELogisticsPrimaryService.INTERNATIONAL &&
        normalizedValues.serviceDetails.mode === EInternationalMode.OCEAN &&
        normalizedValues.serviceDetails.oceanLoadType === EOceanLoadType.LCL
      ) {
        const total = (normalizedValues.serviceDetails.cargoLines ?? []).reduce((sum, line) => {
          const quantity = Number(line?.quantity ?? 0);
          const weightPerUnit = Number(line?.weightPerUnit ?? 0);
          return sum + quantity * weightPerUnit;
        }, 0);

        normalizedValues.serviceDetails.approximateTotalWeight = total;
      }

      const body = toApiSubmitBody(normalizedValues);

      const res = await fetch("/api/v1/quotes/logistics/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          json?.message ||
          json?.error?.message ||
          "Something went wrong while submitting your quote request. Please try again.";
        throw new Error(msg);
      }

      trackCtaClick({
        ctaId: "logistics_quote_submit_success",
        location: "logistics_quote_form",
        destination: "/api/v1/quotes/logistics/submit",
        label: [
          normalizedValues.serviceDetails?.primaryService,
          normalizedValues.serviceDetails?.primaryService === ELogisticsPrimaryService.INTERNATIONAL
            ? normalizedValues.serviceDetails?.mode
            : undefined,
          normalizedValues.serviceDetails?.primaryService ===
            ELogisticsPrimaryService.INTERNATIONAL &&
          normalizedValues.serviceDetails?.mode === EInternationalMode.OCEAN
            ? normalizedValues.serviceDetails?.oceanLoadType
            : undefined,
          normalizedValues.identification?.identity,
          normalizedValues.identification?.brokerType,
        ]
          .filter(Boolean)
          .map((value) => toCtaSlug(String(value)))
          .join("|"),
      });
      reset(LOGISTICS_QUOTE_SUBMIT_DEFAULTS);
      turnstileRef.current?.reset();

      const referenceId =
        typeof json?.data?.quote?.quoteId === "string"
          ? json.data.quote.quoteId
          : typeof json?.quote?.quoteId === "string"
            ? json.quote.quoteId
            : undefined;

      setFeedback({
        tone: "success",
        title: "Quote request submitted",
        message:
          "Thank you. Your quote request has been received. Please keep the reference ID below for any follow-up. Our team will review the details and contact you as soon as possible.",
        meta: referenceId
          ? [
              {
                label: "Reference ID",
                value: referenceId,
                emphasis: "code",
              },
            ]
          : undefined,
      });

      window.requestAnimationFrame(() => {
        scrollToTopArea();
      });
    } catch (err) {
      trackCtaClick({
        ctaId: "logistics_quote_submit_error",
        location: "logistics_quote_form",
        destination: "/api/v1/quotes/logistics/submit",
        label: err instanceof Error && err.message ? err.message.slice(0, 120) : "submission_error",
      });
      setFeedback({
        tone: "error",
        title: "Unable to submit quote request",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong while submitting your quote request. Please try again.",
      });

      turnstileRef.current?.reset();
      setValue("turnstileToken", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      window.requestAnimationFrame(() => {
        scrollToTopArea();
      });
    }
  };

  const onInvalid = (errors: typeof methods.formState.errors) => {
    setFeedback(null);
    focusFirstError(errors, LOGISTICS_FORM_ERROR_FOCUS_OPTIONS);
  };

  return (
    <FormProvider {...methods}>
      <input type="hidden" {...register("turnstileToken")} />

      <ServiceResetEffects control={methods.control} setValue={setValue} />

      <FormCardShell>
        <div ref={cardRef} tabIndex={-1}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-7 bg-white/95 px-5 pt-7 pb-7 sm:px-7 lg:px-8"
          >
            <FeedbackBanner feedback={feedback} innerRef={feedbackRef} />

            <ServiceSelectionSection />
            <ServiceConfigurationSection />
            <Divider />
            <IdentificationSection />
            <Divider />
            <ContactSection />
            <Divider />
            <NotesAttachmentsSection />
            <SubmitSection turnstileRef={turnstileRef} />
          </form>
        </div>
      </FormCardShell>
    </FormProvider>
  );
}
