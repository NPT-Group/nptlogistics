// src/components/forms/fields/FileUploadField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Paperclip, Trash2, X } from "lucide-react";

import { cn } from "@/lib/cn";
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
  viewLinkClassName?: string;
  removeButtonClassName?: string;
  removeAllButtonClassName?: string;
  counterClassName?: string;
};

type EmptyStateConfig = {
  show?: boolean;
  text?: React.ReactNode;
  className?: string;
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
  invalidClassName?: string;
  onUploaded?: (file: IFileAsset) => void | Promise<void>;
  onRemoved?: (file?: IFileAsset) => void | Promise<void>;
  styles?: StyleOverrides;
  renderItemMeta?: (file: IFileAsset) => React.ReactNode;
  emptyState?: EmptyStateConfig;
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
    invalidClassName = "border-red-500 ring-2 ring-red-500/15",
    onUploaded,
    onRemoved,
    styles,
    renderItemMeta,
    emptyState,
  } = props;

  const { field, fieldState } = useController({ control, name });
  const [isUploading, setIsUploading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const error = fieldState.error?.message || localError;
  const invalid = Boolean(error);
  const acceptValue = accept ?? defaultAccept(allowedMimeTypes);
  const path = fieldPathAttr ?? String(name);

  const isMultiple = props.multiple === true;
  const maxFiles = isMultiple ? (props.maxFiles ?? 10) : 1;

  const currentSingle = (!isMultiple ? (field.value ?? undefined) : undefined) as
    | IFileAsset
    | undefined;
  const currentMulti = (isMultiple ? asArray(field.value) : []) as IFileAsset[];

  const showEmptyState =
    emptyState?.show ?? (isMultiple ? currentMulti.length === 0 : !currentSingle);

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

  const pickerButtonBase =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition outline-none disabled:pointer-events-none disabled:opacity-60";

  const pickerButtonTone = [
    "border-neutral-200",
    "bg-white",
    "text-[color:var(--color-text-light)]",
    "[color-scheme:light]",
    "hover:border-neutral-300",
    "focus-within:ring-2",
    "focus-within:ring-black/10",
    "focus-within:border-neutral-300",
  ].join(" ");

  const actionButtonBase =
    "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 transition hover:cursor-pointer hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:pointer-events-none disabled:opacity-60";

  const iconOnlyButtonBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 transition hover:cursor-pointer hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black/10 disabled:pointer-events-none disabled:opacity-60";

  const defaultIconClassName = "text-black";

  return (
    <div className={ui.container} data-field-path={path}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn("rounded-2xl", invalid && invalidClassName)}
        aria-invalid={invalid}
        aria-describedby={`${path}-hint ${path}-error`}
      >
        <div className={cn("flex flex-wrap items-center gap-3", styles?.pickerRowClassName)}>
          <label
            className={cn(
              pickerButtonBase,
              pickerButtonTone,
              ui.control,
              "cursor-pointer",
              styles?.pickerButtonClassName,
              isUploading && "pointer-events-none opacity-60",
              isMultiple && currentMulti.length >= maxFiles && "pointer-events-none opacity-50",
            )}
          >
            <Paperclip className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
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

          {!isMultiple && currentSingle && allowRemove ? (
            <button
              type="button"
              onClick={() => void handleRemoveSingle()}
              className={cn(actionButtonBase, styles?.removeButtonClassName)}
              disabled={isUploading}
            >
              <Trash2 className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
              {removeLabel}
            </button>
          ) : null}

          {isMultiple && currentMulti.length > 0 ? (
            <div className="ml-auto flex items-center gap-3">
              <span className={cn("text-xs text-neutral-500", styles?.counterClassName)}>
                {currentMulti.length}/{maxFiles}
              </span>

              {allowRemove && allowRemoveAll && currentMulti.length > 0 ? (
                <button
                  type="button"
                  onClick={() => void handleRemoveAllMulti()}
                  className={cn(actionButtonBase, styles?.removeAllButtonClassName)}
                  disabled={isUploading}
                >
                  <Trash2 className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
                  {removeAllLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

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
                  <X className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

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
                  <Paperclip className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
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

                {allowRemove ? (
                  <button
                    type="button"
                    onClick={() => void handleRemoveMulti(idx)}
                    className={cn(iconOnlyButtonBase, styles?.removeButtonClassName)}
                    disabled={isUploading}
                    aria-label={removeLabel}
                    title={removeLabel}
                  >
                    <Trash2 className={cn("h-4 w-4", defaultIconClassName, ui.icon)} />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {showEmptyState ? (
          <div
            className={cn(
              "mt-3 rounded-2xl border border-dashed p-4 text-sm",
              "border-[color:var(--color-border-light)]",
              "bg-[color:var(--color-surface-muted)]/35",
              "text-[color:var(--color-muted-light)]",
              emptyState?.className,
            )}
          >
            {emptyState?.text ?? "No files uploaded yet."}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${path}-error`} role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${path}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
