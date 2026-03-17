// src/app/(site)/components/forms/ContactForm/index.tsx
"use client";

import * as React from "react";
import { FormProvider, useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { contactFormSubmitSchema, type ContactFormSubmitValues } from "./schema";
import { CONTACT_FORM_SUBMIT_DEFAULTS } from "./defaults";
import { focusFirstError, toApiSubmitBody, CONTACT_FORM_ERROR_FOCUS_OPTIONS } from "./helpers";

import {
  FeedbackBanner,
  type FeedbackBannerData,
} from "@/app/(site)/components/forms/components/FeedbackBanner";
import { FormCardShell } from "../components/FormCardShell";
import { Divider } from "../components/Divider";
import { DepartmentSelector } from "./components/DepartmentSelector";
import { InquirySectionRouter } from "./components/InquirySectionRouter";
import { SubmitSection } from "./sections/SubmitSection";
import { TurnstileWidgetHandle } from "@/components/TurnstileWidget";
import { toCtaSlug, trackCtaClick } from "@/lib/analytics/cta";
import { NAV_OFFSET } from "@/constants/ui";

export default function ContactForm() {
  const resolver = zodResolver(
    contactFormSubmitSchema,
  ) as unknown as Resolver<ContactFormSubmitValues>;

  const methods = useForm<ContactFormSubmitValues>({
    resolver,
    defaultValues: CONTACT_FORM_SUBMIT_DEFAULTS,
    shouldUnregister: false,
    shouldFocusError: false,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { handleSubmit, register, reset, setValue } = methods;

  const [feedback, setFeedback] = React.useState<FeedbackBannerData | null>(null);

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const feedbackRef = React.useRef<HTMLDivElement | null>(null);
  const turnstileRef = React.useRef<TurnstileWidgetHandle | null>(null);

  const scrollToTopArea = React.useCallback(() => {
    const target = feedbackRef.current ?? cardRef.current;
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - (NAV_OFFSET + 24);

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    });

    window.setTimeout(() => {
      target.focus?.({ preventScroll: true });
    }, 350);
  }, []);

  React.useEffect(() => {
    if (!feedback) return;

    const id = window.setTimeout(() => {
      scrollToTopArea();
    }, 0);

    return () => window.clearTimeout(id);
  }, [feedback, scrollToTopArea]);

  const onSubmit: SubmitHandler<ContactFormSubmitValues> = async (values) => {
    setFeedback(null);

    try {
      const body = toApiSubmitBody(values);
      const category = body.inquiry?.category;

      const res = await fetch("/api/v1/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          json?.message ||
          json?.error?.message ||
          "Something went wrong while submitting your inquiry. Please try again.";
        throw new Error(msg);
      }

      trackCtaClick({
        ctaId: "contact_form_submit_success",
        location: "contact_form",
        destination: "/api/v1/contact/submit",
        label: category ? toCtaSlug(String(category)) : "unknown_category",
      });

      reset(CONTACT_FORM_SUBMIT_DEFAULTS);
      turnstileRef.current?.reset();

      const referenceId =
        typeof json?.data?.inquiry?.inquiryId === "string"
          ? json.data.inquiry.inquiryId
          : typeof json?.inquiry?.inquiryId === "string"
            ? json.inquiry.inquiryId
            : undefined;

      setFeedback({
        tone: "success",
        title: "Inquiry submitted",
        message:
          "Thank you. Your inquiry has been received. Please keep the reference ID below for any follow-up. Our team will review your message and get back to you as soon as possible.",
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
    } catch (err) {
      trackCtaClick({
        ctaId: "contact_form_submit_error",
        location: "contact_form",
        destination: "/api/v1/contact/submit",
        label:
          values.inquiry?.category != null
            ? toCtaSlug(String(values.inquiry.category))
            : "unknown_category",
      });

      setFeedback({
        tone: "error",
        title: "Unable to submit inquiry",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong while submitting your inquiry. Please try again.",
      });

      turnstileRef.current?.reset();
      setValue("turnstileToken", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const onInvalid = (errors: typeof methods.formState.errors) => {
    setFeedback(null);
    focusFirstError(errors, CONTACT_FORM_ERROR_FOCUS_OPTIONS);
  };

  const handleDepartmentChange = React.useCallback(() => {
    setFeedback(null);
  }, []);

  return (
    <FormProvider {...methods}>
      <input type="hidden" {...register("turnstileToken")} />

      <div ref={cardRef} className="space-y-5">
        <DepartmentSelector onDepartmentChange={handleDepartmentChange} />

        <FormCardShell>
          <div tabIndex={-1}>
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="space-y-7 bg-white/95 px-5 pt-6 pb-7 sm:px-7 lg:px-8"
            >
              <FeedbackBanner feedback={feedback} innerRef={feedbackRef} />

              <InquirySectionRouter />
              <Divider />
              <SubmitSection turnstileRef={turnstileRef} />
            </form>
          </div>
        </FormCardShell>
      </div>
    </FormProvider>
  );
}
