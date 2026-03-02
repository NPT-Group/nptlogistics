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

  /**
   * If true, strips all non-digits. Defaults true.
   * Useful for postal/zip fragments, unit counts, etc.
   */
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
  digitsOnly = true,
  inputProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: DigitsFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = !!error;

  const value = (field.value ?? "") as string;

  return (
    <div className={ui.container}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <input
        {...inputProps}
        type="text"
        inputMode="numeric"
        aria-invalid={invalid}
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
        <p role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p className={ui.hint}>{hint}</p>
      ) : null}
    </div>
  );
}
