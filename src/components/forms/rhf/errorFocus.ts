// src/components/forms/rfh/errorFocus.ts
import type { FieldErrors, FieldValues } from "react-hook-form";

export type FormErrorFocusOptions = {
  fieldPathAttr?: string;
  scrollOffset?: number;
  focusDelayMs?: number;
  pulseDurationMs?: number;
  pulseClassName?: string;
  scrollBehavior?: ScrollBehavior;
};

const DEFAULTS: Required<FormErrorFocusOptions> = {
  fieldPathAttr: "data-field-path",
  scrollOffset: 0,
  focusDelayMs: 300,
  pulseDurationMs: 2000,
  pulseClassName: "npt-field-error-pulse",
  scrollBehavior: "smooth",
};

function collectErrorPaths<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string[] {
  const paths: string[] = [];

  const walk = (obj: unknown, prefix = "") => {
    if (!obj || typeof obj !== "object") return;

    const record = obj as Record<string, unknown>;

    if (typeof record.message === "string") {
      if (prefix) paths.push(prefix);
      return;
    }

    for (const key of Object.keys(record)) {
      const next = record[key];
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      walk(next, nextPrefix);
    }
  };

  walk(errors, "");
  return paths;
}

function getFieldWrapper(path: string, fieldPathAttr: string) {
  return document.querySelector<HTMLElement>(`[${fieldPathAttr}="${CSS.escape(path)}"]`);
}

function getFocusableWithin(el: HTMLElement | null) {
  if (!el) return null;

  return el.querySelector<HTMLElement>(
    [
      "input:not([type='hidden']):not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(","),
  );
}

function getTopmostRenderedErrorPath<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  fieldPathAttr: string,
): string | null {
  const paths = collectErrorPaths(errors);

  const candidates = paths
    .map((path) => {
      const el = getFieldWrapper(path, fieldPathAttr);
      if (!el) return null;

      const rect = el.getBoundingClientRect();

      return {
        path,
        el,
        absoluteTop: rect.top + window.scrollY,
      };
    })
    .filter(
      (
        item,
      ): item is {
        path: string;
        el: HTMLElement;
        absoluteTop: number;
      } => Boolean(item),
    );

  if (!candidates.length) {
    return paths[0] ?? null;
  }

  candidates.sort((a, b) => a.absoluteTop - b.absoluteTop);
  return candidates[0]?.path ?? null;
}

export function scrollToFieldPath(path: string, options?: FormErrorFocusOptions) {
  const opts = { ...DEFAULTS, ...options };
  const el = getFieldWrapper(path, opts.fieldPathAttr);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;

  window.scrollTo({
    top: Math.max(absoluteTop - opts.scrollOffset, 0),
    behavior: opts.scrollBehavior,
  });
}

export function pulseFieldHighlight(path: string, options?: FormErrorFocusOptions) {
  const opts = { ...DEFAULTS, ...options };
  const el = getFieldWrapper(path, opts.fieldPathAttr);
  if (!el) return;

  el.classList.add(opts.pulseClassName);
  window.setTimeout(() => {
    el.classList.remove(opts.pulseClassName);
  }, opts.pulseDurationMs);
}

export function focusFieldPath(path: string, options?: FormErrorFocusOptions) {
  const opts = { ...DEFAULTS, ...options };
  const wrapper = getFieldWrapper(path, opts.fieldPathAttr);
  const focusable = getFocusableWithin(wrapper);
  if (!focusable) return;

  window.setTimeout(() => {
    focusable.focus({ preventScroll: true });
  }, opts.focusDelayMs);
}

export function getFirstRenderableErrorPath<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  options?: Pick<FormErrorFocusOptions, "fieldPathAttr">,
) {
  const opts = { ...DEFAULTS, ...options };
  return getTopmostRenderedErrorPath(errors, opts.fieldPathAttr);
}

export function focusFirstError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  options?: FormErrorFocusOptions,
) {
  const opts = { ...DEFAULTS, ...options };

  const run = () => {
    const topmostPath = getTopmostRenderedErrorPath(errors, opts.fieldPathAttr);
    if (!topmostPath) return;

    scrollToFieldPath(topmostPath, opts);
    pulseFieldHighlight(topmostPath, opts);
    focusFieldPath(topmostPath, opts);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(run);
  });
}
