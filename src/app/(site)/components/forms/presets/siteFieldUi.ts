// src/app/(site)/components/forms/presets/siteFieldUi.ts
import type { FieldUi } from "@/components/forms";

/**
 * NOTE:
 * Our site theme can set global text color to white (dark theme).
 * Inputs/buttons must explicitly set text color to avoid white-on-white inputs.
 */

const CONTROL_BASE =
  "w-full rounded-xl border shadow-sm transition focus:outline-none focus:ring-2";

const CONTROL_TEXT = "text-neutral-900 placeholder:text-neutral-400 caret-neutral-900";

const CONTROL_BG = "bg-white border-neutral-300 focus:border-black focus:ring-black/10";

export const siteTextUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium text-neutral-900",
  control: ["h-12 px-4 text-sm", CONTROL_BASE, CONTROL_BG, CONTROL_TEXT].join(" "),
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-500",
};

export const siteTextareaUi: FieldUi = {
  ...siteTextUi,
  control: ["min-h-[140px] px-4 py-3 text-sm", CONTROL_BASE, CONTROL_BG, CONTROL_TEXT].join(" "),
};

export const siteCheckUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium text-neutral-900",
  controlRow: "rounded-xl p-2 hover:bg-neutral-50",
  // checkbox itself should not inherit white text issues, but keep it explicit anyway
  controlBox: "mt-1 h-4 w-4 rounded border border-neutral-300 bg-white",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-500",
};

/** Upload button styling (FileUploadField uses ui.control as the button class) */
export const siteFileButtonUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium text-neutral-900",
  control:
    "h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/20",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-500",
};
