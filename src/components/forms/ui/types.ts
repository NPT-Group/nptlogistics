// src/components/forms/ui/types.ts
import { cn } from "@/lib/utils/cn";

export type FieldUi = {
  container?: string;
  label?: string;

  /**
   * Main control styling.
   * - input/select/textarea classes for most fields
   * - upload button classes for FileUploadField
   */
  control?: string;

  /** For checkbox/radio rows, optional wrapper */
  controlRow?: string;

  /** For checkbox/radio itself (optional) */
  controlBox?: string;

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
    hint: cn(base.hint, overrides.hint),
    error: cn(base.error, overrides.error),
  };
}
