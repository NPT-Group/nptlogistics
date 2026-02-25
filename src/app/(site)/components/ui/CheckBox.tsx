"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange"
> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;

  label?: React.ReactNode;
  description?: React.ReactNode;

  align?: "top" | "center";
  variant?: "default" | "soft";

  classes?: {
    root?: string;
    boxWrap?: string;
    box?: string;
    icon?: string;
    textWrap?: string;
    label?: string;
    description?: string;
    input?: string;
  };
};

export const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled,
      label,
      description,
      children,
      align = "top",
      variant = "default",
      className,
      classes,
      id,
      ...rest
    },
    ref,
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;

    const rootBase =
      "flex min-w-0 gap-3 rounded-2xl border px-3 py-2.5 text-sm sm:px-4 sm:py-3 " +
      (variant === "soft" ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200");

    const rootState = disabled
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer hover:bg-slate-50/60";

    // Less rounded checkbox shape
    const boxBase =
      "relative grid h-5 w-5 shrink-0 place-items-center rounded-md border bg-white shadow-sm transition";

    const boxChecked = checked
      ? "border-[color:var(--color-brand-600)] bg-[color:var(--color-brand-600)]"
      : "border-slate-300";

    // Focus ring should appear on the box when tabbing to the real input
    const focusRing =
      "peer-focus-visible:ring-4 peer-focus-visible:ring-[color:var(--color-ring)]/35 " +
      "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white";

    return (
      <label
        htmlFor={inputId}
        className={cn(
          rootBase,
          align === "top" ? "items-start" : "items-center",
          rootState,
          "select-none",
          className,
          classes?.root,
        )}
      >
        {/* Box + real focusable input overlay */}
        <span className={cn("relative", classes?.boxWrap)}>
          {/* This is the REAL checkbox: focusable, space toggles, etc.
              We visually hide it but keep it over the box so focus is intuitive. */}
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className={cn(
              // "peer" lets us style the box on focus-visible
              "peer absolute inset-0 h-5 w-5 cursor-pointer",
              // Visually hidden but still present for keyboard/mouse
              "opacity-0",
              disabled && "cursor-not-allowed",
              classes?.input,
            )}
          />

          <span aria-hidden className={cn(boxBase, boxChecked, focusRing, classes?.box)}>
            <Check
              className={cn(
                "h-3.5 w-3.5 text-white transition",
                checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
                classes?.icon,
              )}
            />
          </span>
        </span>

        {/* Text */}
        <span className={cn("min-w-0", classes?.textWrap)}>
          {children ?? (
            <>
              {label ? (
                <span className={cn("block font-medium text-slate-700", classes?.label)}>
                  {label}
                </span>
              ) : null}
              {description ? (
                <span className={cn("mt-1 block text-xs text-slate-500", classes?.description)}>
                  {description}
                </span>
              ) : null}
            </>
          )}
        </span>
      </label>
    );
  },
);

CheckBox.displayName = "CheckBox";
