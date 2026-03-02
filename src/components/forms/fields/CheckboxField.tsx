// src/components/forms/fields/CheckboxField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

  /** Label shown next to the checkbox */
  label: React.ReactNode;

  hint?: React.ReactNode;

  ui: FieldUi;

  checkboxProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange" | "value" | "name"
  >;
};

export function CheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  ui,
  checkboxProps,
}: CheckboxFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const checked = !!field.value;

  return (
    <div className={ui.container}>
      <label className={cn(ui.controlRow, "flex items-start gap-3")}>
        <input
          {...checkboxProps}
          type="checkbox"
          name={field.name}
          ref={field.ref}
          checked={checked}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e.target.checked)}
          className={cn(ui.controlBox)}
        />
        <div className="min-w-0">
          <div className={ui.label}>{label}</div>
          {error ? (
            <p role="alert" className={ui.error}>
              {error}
            </p>
          ) : hint ? (
            <p className={ui.hint}>{hint}</p>
          ) : null}
        </div>
      </label>
    </div>
  );
}
