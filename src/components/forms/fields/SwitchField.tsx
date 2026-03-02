// src/components/forms/fields/SwitchField.tsx
"use client";

import type { FieldValues } from "react-hook-form";
import { CheckboxField, type CheckboxFieldProps } from "./CheckboxField";

/**
 * Headless switch: still an input[type=checkbox] for accessibility.
 * Styling is provided via ui.controlBox / ui.controlRow from presets.
 */
export type SwitchFieldProps<TFieldValues extends FieldValues> = CheckboxFieldProps<TFieldValues>;

export function SwitchField<TFieldValues extends FieldValues>(
  props: SwitchFieldProps<TFieldValues>,
) {
  return <CheckboxField {...props} />;
}
