// src/app/(site)/components/LogisticsQuoteForm/sections/SubmitSection.tsx
"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Send, AlertCircle } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import TurnstileWidget from "@/components/TurnstileWidget";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

export function SubmitSection() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useFormContext<LogisticsQuoteSubmitValues>();

  const turnstileError = errors.turnstileToken?.message;
  const turnstileInvalid = Boolean(turnstileError);

  return (
    <section className="space-y-5">
      {/* Consent (full width, left aligned by default) */}
      <CheckboxField<LogisticsQuoteSubmitValues>
        control={control}
        name="marketingEmailConsent"
        ui={siteCheckUi}
        fieldPathAttr="marketingEmailConsent"
        label={
          <span className="text-sm font-medium text-[color:var(--color-text-light)]">
            I agree to receive marketing communications from NPT Logistics
          </span>
        }
        hint="Optional. You can unsubscribe anytime using the link in our emails."
      />

      {/* Privacy Block (full width, left aligned) */}
      <div
        className={[
          "w-full rounded-2xl border p-4 sm:p-5",
          "border-[color:var(--color-border-light)]",
          "bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent_55%)]",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]",
            ].join(" ")}
          >
            <AlertCircle className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
              Your privacy is protected
            </div>

            <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
              We use your information to prepare your quote and support your request. We don’t sell
              your personal data or share it with third parties for their marketing purposes.
            </p>

            <Link
              href="/privacy"
              className="mt-2 inline-block text-sm font-medium text-[color:var(--color-brand-700)] underline underline-offset-4 hover:text-[color:var(--color-brand-600)]"
            >
              Read our Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Turnstile verification (minimal, centered, no wrapper chrome) */}
      <div className="flex justify-center">
        <TurnstileWidget
          variant="bare"
          action="logistics-quote-submit"
          fieldPathAttr="turnstileToken"
          invalid={turnstileInvalid}
          errorMessage={turnstileError}
          onToken={(token) => {
            setValue("turnstileToken", token, { shouldDirty: true, shouldTouch: true });
            void trigger("turnstileToken");
          }}
          onError={() => {
            setValue("turnstileToken", "", { shouldDirty: true, shouldTouch: true });
          }}
        />
      </div>

      {/* Submit (red primary) */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white",
            "bg-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-700)]",
            "transition focus:ring-2 focus:ring-[color:var(--color-brand-600)]/25 focus:outline-none",
            isSubmitting ? "opacity-70" : "",
          ].join(" ")}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting…" : "Submit quote request"}
        </button>
      </div>
    </section>
  );
}
