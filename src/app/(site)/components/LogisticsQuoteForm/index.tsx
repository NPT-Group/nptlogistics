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
import { CheckCircle2, AlertCircle } from "lucide-react";

import {
  ELogisticsPrimaryService,
  type EFTLEquipmentType,
  type EFTLAddon,
} from "@/types/logisticsQuote.types";

import { logisticsQuoteSubmitSchema, type LogisticsQuoteSubmitValues } from "./schema";
import { LOGISTICS_QUOTE_SUBMIT_DEFAULTS } from "./defaults";
import {
  focusFirstError,
  toApiSubmitBody,
  resetFtlAddonsOnEquipmentChange,
  LOGISTICS_FORM_ERROR_FOCUS_OPTIONS,
} from "./helpers";

import { ServiceSelectionSection } from "./sections/ServiceSelectionSection";
import { ServiceConfigurationSection } from "./sections/ServiceConfigurationSection";
import { IdentificationSection } from "./sections/IdentificationSection";
import { ContactSection } from "./sections/ContactSection";
import { SubmitSection } from "./sections/SubmitSection";
import { Divider } from "./components/Divider";
import { NotesAttachmentsSection } from "./sections/NotesAttachmentsSection";
import { cn } from "@/lib/cn";

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

type SubmitFeedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function FeedbackBanner({
  feedback,
  innerRef,
}: {
  feedback: SubmitFeedback;
  innerRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!feedback) return null;

  const isSuccess = feedback.type === "success";

  return (
    <div
      ref={innerRef}
      tabIndex={-1}
      aria-live="polite"
      className={cn(
        "rounded-2xl border px-4 py-4 sm:px-5",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-red-200 bg-red-50 text-red-950",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
            isSuccess
              ? "border-emerald-200 bg-white text-emerald-700"
              : "border-red-200 bg-white text-red-700",
          )}
        >
          {isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {isSuccess ? "Quote request submitted" : "Unable to submit quote request"}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{feedback.message}</p>
        </div>
      </div>
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
    shouldUnregister: false,
    shouldFocusError: false,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, register, setValue, reset } = methods;

  const [submitFeedback, setSubmitFeedback] = React.useState<SubmitFeedback>(null);

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const feedbackRef = React.useRef<HTMLDivElement | null>(null);

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
    setSubmitFeedback(null);

    try {
      if (values.serviceDetails?.primaryService === ELogisticsPrimaryService.LTL) {
        const lines = values.serviceDetails.palletLines ?? [];

        const total = lines.reduce((sum, line) => {
          const q = Number(line?.quantity ?? 0);
          const w = Number(line?.weightValue ?? 0);
          return sum + q * w;
        }, 0);

        values.serviceDetails.approximateTotalWeight.value = total;
      }

      const body = toApiSubmitBody(values);

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

      reset(LOGISTICS_QUOTE_SUBMIT_DEFAULTS);

      setSubmitFeedback({
        type: "success",
        message:
          "Thank you. Your quote request has been received successfully. Our team will review the details and contact you as soon as possible.",
      });

      window.requestAnimationFrame(() => {
        scrollToTopArea();
      });
    } catch (err) {
      setSubmitFeedback({
        type: "error",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong while submitting your quote request. Please try again.",
      });

      window.requestAnimationFrame(() => {
        scrollToTopArea();
      });
    }
  };

  const onInvalid = (errors: typeof methods.formState.errors) => {
    setSubmitFeedback(null);
    focusFirstError(errors, LOGISTICS_FORM_ERROR_FOCUS_OPTIONS);
  };

  return (
    <FormProvider {...methods}>
      <input type="hidden" {...register("turnstileToken")} />

      <ServiceResetEffects control={methods.control} setValue={setValue} />

      <div
        ref={cardRef}
        tabIndex={-1}
        className={cn(
          "relative mx-auto w-full overflow-hidden",
          "rounded-3xl border border-[color:var(--color-border-light)] bg-white/95",
          "shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-[linear-gradient(90deg,rgba(220,38,38,0.85),rgba(30,64,175,0.9))]",
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-7 px-5 pt-7 pb-7 sm:px-7 lg:px-8"
        >
          <FeedbackBanner feedback={submitFeedback} innerRef={feedbackRef} />

          <ServiceSelectionSection />

          <ServiceConfigurationSection />

          <Divider />

          <IdentificationSection />

          <Divider />

          <ContactSection />

          <Divider />

          <NotesAttachmentsSection />

          <SubmitSection />
        </form>
      </div>
    </FormProvider>
  );
}
