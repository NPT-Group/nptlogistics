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
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
            <MessageSquareText className="h-4 w-4" />
            Final notes
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Optional. Add any constraints, special handling instructions, or timing details.
          </p>
        </div>

        <div className="text-xs text-neutral-500 tabular-nums">
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
          placeholder:
            "e.g., loading dock hours, pickup contact, access restrictions, handling notes…",
          maxLength: MAX_NOTES,
        }}
      />
    </section>
  );
}
