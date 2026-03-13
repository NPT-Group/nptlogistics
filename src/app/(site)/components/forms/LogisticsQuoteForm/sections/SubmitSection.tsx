// src/app/(site)/components/forms/LogisticsQuoteForm/sections/SubmitSection.tsx
"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Send, AlertCircle } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import TurnstileWidget, { type TurnstileWidgetHandle } from "@/components/TurnstileWidget";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { siteCheckUi } from "@/app/(site)/components/forms/presets/siteFieldUi";
import { cn } from "@/lib/cn";

type SubmitSectionProps = {
  turnstileRef: React.RefObject<TurnstileWidgetHandle | null>;
};

export function SubmitSection({ turnstileRef }: SubmitSectionProps) {
  const {
    control,
    setValue,
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

      <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              "border border-neutral-300 bg-white text-neutral-500",
            )}
          >
            <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
          </span>

          <div className="min-w-0">
            <div className="text-sm leading-5 font-medium text-[color:var(--color-text-light)]">
              Your privacy matters
            </div>

            <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
              We use your information to review and respond to your inquiry. We do not sell your
              personal information or share it with third parties for their own marketing purposes.
            </p>

            <Link
              href="/privacy"
              target="_blank"
              className={cn(
                "mt-3 inline-flex items-center text-sm font-medium underline underline-offset-4 transition",
                "text-[color:var(--color-text-light)] hover:text-neutral-700",
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
            ref={turnstileRef}
            variant="bare"
            action="logistics-quote-submit"
            fieldPathAttr="turnstileToken"
            invalid={turnstileInvalid}
            errorMessage={turnstileError}
            onToken={(token) => {
              setValue("turnstileToken", token, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
            onError={() => {
              setValue("turnstileToken", "", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white",
            "bg-[color:var(--color-brand-600)] hover:cursor-pointer hover:bg-[color:var(--color-brand-700)]",
            "shadow-[0_10px_28px_rgba(220,38,38,0.35)] transition focus:ring-2 focus:ring-[color:var(--color-brand-500)]/45 focus:outline-none",
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
