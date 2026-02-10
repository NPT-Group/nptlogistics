import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type SectionProps = PropsWithChildren<{
  id?: string;
  variant?: "dark" | "light";
  className?: string;
}>;

export function Section({ id, variant = "dark", className, children }: SectionProps) {
  return (
    <section
      id={id}
      data-variant={variant}
      className={cn(
        "relative py-14 sm:py-16",
        variant === "dark" && "bg-transparent text-[color:var(--color-text)]",
        variant === "light" &&
          "bg-[color:var(--color-surface-0-light)] text-[color:var(--color-text-light)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
