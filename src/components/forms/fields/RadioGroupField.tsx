// src/components/forms/fields/RadioGroupField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

export type RadioOption<T extends string = string> = {
  label: React.ReactNode;
  value: T;
  hint?: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string = string,
> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;

  legend?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;

  ui: FieldUi;

  /** For enterprise scroll-to-error targeting. Defaults to `name`. */
  fieldPathAttr?: string;

  options: ReadonlyArray<RadioOption<TValue>>;

  /** Optional: render radios in columns */
  columnsClassName?: string;

  radioProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange" | "name" | "value"
  >;
};

export function RadioGroupField<TFieldValues extends FieldValues, TValue extends string = string>({
  control,
  name,
  legend,
  hint,
  required,
  ui,
  fieldPathAttr,
  options,
  columnsClassName = "space-y-2",
  radioProps,
}: RadioGroupFieldProps<TFieldValues, TValue>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const current = (field.value ?? "") as string;

  return (
    <fieldset className={ui.container} data-field-path={fieldPathAttr ?? String(name)}>
      {legend ? (
        <legend className={ui.label}>
          {legend}
          {required ? <span className="ml-1">*</span> : null}
        </legend>
      ) : null}

      <div className={columnsClassName}>
        {options.map((opt, idx) => {
          const checked = current === opt.value;

          return (
            <label
              key={opt.value}
              className={cn(ui.controlRow, "flex items-start gap-3", opt.disabled && "opacity-60")}
            >
              <input
                {...radioProps}
                type="radio"
                name={field.name}
                value={opt.value}
                checked={checked}
                disabled={opt.disabled}
                onBlur={field.onBlur}
                onChange={() => field.onChange(opt.value)}
                className={cn(ui.controlBox)}
                ref={idx === 0 ? field.ref : undefined}
              />
              <div className="min-w-0">
                <div className={ui.label}>{opt.label}</div>
                {opt.hint ? <div className={ui.hint}>{opt.hint}</div> : null}
              </div>
            </label>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className={ui.error}>
          {error}
        </p>
      ) : hint ? (
        <p className={ui.hint}>{hint}</p>
      ) : null}
    </fieldset>
  );
}
