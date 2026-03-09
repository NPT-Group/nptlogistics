// src/app/(site)/components/LogisticsQuoteForm/sections/SubmitSection.tsx
"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Send, AlertCircle } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import TurnstileWidget from "@/components/TurnstileWidget";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

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

      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_55%)]"
        />

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-100",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]",
          )}
        />

        <div className="relative flex items-start gap-2 sm:gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border sm:h-10 sm:w-10",
              "border-neutral-200 bg-neutral-50 text-neutral-700",
            )}
          >
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
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
              target="_blank"
              className={cn(
                "mt-2 inline-flex items-center text-sm font-medium underline underline-offset-4 transition",
                "text-black hover:text-neutral-700",
              )}
            >
              Read our Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-1">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white",
            "bg-black hover:cursor-pointer hover:bg-neutral-800",
            "transition focus:ring-2 focus:ring-black/15 focus:outline-none",
            isSubmitting && "opacity-70",
          )}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting…" : "Submit quote request"}
        </button>
      </div>
    </section>
  );
}
