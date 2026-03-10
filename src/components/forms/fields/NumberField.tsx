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
  fieldPathAttr?: string;
  parseAsNumber?: boolean;
  disallowNegative?: boolean;
  disallowExponent?: boolean;
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
  disallowNegative = false,
  disallowExponent = false,
  inputProps,
  invalidClassName = "border-red-500 focus:ring-red-500/20",
}: NumberFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({ control, name });
  const error = fieldState.error?.message;
  const invalid = !!error;
  const value: NumberLike = field.value as any;
  const path = fieldPathAttr ?? String(name);
  const inputId = `${path}-input`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (disallowNegative && e.key === "-") {
      e.preventDefault();
      return;
    }

    if (disallowExponent && (e.key === "e" || e.key === "E")) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    inputProps?.onPaste?.(e);
    if (e.defaultPrevented) return;

    const text = e.clipboardData.getData("text");

    if (disallowNegative && text.includes("-")) {
      e.preventDefault();
      return;
    }

    if (disallowExponent && /e/i.test(text)) {
      e.preventDefault();
    }
  };

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
        type="number"
        inputMode={inputProps?.inputMode ?? "decimal"}
        aria-invalid={invalid}
        aria-describedby={`${path}-hint ${path}-error`}
        className={cn(ui.control, invalid && invalidClassName, inputProps?.className)}
        value={value ?? ""}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
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

          if (!Number.isFinite(n)) {
            field.onChange(undefined);
            return;
          }

          field.onChange(n);
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
