// src/components/forms/fields/NumberField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

type NumberLike = number | undefined | null;

export type NumberFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;

  ui: FieldUi;

  /** For enterprise scroll-to-error targeting. Defaults to `name`. */
  fieldPathAttr?: string;

  /**
   * By default, stores a number in RHF.
   * If false, stores raw string (rare).
   */
  parseAsNumber?: boolean;

  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">;

  invalidClassName?: string;
};

export function NumberField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  fieldPathAttr,
  parseAsNumber = true,
  inputProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: NumberFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = !!error;

  const value: NumberLike = field.value as any;

  return (
    <div className={ui.container} data-field-path={fieldPathAttr ?? String(name)}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <input
        {...inputProps}
        type="number"
        inputMode={inputProps?.inputMode ?? "decimal"}
        aria-invalid={invalid}
        className={cn(ui.control, invalid && invalidClassName)}
        value={value ?? ""}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        onChange={(e) => {
          const raw = e.target.value;

          if (!parseAsNumber) {
            field.onChange(raw);
            return;
          }

          if (raw === "") {
            field.onChange(undefined);
            return;
          }

          const n = Number(raw);
          field.onChange(Number.isFinite(n) ? n : undefined);
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
