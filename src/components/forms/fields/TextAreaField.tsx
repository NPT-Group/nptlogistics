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
  required?: boolean;

  ui: FieldUi;

  /** For enterprise scroll-to-error targeting. Defaults to `name`. */
  fieldPathAttr?: string;

  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  invalidClassName?: string;
};

export function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  fieldPathAttr,
  textareaProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: TextAreaFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const invalid = !!error;

  return (
    <div className={ui.container} data-field-path={fieldPathAttr ?? String(name)}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <textarea
        {...textareaProps}
        {...field}
        value={field.value ?? ""}
        aria-invalid={invalid}
        className={cn(ui.control, invalid && invalidClassName)}
      />

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
