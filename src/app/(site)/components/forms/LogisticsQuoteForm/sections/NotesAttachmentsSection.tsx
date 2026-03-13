// src/app/(site)/components/forms/LogisticsQuoteForm/sections/NotesAttachmentsSection.tsx
"use client";

import { useFormContext } from "react-hook-form";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { TextAreaField } from "@/components/forms/fields/TextAreaField";
import { FileUploadField } from "@/components/forms/fields/FileUploadField";

import {
  siteTextareaUi,
  siteFileButtonUi,
} from "@/app/(site)/components/forms/presets/siteFieldUi";

import { ES3Folder, ES3Namespace } from "@/types/aws.types";
import { EFileMimeType } from "@/types/shared.types";

const MAX_NOTES = 6000;
const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const ALLOWED_MIME_TYPES: readonly EFileMimeType[] = Object.values(EFileMimeType);

export function NotesAttachmentsSection() {
  const { control } = useFormContext<LogisticsQuoteSubmitValues>();

  return (
    <section className="space-y-5">
      <div className="space-y-5">
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">Notes</h4>

          <TextAreaField<LogisticsQuoteSubmitValues>
            control={control}
            name="finalNotes"
            fieldPathAttr="finalNotes"
            ui={siteTextareaUi}
            textareaProps={{
              placeholder:
                "Dock hours, pickup contact, access restrictions, delivery notes, special handling...",
              maxLength: MAX_NOTES,
              rows: 5,
            }}
          />
        </section>

        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-[color:var(--color-text-light)]">
            Supporting files
          </h4>

          <p className="text-sm text-[color:var(--color-muted-light)]">
            Optional. Up to {MAX_FILES} files, max {MAX_SIZE_MB}MB each.
          </p>

          <FileUploadField<LogisticsQuoteSubmitValues>
            control={control}
            name="attachments"
            fieldPathAttr="attachments"
            ui={siteFileButtonUi}
            multiple
            maxFiles={MAX_FILES}
            maxSizeMB={MAX_SIZE_MB}
            allowedMimeTypes={ALLOWED_MIME_TYPES}
            namespace={ES3Namespace.QUOTES}
            folder={ES3Folder.ATTACHMENTS}
            allowRemove
            allowRemoveAll
            uploadLabel="Upload files"
            addMoreLabel="Add files"
            removeLabel="Remove"
            removeAllLabel="Clear all"
            emptyState={{ show: false }}
          />
        </section>
      </div>
    </section>
  );
}
