// src/components/forms/ui/types.ts
import { cn } from "@/lib/cn";

export type FieldUi = {
  container?: string;
  label?: string;

  /**
   * Main control styling.
   * - input/select/textarea classes for most fields
   * - upload button classes for FileUploadField
   */
  control?: string;

  /** For checkbox/radio rows */
  controlRow?: string;

  /** Checkbox input (usually sr-only) */
  controlBox?: string;

  /** Checkbox visual checked state */
  controlChecked?: string;

  /** Optional icon color/styling */
  icon?: string;

  hint?: string;
  error?: string;
};

export function mergeUi(base: FieldUi, overrides?: FieldUi): FieldUi {
  if (!overrides) return base;

  return {
    container: cn(base.container, overrides.container),
    label: cn(base.label, overrides.label),
    control: cn(base.control, overrides.control),
    controlRow: cn(base.controlRow, overrides.controlRow),
    controlBox: cn(base.controlBox, overrides.controlBox),
    controlChecked: cn(base.controlChecked, overrides.controlChecked),
    icon: cn(base.icon, overrides.icon),
    hint: cn(base.hint, overrides.hint),
    error: cn(base.error, overrides.error),
  };
}
