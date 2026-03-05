// src/app/(site)/components/LogisticsQuoteForm/sections/FinalNotesSection.tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { MessageSquareText } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { siteTextareaUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

const MAX_NOTES = 6000;

export function FinalNotesSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  const notes = useWatch({ control, name: "finalNotes" }) ?? "";
  const len = typeof notes === "string" ? notes.length : 0;

  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[color:var(--color-text-light)]">
            <MessageSquareText className="h-4 w-4 text-[color:var(--color-brand-700)]" />
            Final notes
          </h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Optional. Add constraints, special handling, or timing details.
          </p>
        </div>

        <div
          className={[
            "mt-0.5 rounded-full px-2 py-1 text-xs tabular-nums",
            "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]",
          ].join(" ")}
        >
          {len}/{MAX_NOTES}
        </div>
      </div>

      <TextAreaField<LogisticsQuoteSubmitValues>
        control={control}
        name="finalNotes"
        label="Notes"
        ui={siteTextareaUi}
        hint={`Max ${MAX_NOTES} characters.`}
        textareaProps={{
          placeholder: "e.g., dock hours, pickup contact, access restrictions, handling notes…",
          maxLength: MAX_NOTES,
        }}
      />
    </section>
  );
}
