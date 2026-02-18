"use client";

// src/app/(site)/services/[service]/_components/ServiceHero.tsx
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import type { ServicePageModel } from "@/config/services";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0)]";

function overlayStyle(overlay?: ServicePageModel["hero"]["overlay"]) {
  switch (overlay) {
    case "red":
      return "bg-[linear-gradient(180deg,rgba(185,28,28,0.65),rgba(127,29,29,0.75),rgba(2,6,23,0.95))]";
    case "blue":
      return "bg-[linear-gradient(180deg,rgba(30,58,138,0.52),rgba(2,6,23,0.92))]";
    case "slate":
      return "bg-[linear-gradient(180deg,rgba(30,41,59,0.56),rgba(2,6,23,0.92))]";
    default:
      return "bg-[linear-gradient(180deg,rgba(2,6,23,0.45),rgba(2,6,23,0.92))]";
  }
}

export function ServiceHero({ model }: { model: ServicePageModel }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-0)]">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={model.hero.image}
          alt={model.hero.imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Strong baseline overlay to ensure text contrast across all images */}
        <div className={cn("absolute inset-0", overlayStyle(model.hero.overlay))} />

        {/* Enhanced premium lighting for red overlay */}
        {model.hero.overlay === "red" ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_15%,rgba(220,38,38,0.25),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_20%,rgba(185,28,28,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.40))]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(220,38,38,0.18),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(820px_520px_at_92%_18%,rgba(37,99,235,0.10),transparent_62%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.34))]" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(7,10,18,0.55)_45%,rgba(7,10,18,0.9))]" />
      </div>

      <Container className="relative max-w-[1440px] px-4 py-14 sm:px-6 sm:py-18 lg:px-6 lg:py-22">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-[760px]"
        >
          <div className="mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />

          <div className="text-xs font-semibold tracking-wide text-white/70">
            {model.hero.kicker}
          </div>

          <h1 className="mt-2 text-[2.25rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl">
            {model.hero.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
            {model.hero.description}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={model.hero.primaryCta.href}
              onClick={() =>
                trackCtaClick({
                  ctaId: model.hero.primaryCta.ctaId,
                  location: `service_hero:${model.key}`,
                  destination: model.hero.primaryCta.href,
                  label: model.hero.primaryCta.label,
                })
              }
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold",
                "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                "shadow-[0_12px_28px_rgba(220,38,38,0.28)]",
                focusRing,
              )}
            >
              {model.hero.primaryCta.label}
            </Link>

            <Link
              href={model.hero.secondaryCta.href}
              onClick={() =>
                trackCtaClick({
                  ctaId: model.hero.secondaryCta.ctaId,
                  location: `service_hero:${model.key}`,
                  destination: model.hero.secondaryCta.href,
                  label: model.hero.secondaryCta.label,
                })
              }
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold",
                "border border-white/22 bg-white/8 text-white hover:bg-white/12",
                focusRing,
              )}
            >
              {model.hero.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/60">
            Built for lane consistency, clean handoffs, and faster exception recovery.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
