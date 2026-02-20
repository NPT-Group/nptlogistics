"use client";

import React from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";

const glassCard = cn(
  "relative overflow-hidden rounded-2xl",
  "border border-white/60 bg-white/[0.32] backdrop-blur-xl",
  "shadow-[0_8px_32px_rgba(15,23,42,0.06),0_0_0_1px_rgba(255,255,255,0.4)_inset]",
  "transition duration-300 ease-out",
  "hover:-translate-y-1 hover:bg-white/45 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:border-white/70",
);

const cardLink = cn(
  "mt-6 inline-flex items-center gap-2 rounded-lg py-2 pr-2.5 pl-3 -ml-3 text-sm font-semibold",
  "text-[color:var(--color-brand-600)]",
  "bg-[color:var(--color-brand-600)]/8",
  "hover:bg-[color:var(--color-brand-600)]/14",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--audience-bg)]",
  "[&>.arrow]:inline-block [&>.arrow]:transition-all [&>.arrow]:duration-300 [&>.arrow]:ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "[&:hover>.arrow]:translate-x-1.5 [&:hover>.arrow]:scale-110 [&:hover>.arrow]:opacity-100 [&>.arrow]:opacity-75",
);

/** Animated number that counts from 0 to target when scrolled into view */
function AnimatedStat({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    const duration = 1000; // 1 second - fast and smooth
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;

      if (decimals === 0) {
        setDisplayValue(Math.floor(current));
      } else {
        setDisplayValue(Number(current.toFixed(decimals)));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

const AUDIENCE_CARDS = [
  {
    id: "shipper",
    title: "I'm Shipping Freight",
    description:
      "Find the right service for your lane, timeline, and requirements with a fast response.",
    href: "/#solutions",
    label: "Explore Solutions",
  },
  {
    id: "tracking",
    title: "I Need Tracking or Status",
    description:
      "Get shipment status and updates with a clear path to the right team when you need help.",
    href: "/tracking",
    label: "Track Shipment",
  },
  {
    id: "careers",
    title: "I Want to Work at NPT",
    description:
      "View open roles and join a team built on safety, discipline, and operational excellence.",
    href: "/careers#jobs",
    label: "View Jobs",
  },
] as const;

export function AudienceSection() {
  return (
    <section
      className={cn("relative overflow-hidden bg-[color:var(--audience-bg)]", "py-12 sm:py-16")}
    >
      {/* Very subtle warmth — soft red tint from top, barely there */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(800px_600px_at_80%_100%,rgba(220,38,38,0.06),transparent_50%)]",
        )}
        aria-hidden="true"
      />

      <Container>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-600)]/90" />

          <div className="text-xs font-semibold tracking-wide text-[color:var(--audience-muted)]">
            Choose your path
          </div>

          <h2 className="mt-3 text-3xl font-semibold text-[color:var(--audience-text)] sm:text-4xl">
            Get the right answer fast, from a team built to execute.
          </h2>

          {/* Proof line: > reads as "more than" — minimal and confident */}
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-sm text-[color:var(--audience-muted)] sm:text-base">
            <span className="font-medium text-[color:var(--audience-text)]">
              <span className="font-semibold text-[color:var(--color-brand-600)] tabular-nums">
                &gt;
                <AnimatedStat target={250} suffix="k" />
              </span>{" "}
              loads moved
            </span>
            <span className="text-[color:var(--audience-muted)]/40" aria-hidden>
              ·
            </span>
            <span className="font-medium text-[color:var(--audience-text)]">
              <span className="font-semibold text-[color:var(--color-brand-600)] tabular-nums">
                <AnimatedStat target={98} suffix="%" />
              </span>{" "}
              on time
            </span>
            <span className="text-[color:var(--audience-muted)]/40" aria-hidden>
              ·
            </span>
            <span className="font-medium text-[color:var(--audience-text)]">
              <span className="font-semibold text-[color:var(--color-brand-600)] tabular-nums">
                &gt;
                <AnimatedStat target={25} suffix="k" />
              </span>{" "}
              cross border shipments
            </span>
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 min-[680px]:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE_CARDS.map((card) => (
            <div key={card.id} className={glassCard}>
              {/* Subtle red tint bottom-right for elegant glass */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-[color:var(--color-brand-500)]/10"
                aria-hidden
              />
              <div className="relative z-10 p-6">
                <div className="text-lg font-semibold text-[color:var(--audience-text)]">
                  {card.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--audience-muted)]">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  onClick={() =>
                    trackCtaClick({
                      ctaId: `audience_${card.id}`,
                      location: "audience_section",
                      destination: card.href,
                      label: card.label,
                    })
                  }
                  className={cardLink}
                >
                  {card.label}
                  <span aria-hidden className="arrow">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
