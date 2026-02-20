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

function buildMicroSignals(note?: string) {
  if (!note) return [];
  return note
    .split(",")
    .flatMap((part) => part.split(/\s+and\s+/i))
    .map((part) => part.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .slice(0, 3);
}

export function ServiceHero({ model }: { model: ServicePageModel }) {
  const reduceMotion = useReducedMotion();
  const isCrossBorder = model.key === "cross-border";
  const isValueAdded = model.key === "value-added";
  const isExpeditedSpecialized = model.key === "expedited-specialized";
  const isLtl = model.key === "ltl";
  const isIntermodal = model.key === "intermodal";
  const isHazmat = model.key === "hazmat";
  const isTempControlled = model.key === "temperature-controlled";
  const isSingleService = Boolean(model.singleLayout && (!model.sections || model.sections.length === 0));
  const microSignals = buildMicroSignals(model.hero.microNote);

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
          className={cn(
            "max-w-[760px]",
            isSingleService && "mx-auto max-w-[900px] text-center",
          )}
        >
          <div
            className={cn(
              "mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]",
              isSingleService && "mx-auto",
            )}
          />

          <div className="text-xs font-semibold tracking-wide text-white/70">
            {model.hero.kicker}
          </div>

          <h1 className="mt-2 text-[2.25rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl">
            {model.hero.title}
          </h1>

          <p className={cn("mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base", isSingleService && "mx-auto")}>
            {model.hero.description}
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "mt-7 flex flex-wrap items-center gap-3",
              isSingleService && "justify-center",
            )}
          >
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
                "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:h-11",
                isCrossBorder
                  ? "border border-cyan-300/55 bg-[linear-gradient(180deg,rgba(14,165,233,0.88),rgba(2,132,199,0.88))] text-white shadow-[0_14px_28px_rgba(14,116,144,0.34)] hover:bg-[linear-gradient(180deg,rgba(14,165,233,0.96),rgba(2,132,199,0.96))]"
                  : isValueAdded
                    ? "border border-emerald-300/48 bg-[linear-gradient(180deg,rgba(5,150,105,0.9),rgba(4,120,87,0.9))] text-white shadow-[0_14px_28px_rgba(5,150,105,0.32)] hover:bg-[linear-gradient(180deg,rgba(5,150,105,0.98),rgba(4,120,87,0.98))]"
                  : isExpeditedSpecialized
                    ? "border border-fuchsia-300/50 bg-[linear-gradient(180deg,rgba(236,72,153,0.9),rgba(124,58,237,0.9))] text-white shadow-[0_14px_28px_rgba(124,58,237,0.34)] hover:bg-[linear-gradient(180deg,rgba(236,72,153,0.98),rgba(124,58,237,0.98))]"
                  : isLtl
                    ? "border border-red-300/52 bg-[linear-gradient(180deg,rgba(220,38,38,0.9),rgba(185,28,28,0.9))] text-white shadow-[0_14px_28px_rgba(185,28,28,0.34)] hover:bg-[linear-gradient(180deg,rgba(220,38,38,0.98),rgba(185,28,28,0.98))]"
                  : isIntermodal
                    ? "border border-blue-300/50 bg-[linear-gradient(180deg,rgba(37,99,235,0.9),rgba(30,64,175,0.9))] text-white shadow-[0_14px_28px_rgba(30,64,175,0.34)] hover:bg-[linear-gradient(180deg,rgba(37,99,235,0.98),rgba(30,64,175,0.98))]"
                  : isHazmat
                    ? "border border-rose-300/52 bg-[linear-gradient(180deg,rgba(190,18,60,0.9),rgba(153,27,27,0.9))] text-white shadow-[0_14px_28px_rgba(153,27,27,0.35)] hover:bg-[linear-gradient(180deg,rgba(190,18,60,0.98),rgba(153,27,27,0.98))]"
                  : isTempControlled
                    ? "border border-cyan-300/52 bg-[linear-gradient(180deg,rgba(2,132,199,0.9),rgba(14,116,144,0.9))] text-white shadow-[0_14px_28px_rgba(14,116,144,0.34)] hover:bg-[linear-gradient(180deg,rgba(2,132,199,0.98),rgba(14,116,144,0.98))]"
                  : "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)] shadow-[0_12px_28px_rgba(220,38,38,0.28)]",
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
                "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:h-11",
                isCrossBorder
                  ? "border border-cyan-300/45 bg-[rgba(2,6,23,0.18)] text-cyan-100 hover:bg-[rgba(6,182,212,0.14)]"
                  : isValueAdded
                    ? "border border-emerald-300/40 bg-[rgba(2,6,23,0.2)] text-emerald-100 hover:bg-[rgba(5,150,105,0.18)]"
                  : isExpeditedSpecialized
                    ? "border border-fuchsia-300/42 bg-[rgba(2,6,23,0.22)] text-fuchsia-100 hover:bg-[rgba(236,72,153,0.16)]"
                  : isLtl
                    ? "border border-red-300/42 bg-[rgba(2,6,23,0.2)] text-red-100 hover:bg-[rgba(220,38,38,0.16)]"
                  : isIntermodal
                    ? "border border-blue-300/40 bg-[rgba(2,6,23,0.2)] text-blue-100 hover:bg-[rgba(37,99,235,0.16)]"
                  : isHazmat
                    ? "border border-rose-300/40 bg-[rgba(2,6,23,0.22)] text-rose-100 hover:bg-[rgba(190,18,60,0.16)]"
                  : isTempControlled
                    ? "border border-cyan-300/40 bg-[rgba(2,6,23,0.2)] text-cyan-100 hover:bg-[rgba(2,132,199,0.16)]"
                  : "border border-white/22 bg-white/8 text-white hover:bg-white/12",
                focusRing,
              )}
            >
              {model.hero.secondaryCta.label}
            </Link>
          </div>

          {isCrossBorder ? (
            <div className={cn("mt-4 flex flex-wrap gap-2", isSingleService && "justify-center")}>
              {(microSignals.length > 0
                ? microSignals
                : ["Customs-ready handoffs", "Proactive milestones", "Mode-fit guidance"]
              ).map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-full border border-cyan-300/42 bg-[rgba(2,6,23,0.26)] px-3 py-1 text-xs font-medium text-cyan-100/95 backdrop-blur-[1px]"
                >
                  {signal}
                </span>
              ))}
            </div>
          ) : isValueAdded ? (
            <div className={cn("mt-4 flex flex-wrap gap-2", isSingleService && "justify-center")}>
              {(microSignals.length > 0
                ? microSignals
                : ["Inventory flow stability", "Capacity assurance", "Execution governance"]
              ).map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-md border border-emerald-300/35 bg-[rgba(2,6,23,0.26)] px-2.5 py-1 text-[11px] font-medium text-emerald-100/95 backdrop-blur-[1px]"
                >
                  {signal}
                </span>
              ))}
            </div>
          ) : isExpeditedSpecialized ? (
            <div className={cn("mt-4 flex flex-wrap gap-2", isSingleService && "justify-center")}>
              {(microSignals.length > 0
                ? microSignals
                : ["Deadline-first planning", "Specialized equipment fit", "Milestone-led control"]
              ).map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-full border border-fuchsia-300/40 bg-[rgba(2,6,23,0.28)] px-3 py-1 text-[11px] font-medium text-fuchsia-100/95 backdrop-blur-[1px]"
                >
                  {signal}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-white/60">
              {model.hero.microNote ??
                "Built for lane consistency, clean handoffs, and faster exception recovery."}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
