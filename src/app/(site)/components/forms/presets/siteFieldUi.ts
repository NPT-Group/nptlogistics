// src/app/(site)/components/forms/presets/siteFieldUi.ts
import type { FieldUi } from "@/components/forms";

/**
 * Slick / flat inputs:
 * - No shadows
 * - Polish via: clean borders + subtle surface tint + crisp focus ring
 * - Prevent dark-theme globals from breaking input text/date/select affordances
 */

const CONTROL_BASE = [
  "w-full rounded-xl border transition",
  "focus:outline-none",
  "focus:ring-2 focus:ring-black/10",
  "disabled:opacity-100 disabled:cursor-not-allowed",
  "disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200 disabled:hover:border-neutral-200",
  "[color-scheme:light]",
].join(" ");

const CONTROL_SURFACE = ["bg-white", "border-neutral-200", "hover:border-neutral-300"].join(" ");

const CONTROL_TEXT = "text-neutral-900 placeholder:text-neutral-400 caret-neutral-900";

const CONTROL_INVALID = "border-red-500 focus:border-red-500 focus:ring-red-500/15";
const GROUP_INVALID = "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15";

export const siteTextUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-semibold text-[color:var(--color-text-light)]",
  control: ["h-12 px-4 text-sm", CONTROL_BASE, CONTROL_SURFACE, CONTROL_TEXT].join(" "),
  hint: "text-xs text-[color:var(--color-subtle-light)]",
  error: "text-xs text-red-600",
};

export const siteTextareaUi: FieldUi = {
  ...siteTextUi,
  control: ["min-h-[140px] px-4 py-3 text-sm", CONTROL_BASE, CONTROL_SURFACE, CONTROL_TEXT].join(
    " ",
  ),
};

export const siteCheckUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium leading-5 text-[color:var(--color-text-light)]",
  controlRow: [
    "rounded-xl border border-neutral-200 bg-white px-3 py-3",
    "transition",
    "hover:border-neutral-300 hover:bg-neutral-50/80",
    "focus-within:border-black focus-within:ring-2 focus-within:ring-black/10",
  ].join(" "),
  controlBox: ["peer sr-only"].join(" "),
  hint: "mt-1 text-xs text-[color:var(--color-subtle-light)]",
  error: "mt-1 text-xs text-red-600",
};

/** Upload button styling (FileUploadField uses ui.control as the button class) */
export const siteFileButtonUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-semibold text-[color:var(--color-text-light)]",
  control: "",
  hint: "text-xs text-[color:var(--color-subtle-light)]",
  error: "text-xs text-red-600",
};

export const siteInvalidControlClassName = CONTROL_INVALID;
export const siteInvalidGroupClassName = GROUP_INVALID;
