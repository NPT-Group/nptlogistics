// src/components/forms/fields/FileUploadField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

import type { IFileAsset } from "@/types/shared.types";
import { EFileMimeType } from "@/types/shared.types";
import type { ES3Folder, ES3Namespace } from "@/types/aws.types";

import { uploadToS3PresignedPublic, deleteTempFile } from "@/lib/utils/s3Helper/client";

export type FileUploadFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>; // recommended: IFileAsset | undefined

  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;

  ui: FieldUi;

  namespace: ES3Namespace;
  folder: ES3Folder;
  docId?: string;

  allowedMimeTypes: readonly EFileMimeType[];
  maxSizeMB?: number;

  accept?: string;
  cleanupTempOnRemove?: boolean;

  onUploaded?: (file: IFileAsset) => void | Promise<void>;
  onRemoved?: (file?: IFileAsset) => void | Promise<void>;

  uploadLabel?: string;
  replaceLabel?: string;
  removeLabel?: string;
};

function mimeToAccept(mt: EFileMimeType) {
  return mt;
}

export function FileUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  namespace,
  folder,
  docId,
  allowedMimeTypes,
  maxSizeMB,
  accept,
  cleanupTempOnRemove = true,
  onUploaded,
  onRemoved,
  uploadLabel = "Upload file",
  replaceLabel = "Replace",
  removeLabel = "Remove",
}: FileUploadFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });
  const current = (field.value ?? undefined) as IFileAsset | undefined;

  const [isUploading, setIsUploading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const error = fieldState.error?.message || localError;

  const acceptValue = accept ?? allowedMimeTypes.map(mimeToAccept).join(",");

  async function handlePickFile(file: File) {
    setLocalError(null);
    setIsUploading(true);

    try {
      if (current) {
        if (cleanupTempOnRemove) await deleteTempFile(current);
        await onRemoved?.(current);
      }

      const uploaded = await uploadToS3PresignedPublic({
        file,
        namespace,
        folder,
        docId,
        allowedMimeTypes,
        maxSizeMB,
      });

      field.onChange(uploaded);
      await onUploaded?.(uploaded);
    } catch (e: any) {
      setLocalError(e?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    setLocalError(null);
    const prev = current;

    try {
      if (prev && cleanupTempOnRemove) await deleteTempFile(prev);
      field.onChange(undefined);
      await onRemoved?.(prev);
    } catch (e: any) {
      setLocalError(e?.message || "Failed to remove file.");
    }
  }

  return (
    <div className={ui.container}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <div className="flex items-center gap-3">
        <label
          className={cn(
            ui.control,
            "inline-flex cursor-pointer items-center justify-center",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input
            type="file"
            className="sr-only"
            accept={acceptValue}
            onBlur={field.onBlur}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.currentTarget.value = "";
              if (f) void handlePickFile(f);
            }}
          />
          {isUploading ? "Uploading..." : current ? replaceLabel : uploadLabel}
        </label>

        {current ? (
          <button
            type="button"
            onClick={() => void handleRemove()}
            className="text-sm underline underline-offset-4"
            disabled={isUploading}
          >
            {removeLabel}
          </button>
        ) : null}
      </div>

      {current ? (
        <div className="text-sm">
          <span className="font-medium">Selected:</span>{" "}
          <span className="break-all">{current.originalName || current.url}</span>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p className={ui.hint}>{hint}</p>
      ) : null}
    </div>
  );
}
