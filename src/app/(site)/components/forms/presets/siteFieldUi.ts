// src/app/(site)/components/forms/presets/siteFieldUi.ts
import type { FieldUi } from "@/components/forms";

/** Text input / select base */
export const siteTextUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium text-neutral-900",
  control:
    "h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm shadow-sm transition focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-500",
};

/** Textarea base */
export const siteTextareaUi: FieldUi = {
  ...siteTextUi,
  control:
    "min-h-[140px] w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none",
};

/** Checkbox / radio rows */
export const siteCheckUi: FieldUi = {
  container: "space-y-1",
  label: "text-sm font-medium text-neutral-900",
  controlRow: "rounded-xl p-2 hover:bg-neutral-50",
  controlBox: "mt-1 h-4 w-4 rounded border border-neutral-300",
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
