// src/app/(site)/components/LogisticsQuoteForm/sections/SubmitSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { ShieldCheck, Send } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import TurnstileWidget from "@/components/TurnstileWidget";

export function SubmitSection() {
  const {
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<LogisticsQuoteSubmitValues>();

  const turnstileError = errors.turnstileToken?.message;
  const turnstileInvalid = Boolean(turnstileError);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
          <ShieldCheck className="h-4 w-4" />
          Submit request
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Complete verification, then submit your quote request.
        </p>
      </div>

      <div className="space-y-4">
        <TurnstileWidget
          action="logistics-quote-submit"
          fieldPathAttr="turnstileToken"
          label="Verification"
          hint="This helps us prevent spam submissions."
          invalid={turnstileInvalid}
          errorMessage={turnstileError}
          onToken={(token) => {
            // Keep RHF as the single source of truth
            setValue("turnstileToken", token, { shouldDirty: true, shouldTouch: true });
            // If user completes captcha, re-validate just this field so error clears immediately
            void trigger("turnstileToken");
          }}
          onError={() => {
            // Ensure RHF sees it as empty/invalid if widget errors
            setValue("turnstileToken", "", { shouldDirty: true, shouldTouch: true });
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-neutral-500">
            By submitting, you agree we may contact you about this request.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white",
              "transition hover:opacity-90 focus:ring-2 focus:ring-black/20 focus:outline-none",
              isSubmitting ? "opacity-70" : "",
            ].join(" ")}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting…" : "Submit quote request"}
          </button>
        </div>

        {/* Optional: a subtle helper if the form isn't valid yet (no blocking, just guidance). */}
        {!isSubmitting && !isValid ? (
          <div className="text-xs text-neutral-500">
            Please review required fields above before submitting.
          </div>
        ) : null}
      </div>
    </section>
  );
}
