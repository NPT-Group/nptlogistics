// src/components/forms/fields/PhoneField.tsx
"use client";

import * as React from "react";
import { TextField, type TextFieldProps } from "./TextField";
import type { FieldValues } from "react-hook-form";

/**
 * Phone field is just a TextField with sensible defaults (type/tel + inputMode).
 * Store as string; validate with zod on the consumer side.
 */
export type PhoneFieldProps<TFieldValues extends FieldValues> = Omit<
  TextFieldProps<TFieldValues>,
  "inputProps"
> & {
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;
};

export function PhoneField<TFieldValues extends FieldValues>({
  inputProps,
  ...rest
}: PhoneFieldProps<TFieldValues>) {
  return (
    <TextField
      {...rest}
      inputProps={{
        ...inputProps,
        type: "tel",
        inputMode: inputProps?.inputMode ?? "tel",
        autoComplete: inputProps?.autoComplete ?? "tel",
        placeholder: inputProps?.placeholder ?? "(555) 555-5555",
      }}
    />
  );
}
