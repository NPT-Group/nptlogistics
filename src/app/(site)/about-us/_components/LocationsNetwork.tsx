"use client";

/**
 * Locations & Network — LOCKED to about-page + homepage standards.
 * - Section: scroll-mt-16 (matches navbar height), id="locations-network", variant dark
 * - Container: max-w-[1440px], lg:pl-8 lg:pr-6 (align right edge with navbar)
 * - Header: red bar + sectionLabel + h2 (1.6rem → 1.95rem → 2.2rem), supporting line
 * - Dark variant, useReducedMotion for all animations, viewport once: true
 * - Responsive: at 1024px and below = mobile (stacked); above 1024px = two-column.
 * - Map: always contained, never overlaps, and is right-justified.
 */

import Image from "next/image";
import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { cn } from "@/lib/cn";

type Metric = Readonly<{ value: string; label: string }>;

type Data = Readonly<{
  sectionLabel: string;
  title: string;
  supportingLine?: string;

  heroStat: string;
  heroStatLabel: string;

  metrics?: readonly Metric[];

  capabilitiesHeading: string;
  capabilities: readonly string[];

  mapImage?: string;

  // Present in data model (not rendered here).
  countries?: readonly Readonly<{ name: string; yards: readonly string[] }>[];
  yards?: readonly Readonly<{ city: string; region: string; label: string }>[];
}>;

const ICONS = {
  users: (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-[color:var(--color-brand-500)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      focusable="false"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  globe: (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-[color:var(--color-brand-500)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      focusable="false"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  ),
} as const;

function splitInHalf<T>(items: readonly T[]) {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)] as const;
}

export function LocationsNetwork({ data }: Readonly<{ data: Data }>) {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = React.useMemo(() => {
    if (reduceMotion) return { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };
    return {
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    };
  }, [reduceMotion]);

  const stagger: Variants = React.useMemo(() => {
    if (reduceMotion) return { hidden: { opacity: 1 }, show: { opacity: 1 } };
    return { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } };
  }, [reduceMotion]);

  const metrics = data.metrics ?? [];
  const [capLeft, capRight] = React.useMemo(
    () => splitInHalf(data.capabilities ?? []),
    [data.capabilities],
  );

  return (
    <Section
      variant="dark"
      id="locations-network"
      className="relative scroll-mt-16 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-0)" }}
    >
      {/* Ambient depth — same as Operating Model (0.08 / 0.05) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.08),transparent_60%)]" />
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(185,28,28,0.05),transparent_65%)]" />
      </div>

      <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:pr-6 lg:pl-8">
        {/* Section header — same pattern as Operating Model / Safety */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          className="mb-6 sm:mb-8"
        >
          <div className="mb-2 flex items-center gap-2.5">
            <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
            <span className="text-[10.5px] font-bold tracking-[0.15em] text-[color:var(--color-brand-500)] uppercase">
              {data.sectionLabel}
            </span>
          </div>

          <h2 className="text-[1.6rem] leading-tight font-semibold tracking-tight text-[color:var(--color-text-strong)] sm:text-[1.95rem] lg:text-[2.2rem]">
            {data.title}
          </h2>

          {data.supportingLine ? (
            <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[color:var(--color-subtle)]">
              {data.supportingLine}
            </p>
          ) : null}
        </motion.div>

        {/* Layout:
            - Mobile/tablet: stack
            - Desktop (>=1025): two columns
            - Left column is "content-safe": it will NOT shrink below What-you-get needs.
            - Right column map is right-justified and separated by a real gap.
        */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className={cn(
            "grid min-h-0 min-w-0 grid-cols-1 overflow-hidden",
            // Desktop: lock content column minimum so “What you get” never gets squeezed into the map
            "min-[1025px]:grid-cols-[minmax(560px,0.62fr)_minmax(0,1fr)]",
            // Real breathing room between left and map
            "min-[1025px]:gap-x-16 xl:min-[1025px]:gap-x-20",
            "min-[1025px]:items-stretch",
          )}
        >
          {/* LEFT: content (hero + metrics + what-you-get) */}
          <div className="flex min-w-0 flex-col justify-center pb-6 min-[1025px]:pb-0">
            <motion.div variants={fadeUp} className="w-fit">
              <span
                className="block text-[4.5rem] leading-none font-bold tracking-tight sm:text-[5.25rem] lg:text-[6rem] xl:text-[6.5rem]"
                style={{ color: "var(--color-brand-500)" }}
              >
                {data.heroStat}
              </span>
              <p className="mt-2 text-lg font-semibold text-[color:var(--color-text-strong)] sm:mt-2.5 sm:text-xl">
                {data.heroStatLabel}
              </p>
            </motion.div>

            <div
              className="mt-5 border-t border-dashed border-[color:var(--color-border)]"
              aria-hidden="true"
            />

            {metrics.length > 0 ? (
              <>
                <motion.dl
                  variants={fadeUp}
                  className="mt-5 flex flex-wrap gap-x-12 gap-y-4 sm:gap-x-16"
                >
                  {metrics.map((metric, idx) => {
                    const key = `${metric.label}-${metric.value}`;
                    const icon = idx === 0 ? ICONS.users : ICONS.globe;

                    return (
                      <div key={key} className="flex min-w-0 flex-col items-start">
                        <div
                          className="mb-3.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--color-brand-500)] bg-[color:var(--color-ornament-accent-bg)]"
                          aria-hidden="true"
                        >
                          {icon}
                        </div>

                        <dt className="sr-only">{metric.label}</dt>
                        <dd className="text-lg font-bold text-[color:var(--color-text-strong)] sm:text-xl">
                          {metric.value}
                        </dd>
                        <div className="mt-1 text-sm text-[color:var(--color-muted)] sm:whitespace-nowrap">
                          {metric.label}
                        </div>
                      </div>
                    );
                  })}
                </motion.dl>

                <div
                  className="mt-5 border-t border-dashed border-[color:var(--color-border)]"
                  aria-hidden="true"
                />
              </>
            ) : null}

            {/* WHAT YOU GET (Capabilities) — stays fully inside left column; never encroached */}
            <motion.div variants={fadeUp} className="mt-5">
              <h3 className="text-[11px] font-bold tracking-[0.14em] text-[color:var(--color-muted)] uppercase">
                {data.capabilitiesHeading}
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-y-3 min-[1025px]:grid-cols-2 min-[1025px]:gap-x-14">
                <ul className="min-w-0 space-y-2.5 text-sm leading-[1.45] text-[color:var(--color-text)] sm:text-[15px]">
                  {capLeft.map((item) => (
                    <li key={item} className="min-w-0">
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="min-w-0 space-y-2.5 text-sm leading-[1.45] text-[color:var(--color-text)] sm:text-[15px]">
                  {capRight.map((item) => (
                    <li key={item} className="min-w-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: map — right-justified, contained, never overlaps */}
          <motion.figure
            variants={fadeUp}
            className={cn(
              "relative w-full min-w-0 min-h-[240px] sm:min-h-[300px]",
              "min-[1025px]:h-full min-[1025px]:min-h-0 min-[1025px]:justify-self-end min-[1025px]:max-w-[760px] min-[1025px]:pl-2",
            )}
            style={{ contain: "layout paint" }}
            aria-label="Network map"
          >
            <div className="absolute inset-0 overflow-hidden">
              {data.mapImage ? (
                <Image
                  src={data.mapImage}
                  alt="NPT Logistics offices across North America"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-[color:var(--color-muted)]">
                  Map
                </div>
              )}
            </div>

            <figcaption className="sr-only">NPT Logistics network coverage map</figcaption>
          </motion.figure>
        </motion.div>
      </Container>
    </Section>
  );
}
