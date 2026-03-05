// src/components/forms/fields/FileUploadField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Paperclip, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

import type { IFileAsset } from "@/types/shared.types";
import { EFileMimeType } from "@/types/shared.types";
import type { ES3Folder, ES3Namespace } from "@/types/aws.types";

import { uploadToS3PresignedPublic, deleteTempFile } from "@/lib/utils/s3Helper/client";

type StyleOverrides = {
  pickerRowClassName?: string;
  pickerButtonClassName?: string;

  singleSelectedClassName?: string;

  listClassName?: string;
  listItemClassName?: string;

  fileNameClassName?: string;
  fileMetaClassName?: string;

  // kept for backwards compat, but we won't render "View" anymore
  viewLinkClassName?: string;

  removeButtonClassName?: string;
  removeAllButtonClassName?: string;

  counterClassName?: string;
};

type BaseProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

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

  fieldPathAttr?: string;

  uploadLabel?: string;
  replaceLabel?: string;
  removeLabel?: string;
  addMoreLabel?: string;
  removeAllLabel?: string;

  allowRemove?: boolean;
  allowRemoveAll?: boolean;

  onUploaded?: (file: IFileAsset) => void | Promise<void>;
  onRemoved?: (file?: IFileAsset) => void | Promise<void>;

  styles?: StyleOverrides;

  renderItemMeta?: (file: IFileAsset) => React.ReactNode;
};

type SingleMode<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
  multiple?: false;
  maxFiles?: never;
};

type MultipleMode<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
  multiple: true;
  maxFiles?: number;
};

export type FileUploadFieldProps<TFieldValues extends FieldValues> =
  | SingleMode<TFieldValues>
  | MultipleMode<TFieldValues>;

function defaultAccept(allowed: readonly EFileMimeType[]) {
  return allowed.join(",");
}

function asArray(v: unknown): IFileAsset[] {
  if (!v) return [];
  return Array.isArray(v) ? (v as IFileAsset[]) : [];
}

export function FileUploadField<TFieldValues extends FieldValues>(
  props: FileUploadFieldProps<TFieldValues>,
) {
  const {
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
    fieldPathAttr,
    uploadLabel = "Upload file",
    replaceLabel = "Replace",
    removeLabel = "Remove",
    addMoreLabel = "Add more files",
    removeAllLabel = "Remove all",
    allowRemove = true,
    allowRemoveAll = false,
    onUploaded,
    onRemoved,
    styles,
    renderItemMeta,
  } = props;

  const { field, fieldState } = useController({ control, name });
  const [isUploading, setIsUploading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const error = fieldState.error?.message || localError;
  const acceptValue = accept ?? defaultAccept(allowedMimeTypes);

  const isMultiple = props.multiple === true;
  const maxFiles = isMultiple ? (props.maxFiles ?? 10) : 1;

  const currentSingle = (!isMultiple ? (field.value ?? undefined) : undefined) as
    | IFileAsset
    | undefined;
  const currentMulti = (isMultiple ? asArray(field.value) : []) as IFileAsset[];

  async function cleanupIfTemp(file?: IFileAsset) {
    if (!file) return;
    if (!cleanupTempOnRemove) return;
    await deleteTempFile(file);
  }

  async function uploadOne(file: File): Promise<IFileAsset> {
    return uploadToS3PresignedPublic({
      file,
      namespace,
      folder,
      docId,
      allowedMimeTypes,
      maxSizeMB,
    });
  }

  async function handlePickSingle(file: File) {
    setLocalError(null);
    setIsUploading(true);

    try {
      if (currentSingle) {
        await cleanupIfTemp(currentSingle);
        await onRemoved?.(currentSingle);
      }

      const uploaded = await uploadOne(file);
      field.onChange(uploaded);
      await onUploaded?.(uploaded);
    } catch (e: any) {
      setLocalError(e?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handlePickMultiple(files: File[]) {
    setLocalError(null);
    if (files.length === 0) return;

    const existing = currentMulti;
    const remainingSlots = maxFiles - existing.length;
    if (remainingSlots <= 0) {
      setLocalError(`You can upload up to ${maxFiles} files.`);
      return;
    }

    const toUpload = files.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const next: IFileAsset[] = [...existing];

      for (const f of toUpload) {
        const uploaded = await uploadOne(f);
        next.push(uploaded);
        await onUploaded?.(uploaded);
      }

      field.onChange(next);
    } catch (e: any) {
      setLocalError(e?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemoveSingle() {
    if (!allowRemove) return;
    setLocalError(null);

    const prev = currentSingle;
    try {
      if (prev) await cleanupIfTemp(prev);
      field.onChange(undefined);
      await onRemoved?.(prev);
    } catch (e: any) {
      setLocalError(e?.message || "Failed to remove file.");
    }
  }

  async function handleRemoveMulti(idx: number) {
    if (!allowRemove) return;
    setLocalError(null);

    const prev = currentMulti[idx];
    try {
      if (prev) await cleanupIfTemp(prev);
      const next = currentMulti.filter((_, i) => i !== idx);
      field.onChange(next);
      await onRemoved?.(prev);
    } catch (e: any) {
      setLocalError(e?.message || "Failed to remove file.");
    }
  }

  async function handleRemoveAllMulti() {
    if (!allowRemove || !allowRemoveAll) return;
    if (currentMulti.length === 0) return;

    setLocalError(null);

    try {
      for (const f of currentMulti) {
        await cleanupIfTemp(f);
        await onRemoved?.(f);
      }
      field.onChange([]);
    } catch (e: any) {
      setLocalError(e?.message || "Failed to remove files.");
    }
  }

  const iconButtonBase =
    "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:pointer-events-none disabled:opacity-60";

  const iconOnlyButtonBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:pointer-events-none disabled:opacity-60";

  return (
    <div className={ui.container} data-field-path={fieldPathAttr ?? String(name)}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      {/* Picker row */}
      <div className={cn("flex flex-wrap items-center gap-3", styles?.pickerRowClassName)}>
        <label
          className={cn(
            ui.control,
            "inline-flex cursor-pointer items-center justify-center gap-2",
            styles?.pickerButtonClassName,
            isUploading && "pointer-events-none opacity-60",
            isMultiple && currentMulti.length >= maxFiles && "pointer-events-none opacity-50",
          )}
        >
          <Paperclip className="h-4 w-4" />
          <input
            type="file"
            className="sr-only"
            accept={acceptValue}
            multiple={isMultiple}
            onBlur={field.onBlur}
            onChange={(e) => {
              const list = e.currentTarget.files;
              const picked = list ? Array.from(list) : [];
              e.currentTarget.value = "";
              if (!picked.length) return;

              if (isMultiple) void handlePickMultiple(picked);
              else void handlePickSingle(picked[0]);
            }}
          />
          {isUploading
            ? "Uploading..."
            : isMultiple
              ? currentMulti.length > 0
                ? addMoreLabel
                : uploadLabel
              : currentSingle
                ? replaceLabel
                : uploadLabel}
        </label>

        {/* Single remove (button, not link) */}
        {!isMultiple && currentSingle && allowRemove ? (
          <button
            type="button"
            onClick={() => void handleRemoveSingle()}
            className={cn(iconButtonBase, styles?.removeButtonClassName)}
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4" />
            {removeLabel}
          </button>
        ) : null}

        {/* Multi counter + remove all */}
        {isMultiple ? (
          <div className="ml-auto flex items-center gap-3">
            <span className={cn("text-xs text-neutral-500", styles?.counterClassName)}>
              {currentMulti.length}/{maxFiles}
            </span>

            {allowRemove && allowRemoveAll && currentMulti.length > 0 ? (
              <button
                type="button"
                onClick={() => void handleRemoveAllMulti()}
                className={cn(iconButtonBase, styles?.removeAllButtonClassName)}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4" />
                {removeAllLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Single selected display */}
      {!isMultiple && currentSingle ? (
        <div
          className={cn(
            "mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800",
            styles?.singleSelectedClassName,
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-medium">
                {currentSingle.originalName || currentSingle.url}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500">
                {String(currentSingle.mimeType)}
              </div>
            </div>

            {allowRemove ? (
              <button
                type="button"
                onClick={() => void handleRemoveSingle()}
                className={cn(iconOnlyButtonBase, styles?.removeButtonClassName)}
                disabled={isUploading}
                aria-label={removeLabel}
                title={removeLabel}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Multi list */}
      {isMultiple && currentMulti.length > 0 ? (
        <ul
          className={cn(
            "mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white",
            styles?.listClassName,
          )}
        >
          {currentMulti.map((f, idx) => (
            <li
              key={f.s3Key ?? `${idx}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                "border-b border-neutral-200 last:border-b-0",
                styles?.listItemClassName,
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                <Paperclip className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "truncate text-sm font-semibold text-neutral-900",
                    styles?.fileNameClassName,
                  )}
                >
                  {f.originalName || f.url}
                </div>

                <div className={cn("mt-0.5 text-xs text-neutral-500", styles?.fileMetaClassName)}>
                  {renderItemMeta ? renderItemMeta(f) : String(f.mimeType)}
                </div>
              </div>

              {/* ✅ Removed "View" entirely */}

              {/* Per-item remove (multi) */}
              {allowRemove ? (
                <button
                  type="button"
                  onClick={() => void handleRemoveMulti(idx)}
                  className={cn(iconOnlyButtonBase, styles?.removeButtonClassName)}
                  disabled={isUploading}
                  aria-label={removeLabel}
                  title={removeLabel}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Error / hint */}
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
