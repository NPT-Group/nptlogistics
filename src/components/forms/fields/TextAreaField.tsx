// src/components/forms/fields/TextAreaField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type TextAreaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  footer?: React.ReactNode;
  required?: boolean;
  ui: FieldUi;
  fieldPathAttr?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  invalidClassName?: string;
};

export function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  footer,
  required,
  ui,
  fieldPathAttr,
  textareaProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: TextAreaFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const invalid = !!error;
  const path = fieldPathAttr ?? String(name);
  const inputId = `${path}-input`;

  const describedBy = [error ? `${path}-error` : null, !error && hint ? `${path}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={ui.container} data-field-path={path}>
      {label ? (
        <label htmlFor={inputId} className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <textarea
        id={inputId}
        {...textareaProps}
        {...field}
        value={field.value ?? ""}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        className={cn(ui.control, invalid && invalidClassName)}
      />

      {error ? (
        <p id={`${path}-error`} role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${path}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}

      {!error && footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}
