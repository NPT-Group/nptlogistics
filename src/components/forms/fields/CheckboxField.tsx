// src/components/forms/fields/CheckboxField.tsx
"use client";

import * as React from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { FieldUi } from "../ui/types";

type RhfMode<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  checked?: never;
  onCheckedChange?: never;
};

type ControlledMode = {
  control?: never;
  name?: never;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
};

export type CheckboxFieldProps<TFieldValues extends FieldValues> = {
  /** Label shown next to the checkbox */
  label: React.ReactNode;

  hint?: React.ReactNode;

  ui: FieldUi;

  /** For enterprise scroll-to-error targeting. */
  fieldPathAttr?: string;

  checkboxProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange" | "value" | "name"
  >;
} & (RhfMode<TFieldValues> | ControlledMode);

export function CheckboxField<TFieldValues extends FieldValues>(
  props: CheckboxFieldProps<TFieldValues>,
) {
  const { label, hint, ui, fieldPathAttr, checkboxProps } = props;

  const isControlled = "checked" in props;

  // RHF mode
  const rhf = !isControlled ? useController({ control: props.control, name: props.name }) : null;

  const error = !isControlled ? rhf?.fieldState.error?.message : undefined;

  const checked = isControlled ? props.checked : !!rhf?.field.value;

  return (
    <div
      className={ui.container}
      data-field-path={fieldPathAttr ?? (!isControlled ? String(props.name) : undefined)}
    >
      <label className={cn(ui.controlRow, "flex items-start gap-3")}>
        <input
          {...checkboxProps}
          type="checkbox"
          // name/ref only in RHF mode
          name={!isControlled ? rhf?.field.name : undefined}
          ref={!isControlled ? rhf?.field.ref : undefined}
          checked={checked}
          onBlur={!isControlled ? rhf?.field.onBlur : undefined}
          onChange={(e) => {
            const next = e.target.checked;

            if (isControlled) {
              props.onCheckedChange?.(next);
              return;
            }

            rhf?.field.onChange(next);
          }}
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
