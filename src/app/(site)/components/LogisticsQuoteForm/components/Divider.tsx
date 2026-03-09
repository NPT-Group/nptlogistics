// src/app/(site)/components/LogisticsQuoteForm/components/Divider.tsx
"use client";

import { cn } from "@/lib/cn";

type DividerProps = {
  className?: string;
  lineClassName?: string;
};

export function Divider({ className, lineClassName }: DividerProps) {
  return (
    <div className={cn("py-2", className)}>
      <div
        className={cn(
          "mx-auto h-px w-[88%]",
          "bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.16),rgba(15,23,42,0.22),rgba(15,23,42,0.16),transparent)]",
          lineClassName,
        )}
        aria-hidden="true"
      />
    </div>
  );
}
