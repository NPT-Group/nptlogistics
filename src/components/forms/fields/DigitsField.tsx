// src/components/forms/fields/DigitsField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type DigitsFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  ui: FieldUi;
  fieldPathAttr?: string;
  digitsOnly?: boolean;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;
  invalidClassName?: string;
};

export function DigitsField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  fieldPathAttr,
  digitsOnly = true,
  inputProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: DigitsFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = !!error;
  const value = (field.value ?? "") as string;
  const path = fieldPathAttr ?? String(name);
  const inputId = `${path}-input`;

  return (
    <div className={ui.container} data-field-path={path}>
      {label ? (
        <label htmlFor={inputId} className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <input
        id={inputId}
        {...inputProps}
        type="text"
        inputMode="numeric"
        aria-invalid={invalid}
        aria-describedby={`${path}-hint ${path}-error`}
        className={cn(ui.control, invalid && invalidClassName)}
        value={value}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        onChange={(e) => {
          const raw = e.target.value;
          const next = digitsOnly ? raw.replace(/\D+/g, "") : raw;
          field.onChange(next);
        }}
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
    </div>
  );
}
