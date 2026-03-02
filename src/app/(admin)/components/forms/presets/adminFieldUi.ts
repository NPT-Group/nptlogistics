// src/app/(admin)/components/forms/presets/adminFieldUi.ts
import type { FieldUi } from "@/components/forms";

/** Text input / select base */
export const adminTextUi: FieldUi = {
  container: "space-y-2",
  label: "text-sm font-semibold text-neutral-800",
  control:
    "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-black focus:outline-none",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-600",
};

/** Textarea base */
export const adminTextareaUi: FieldUi = {
  ...adminTextUi,
  control:
    "min-h-[120px] w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none",
};

/** Checkbox / radio rows */
export const adminCheckUi: FieldUi = {
  container: "space-y-2",
  label: "text-sm font-semibold text-neutral-800",
  controlRow: "rounded-md p-2 hover:bg-neutral-50",
  controlBox: "mt-1 h-4 w-4 rounded border border-neutral-300",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-600",
};

/** Upload button styling */
export const adminFileButtonUi: FieldUi = {
  container: "space-y-2",
  label: "text-sm font-semibold text-neutral-800",
  control:
    "h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none",
  hint: "text-xs text-neutral-500",
  error: "text-xs text-red-600",
};
