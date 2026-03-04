// src/app/(site)/components/LogisticsQuoteForm/sections/AttachmentsSection.tsx
"use client";

import * as React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Paperclip, Trash2, UploadCloud } from "lucide-react";

import type { LogisticsQuoteSubmitValues } from "../schema";

import { cn } from "@/lib/utils/cn";
import { siteFileButtonUi } from "@/app/(site)/components/forms/presets/siteFieldUi";

import { ES3Folder, ES3Namespace } from "@/types/aws.types";
import { EFileMimeType, type IFileAsset } from "@/types/shared.types";
import { uploadToS3PresignedPublic, deleteTempFile } from "@/lib/utils/s3Helper/client";

const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const ALLOWED_MIME_TYPES: readonly EFileMimeType[] = Object.values(EFileMimeType);

function formatBytes(n?: number) {
  if (!n || !Number.isFinite(n)) return "";
  const kb = 1024;
  const mb = kb * 1024;
  if (n >= mb) return `${(n / mb).toFixed(1)} MB`;
  if (n >= kb) return `${Math.round(n / kb)} KB`;
  return `${n} B`;
}

export function AttachmentsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LogisticsQuoteSubmitValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  });

  const [isUploading, setIsUploading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const count = fields.length;

  // RHF error (schema-level) for attachments
  const rhfError =
    (errors.attachments as any)?.message ||
    // if zod complains about an item, you’ll usually see nested issues
    undefined;

  async function handleFilesPicked(fileList: FileList | null) {
    setLocalError(null);
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);

    // enforce max count
    const remainingSlots = MAX_FILES - count;
    if (remainingSlots <= 0) {
      setLocalError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }

    const toUpload = incoming.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      for (const file of toUpload) {
        const mt = (file.type || "").toLowerCase() as EFileMimeType;

        // client-side guards (server also validates)
        if (!ALLOWED_MIME_TYPES.includes(mt)) {
          throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          throw new Error(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        }

        const uploaded: IFileAsset = await uploadToS3PresignedPublic({
          file,
          namespace: ES3Namespace.QUOTES,
          folder: ES3Folder.ATTACHMENTS,
          // no docId for brand new quote submissions
          docId: undefined,
          allowedMimeTypes: ALLOWED_MIME_TYPES,
          maxSizeMB: MAX_SIZE_MB,
        });

        append(uploaded);
      }
    } catch (e: any) {
      setLocalError(e?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove(idx: number) {
    setLocalError(null);

    // `fields` contains RHF internal ids; current values are better read from `fields[idx]`
    // because each entry is the uploaded IFileAsset we appended.
    const file = fields[idx] as unknown as IFileAsset | undefined;

    try {
      await deleteTempFile(file);
    } catch {
      // ignore cleanup failures; user still expects removal from form state
    } finally {
      remove(idx);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Attachments</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Optional. Upload up to {MAX_FILES} files (max {MAX_SIZE_MB}MB each).
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <Paperclip className="h-4 w-4" />
          <span>
            {count}/{MAX_FILES}
          </span>
        </div>
      </div>

      {/* This wrapper is what your error-scroller should target */}
      <div data-field-path="attachments" className="space-y-3">
        <div className="flex items-center gap-3">
          <label
            className={cn(
              siteFileButtonUi.control,
              "inline-flex cursor-pointer items-center justify-center gap-2",
              isUploading && "pointer-events-none opacity-60",
              count >= MAX_FILES && "pointer-events-none opacity-50",
            )}
          >
            <UploadCloud className="h-4 w-4" />
            <input
              type="file"
              className="sr-only"
              multiple
              accept={ALLOWED_MIME_TYPES.join(",")}
              onChange={(e) => {
                const fl = e.currentTarget.files;
                // allow re-selecting same files
                e.currentTarget.value = "";
                void handleFilesPicked(fl);
              }}
            />
            {isUploading ? "Uploading..." : count > 0 ? "Add more files" : "Upload files"}
          </label>

          <span className="text-xs text-neutral-500">
            Allowed: all supported file types • {MAX_SIZE_MB}MB max
          </span>
        </div>

        {rhfError || localError ? (
          <p role="alert" className={siteFileButtonUi.error}>
            {String(rhfError || localError)}
          </p>
        ) : null}

        {count > 0 ? (
          <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            {fields.map((f, idx) => {
              const file = f as unknown as IFileAsset;

              return (
                <li
                  key={(f as any).id ?? file.s3Key ?? idx}
                  className="flex items-center gap-3 p-3"
                >
                  <Paperclip className="h-4 w-4 shrink-0 text-neutral-700" />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-neutral-900">
                      {file.originalName || file.url}
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      <span className="mr-2">{file.mimeType}</span>
                      {file.sizeBytes ? <span>• {formatBytes(file.sizeBytes)}</span> : null}
                    </div>
                  </div>

                  {file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      View
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => void handleRemove(idx)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                    disabled={isUploading}
                    aria-label="Remove attachment"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-700">
            No files uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
}
