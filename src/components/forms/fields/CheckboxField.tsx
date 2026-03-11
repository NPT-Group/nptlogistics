// src/components/forms/fields/CheckboxField.tsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/cn";
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
  label: React.ReactNode;
  hint?: React.ReactNode;
  ui: FieldUi;
  fieldPathAttr?: string;
  invalidClassName?: string;
  checkboxProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange" | "value" | "name"
  >;
} & (RhfMode<TFieldValues> | ControlledMode);

export function CheckboxField<TFieldValues extends FieldValues>(
  props: CheckboxFieldProps<TFieldValues>,
) {
  const {
    label,
    hint,
    ui,
    fieldPathAttr,
    checkboxProps,
    invalidClassName = "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15",
  } = props;

  const isControlled = "checked" in props;
  const rhf = !isControlled ? useController({ control: props.control, name: props.name }) : null;

  const error = !isControlled ? rhf?.fieldState.error?.message : undefined;
  const invalid = Boolean(error);
  const checked = isControlled ? props.checked : !!rhf?.field.value;

  const path = fieldPathAttr ?? (!isControlled ? String(props.name) : undefined);
  const inputId = path ? `${path}-input` : undefined;
  const describedBy = path ? `${path}-hint ${path}-error` : undefined;

  return (
    <div className={ui.container} data-field-path={path}>
      <label
        htmlFor={inputId}
        className={cn(
          ui.controlRow,
          "flex cursor-pointer items-start gap-3",
          invalid && invalidClassName,
        )}
      >
        <input
          {...checkboxProps}
          id={inputId}
          type="checkbox"
          name={!isControlled ? rhf?.field.name : undefined}
          ref={!isControlled ? rhf?.field.ref : undefined}
          checked={checked}
          onBlur={!isControlled ? rhf?.field.onBlur : undefined}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(e) => {
            const next = e.target.checked;

            if (isControlled) {
              props.onCheckedChange?.(next);
              return;
            }

            rhf?.field.onChange(next);
          }}
          className={ui.controlBox}
        />

        <span
          aria-hidden="true"
          className={cn(
            "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
            checked
              ? cn("border-black bg-black text-white", ui.controlChecked)
              : "border-neutral-300 bg-white text-transparent",
            "peer-hover:border-neutral-400",
            "peer-focus-visible:border-neutral-400",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-black/10",
            "peer-disabled:opacity-60",
            invalid &&
              "border-red-500 peer-focus-visible:border-red-500 peer-focus-visible:ring-red-500/15",
          )}
        >
          <Check
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200 ease-out",
              checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
            strokeWidth={3}
          />
        </span>

        <div className="min-w-0">
          <div className={ui.label}>{label}</div>

          {error ? (
            <p id={path ? `${path}-error` : undefined} role="alert" className={ui.error}>
              {error}
            </p>
          ) : hint ? (
            <p id={path ? `${path}-hint` : undefined} className={ui.hint}>
              {hint}
            </p>
          ) : null}
        </div>
      </label>
    </div>
  );
}
