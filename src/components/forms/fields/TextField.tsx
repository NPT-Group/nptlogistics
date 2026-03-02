// src/components/forms/fields/TextField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;

  ui: FieldUi;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  invalidClassName?: string;
};

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  inputProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: TextFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const invalid = !!error;

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
