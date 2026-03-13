// src/app/(site)/components/forms/components/FormCardShell.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface FormCardShellProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function FormCardShell({ children, className, innerClassName }: FormCardShellProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-3xl",
        "border border-[color:var(--color-border-light)]",
        "shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(90deg,rgba(220,38,38,0.82),rgba(30,64,175,0.88))]"
      />

      <div
        className={cn(
          "relative mt-[4px] overflow-hidden rounded-3xl bg-[color:var(--color-surface-0)]",
          innerClassName,
        )}
      >
        <div className="bg-white/95">{children}</div>
      </div>
    </div>
  );
}
