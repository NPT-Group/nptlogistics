// src/app/(site)/components/LogisticsQuoteForm/sections/AttachmentsSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Paperclip } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";
import { siteFileButtonUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

import { ES3Folder, ES3Namespace } from "@/types/aws.types";
import { EFileMimeType } from "@/types/shared.types";

import { FileUploadField } from "@/components/forms/fields/FileUploadField";

const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const ALLOWED_MIME_TYPES: readonly EFileMimeType[] = Object.values(EFileMimeType);

export function AttachmentsSection() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<LogisticsQuoteSubmitValues>();

  const attachments = watch("attachments") ?? [];
  const count = attachments.length;

  const rhfError = (errors.attachments as any)?.message;

  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--color-text-light)]">
            Attachments
          </h3>
          <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
            Optional. Upload up to {MAX_FILES} files (max {MAX_SIZE_MB}MB each).
          </p>
        </div>

        <div className="hidden items-center gap-2 text-xs text-[color:var(--color-subtle-light)] sm:flex">
          <Paperclip className="h-4 w-4 text-[color:var(--color-text-light)]" />
          <span className="tabular-nums">
            {count}/{MAX_FILES}
          </span>
        </div>
      </div>

      <div data-field-path="attachments" className="space-y-3">
        <FileUploadField<LogisticsQuoteSubmitValues>
          control={control}
          name={"attachments"}
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
        />

        {rhfError ? (
          <p role="alert" className={siteFileButtonUi.error}>
            {String(rhfError)}
          </p>
        ) : null}

        {count === 0 ? (
          <div
            className={[
              "rounded-2xl border border-dashed p-4 text-sm",
              "border-[color:var(--color-border-light)]",
              "bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent_60%)]",
              "text-[color:var(--color-muted-light)]",
            ].join(" ")}
          >
            No files uploaded yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
