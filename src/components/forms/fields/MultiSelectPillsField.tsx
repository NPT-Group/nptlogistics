// src/components/forms/fields/MultiSelectPillsField.tsx
"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/cn";
import { PillCheckboxButton } from "./PillCheckboxButton";
import type { FieldUi } from "../ui/types";

export type MultiSelectPillOption<TValue extends string> = {
  value: TValue;
  label: React.ReactNode;
  disabled?: boolean;
};

export type MultiSelectPillsFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string = string,
> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  options: MultiSelectPillOption<TValue>[];
  ui?: FieldUi;
  fieldPathAttr?: string;
  invalidClassName?: string;
  containerClassName?: string;
  pillsWrapClassName?: string;
  errorId?: string;
  animateItems?: boolean;
};

function toggleInArray<T extends string>(
  arr: T[] | undefined,
  value: T,
  nextChecked: boolean,
): T[] {
  const current = Array.isArray(arr) ? arr : [];
  if (nextChecked) return current.includes(value) ? current : [...current, value];
  return current.filter((x) => x !== value);
}

const pillsContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.015,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
} satisfies Variants;

export default function MultiSelectPillsField<
  TFieldValues extends FieldValues,
  TValue extends string = string,
>({
  control,
  name,
  label,
  hint,
  required,
  options,
  ui,
  fieldPathAttr,
  invalidClassName = "border-red-500",
  containerClassName,
  pillsWrapClassName,
  errorId,
  animateItems = true,
}: MultiSelectPillsFieldProps<TFieldValues, TValue>) {
  const { field, fieldState } = useController({ control, name });

  const error = fieldState.error?.message;
  const invalid = Boolean(error);

  const path = fieldPathAttr ?? String(name);
  const resolvedErrorId = errorId ?? `${path}-error`;
  const hintId = `${path}-hint`;
  const describedBy = error ? resolvedErrorId : hint ? hintId : undefined;

  const value = (Array.isArray(field.value) ? field.value : []) as TValue[];

  const firstEnabledIndex = React.useMemo(
    () => options.findIndex((option) => !option.disabled),
    [options],
  );

  const handleToggle = React.useCallback(
    (optionValue: TValue, checked: boolean) => {
      const next = toggleInArray(value, optionValue, !checked);
      field.onChange(next as PathValue<TFieldValues, Path<TFieldValues>>);
    },
    [field, value],
  );

  return (
    <div
      className={cn(ui?.container ?? "space-y-1", containerClassName)}
      data-field-path={path}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    >
      {label ? (
        <h3 className={ui?.label ?? "text-sm font-semibold text-[color:var(--color-text-light)]"}>
          {label}
          {required ? <span className="ml-1">*</span> : null}
        </h3>
      ) : null}

      {error ? (
        <p id={resolvedErrorId} role="alert" className={ui?.error ?? "text-xs text-red-600"}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={ui?.hint ?? "text-xs text-[color:var(--color-subtle-light)]"}>
          {hint}
        </p>
      ) : null}

      <motion.div
        variants={animateItems ? pillsContainerVariants : undefined}
        initial={animateItems ? "hidden" : false}
        animate={animateItems ? "show" : false}
        className={cn("flex flex-wrap gap-2", pillsWrapClassName)}
      >
        {options.map((option, index) => {
          const checked = value.includes(option.value);

          const pill = (
            <PillCheckboxButton
              label={option.label}
              checked={checked}
              invalid={invalid}
              disabled={option.disabled}
              onToggle={() => handleToggle(option.value, checked)}
              className={cn(invalid && !checked && invalidClassName)}
            />
          );

          const withFocusAnchor = (
            <div
              key={String(option.value)}
              onBlur={field.onBlur}
              ref={index === firstEnabledIndex ? field.ref : undefined}
              tabIndex={-1}
            >
              {pill}
            </div>
          );

          if (!animateItems) return withFocusAnchor;

          return (
            <motion.div key={String(option.value)} variants={pillVariants}>
              {withFocusAnchor}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
