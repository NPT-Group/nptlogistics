// src/components/forms/fields/SelectField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type SelectFieldProps<TFieldValues extends FieldValues, TValue extends string = string> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;

  ui: FieldUi;

  /** For enterprise scroll-to-error targeting. Defaults to `name`. */
  fieldPathAttr?: string;

  options: ReadonlyArray<SelectOption<TValue>>;

  placeholder?: string; // if provided, adds a disabled placeholder option
  selectProps?: Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange" | "name" | "ref"
  >;

  invalidClassName?: string;
};

export function SelectField<TFieldValues extends FieldValues, TValue extends string = string>({
  control,
  name,
  label,
  hint,
  required,
  ui,
  fieldPathAttr,
  options,
  placeholder = "Select...",
  selectProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: SelectFieldProps<TFieldValues, TValue>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = !!error;

  const value = (field.value ?? "") as string;

  return (
    <div className={ui.container} data-field-path={fieldPathAttr ?? String(name)}>
      {label ? (
        <label className={ui.label}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </label>
      ) : null}

      <select
        {...selectProps}
        name={field.name}
        ref={field.ref}
        value={value}
        onBlur={field.onBlur}
        onChange={(e) => field.onChange(e.target.value)}
        aria-invalid={invalid}
        className={cn(ui.control, invalid && invalidClassName)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

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
