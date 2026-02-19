"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function SinglePanel({
  title,
  intro,
  children,
  className,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 sm:p-7", className)}>
      <h2 className="text-[1.22rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.34rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
          {intro}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function BulletList({
  items,
  accent,
}: {
  items: string[];
  accent: string;
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          <span className="text-[13.5px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14px]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StepTimeline({
  steps,
  accent,
}: {
  steps: Array<{ title: string; description: string }>;
  accent: string;
}) {
  return (
    <ol className="space-y-3.5">
      {steps.map((step, idx) => (
        <li
          key={step.title}
          className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-semibold text-white"
              style={{ backgroundColor: accent }}
            >
              {idx + 1}
            </span>
            <span className="text-[13.5px] font-semibold text-[color:var(--color-text-light)]">{step.title}</span>
          </div>
          <p className="mt-2 text-[12.75px] leading-[1.62] text-[color:var(--color-muted-light)]">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function ConversionRail({
  title,
  body,
  signals,
  primary,
  secondary,
  accent,
  onPrimaryClick,
  onSecondaryClick,
}: {
  title: string;
  body: string;
  signals: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  accent: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 sm:p-7">
      <h2 className="text-[1.2rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.3rem]">
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
        {body}
      </p>
      <ul className="mt-4 space-y-2">
        {signals.map((signal) => (
          <li key={signal} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-[12.5px] leading-[1.6] text-[color:var(--color-muted-light)]">{signal}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3">
        <Link
          href={primary.href}
          onClick={onPrimaryClick}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold text-white",
            "shadow-[0_8px_20px_rgba(2,6,23,0.16)]",
            focusRing,
          )}
          style={{ backgroundColor: accent }}
        >
          {primary.label}
        </Link>
        <Link
          href={secondary.href}
          onClick={onSecondaryClick}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-md border border-[color:var(--color-border-light)] bg-white px-5 text-sm font-semibold text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
            focusRing,
          )}
        >
          {secondary.label}
        </Link>
      </div>
    </section>
  );
}

export function RelatedServicesList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string; reason: string }>;
}) {
  return (
    <section className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 sm:p-7">
      <h2 className="text-[1.16rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.24rem]">
        {title}
      </h2>
      <div className="mt-4 grid gap-2.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3 transition",
              "hover:border-[color:var(--color-brand-500)]/40 hover:bg-white",
              focusRing,
            )}
          >
            <div className="text-[13.5px] font-semibold text-[color:var(--color-text-light)]">{item.label}</div>
            <div className="mt-1 text-[12px] leading-[1.58] text-[color:var(--color-muted-light)]">{item.reason}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
