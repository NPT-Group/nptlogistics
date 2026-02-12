// src/components/admin/ui/ConfirmModal.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, X } from "lucide-react";

export type ConfirmTone = "neutral" | "danger";

function useBodyPortalReady() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => setReady(true), []);
  return ready;
}

export function ConfirmModal({
  open,
  tone = "neutral",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean;
  tone?: ConfirmTone;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ready = useBodyPortalReady();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !ready) return null;

  const confirmBtn =
    tone === "danger"
      ? cn(
          // Light mode: strong contrast
          "bg-red-600 text-white hover:bg-red-700",
          // Dark mode: still readable
          "dark:bg-red-500/90 dark:hover:bg-red-500",
        )
      : cn(
          "border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
          "hover:bg-[var(--dash-surface-2)]",
        );

  return createPortal(
    <div className="fixed inset-0 z-[120]">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onMouseDown={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-md overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)]",
                  tone === "danger" ? "text-red-500" : "text-[var(--dash-text)]",
                )}
              >
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-[var(--dash-text)]">{title}</div>
                {description ? (
                  <div className="mt-1 text-sm text-[var(--dash-muted)]">{description}</div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-2xl p-2 transition",
                  "text-[var(--dash-muted)] hover:bg-[var(--dash-surface-2)] hover:text-[var(--dash-text)]",
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition",
                "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                "hover:bg-[var(--dash-surface-2)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-2xl px-3 text-sm font-semibold transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                confirmBtn,
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
