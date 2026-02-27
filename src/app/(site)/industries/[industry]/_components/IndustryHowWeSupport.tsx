"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import type { IndustryPageModel } from "@/config/industryPages";
import { cn } from "@/lib/cn";
import {
  THEME_ACCENT,
  THEME_BG,
  getThemeBarGradient,
  getThemeOrbs,
} from "./industryTheme";

export function IndustryHowWeSupport({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { howWeSupport, hero } = model;

  const theme = hero.theme;
  const sectionBg = THEME_BG[theme];
  const accentColor = THEME_ACCENT[theme];
  const orbs = getThemeOrbs(theme);
  const barGradient = getThemeBarGradient(theme);

  // --- Variants ---
  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: "easeOut" },
        },
      };

  const slideRight: Variants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : {
        hidden: { opacity: 0, x: -22 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.42, ease: "easeOut" },
        },
      };

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
      };

  /**
   * PRODUCTION TUNING
   * - Truck uses object-cover to span full width and feel like it's carrying the cards.
   * - BED_Y positions the card row so they sit on the flatbed (visually loaded).
   * - CAB_GUTTER keeps cards from overlapping the cab.
   */
  const STAGE_H = "h-[380px] lg:h-[440px]";
  const TRUCK_H = "h-[280px] lg:h-[340px]"; // full-width strip so truck dominates
  const BED_Y = "top-[135px] lg:top-[118px]"; // cards sit on the flatbed (bed surface lines up with card bottom)

  const CAB_GUTTER = "lg:pr-[380px]"; // reserve right space for cab
  const CARDS_NUDGE = "lg:-translate-x-2"; // align card row with bed

  return (
    <Section
      variant="dark"
      id="how-we-support"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      {/* Orbs (behind content) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -top-40 -left-40 h-[680px] w-[680px] rounded-full"
          style={{
            background: `radial-gradient(circle,${orbs.main},transparent 60%)`,
          }}
        />
        <div
          className="absolute -right-40 -bottom-40 h-[560px] w-[560px] rounded-full"
          style={{
            background: `radial-gradient(circle,${orbs.secondary},transparent 65%)`,
          }}
        />
      </div>

      {/* Grid (very subtle, behind content) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Road motion: fast streaks under the truck so it clearly reads as “moving” */}
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[120px] lg:h-[140px] opacity-50"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 20px, rgba(255,255,255,0.75) 20px, rgba(255,255,255,0.75) 28px)",
              backgroundSize: "48px 100%",
              animation: "howWeSupportRoad 0.5s linear infinite",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[120px] lg:h-[140px] opacity-40"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 24px, rgba(255,255,255,0.7) 24px, rgba(255,255,255,0.7) 32px)",
              backgroundSize: "48px 100%",
              animation: "howWeSupportRoad 0.42s linear infinite",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[120px] lg:h-[140px] opacity-35"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent 16px, rgba(255,255,255,0.65) 16px, rgba(255,255,255,0.65) 24px)",
              backgroundSize: "48px 100%",
              animation: "howWeSupportRoad 0.58s linear infinite",
            }}
          />
        </div>
      )}

      {/* Header (tight, premium) */}
      <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="pt-10 pb-4 sm:pt-12 sm:pb-4" // tighter than before
        >
          <motion.header variants={fadeUp} className="mb-3 sm:mb-4">
            <div className="mb-3 flex items-center gap-2.5">
              <div
                className="h-[2px] w-10 sm:w-14"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="text-[10.5px] font-bold tracking-[0.15em] uppercase"
                style={{ color: accentColor }}
              >
                Our approach
              </span>
            </div>

            <h2 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
              {howWeSupport.sectionTitle}
            </h2>
          </motion.header>
        </motion.div>
      </Container>

      {/* =========================
          MOBILE ONLY (narrow viewports: cards only)
         ========================= */}
      <div className="md:hidden">
        <Container className="relative max-w-[1440px] px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2"
          >
            {howWeSupport.steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                variants={slideRight}
                barGradient={barGradient}
                reduceMotion={reduceMotion ?? false}
                allowWidthGrow={false}
              />
            ))}
          </motion.div>
        </Container>

        <div className="h-10" />
      </div>

      {/* =========================
          TABLET + DESKTOP (truck full width + cards on bed)
         ========================= */}
      <div className={cn("relative z-10 hidden w-full overflow-visible md:block", STAGE_H)}>
        {/* Truck: full width, above cards in stack so it’s visible */}
        <motion.div
          aria-hidden
          className={cn("absolute left-0 right-0 bottom-0 z-10", TRUCK_H)}
          initial={false}
          animate={reduceMotion ? undefined : { x: [0, -6, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 5.5, ease: "easeInOut", repeat: Infinity }
          }
        >
          <div className="relative h-full w-full">
            <Image
              src="/industries/movingTruckImg.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[1.06] contrast-[1.02]"
            />


            {/* bed (sells “cards sitting on bed”) */}
          </div>
        </motion.div>

        {/* Cards anchored to bed line (above truck so they read as “on” the bed) */}
        <div className={cn("absolute inset-x-0 z-20", BED_Y)}>
          <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:px-6">
            {/* Cab gutter + nudge so cards stay on bed and never enter cab */}
            <div className={cn("relative", CAB_GUTTER, CARDS_NUDGE)}>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="grid gap-5 lg:grid-cols-4"
              >
                {howWeSupport.steps.map((step, i) => (
                  <StepCard
                    key={i}
                    step={step}
                    variants={slideRight}
                    barGradient={barGradient}
                    reduceMotion={reduceMotion ?? false}
                    allowWidthGrow
                  />
                ))}
              </motion.div>

              {/* Contact shadow for premium depth */}
              <div className="pointer-events-none mt-4 h-8 w-full">
                <div
                  className="mx-auto h-full max-w-[1100px] opacity-55 blur-[18px]"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(0,0,0,0.62), transparent 70%)",
                  }}
                />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* tight bottom spacing */}
      <div className="h-6 sm:h-8" />
    </Section>
  );
}

function StepCard({
  step,
  variants,
  barGradient,
  reduceMotion,
  allowWidthGrow,
}: {
  step: { title: string; description: string };
  variants: Variants;
  barGradient: string;
  reduceMotion: boolean;
  allowWidthGrow: boolean;
}) {
  return (
    <motion.article
      variants={variants}
      animate={
        reduceMotion ? undefined : { y: [0, -1.5, 0] } // ultra subtle “road” bob
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 6.0, ease: "easeInOut", repeat: Infinity }
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)]",
        "bg-[rgba(18,18,22,0.62)] backdrop-blur-md",
        "shadow-[0_10px_44px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]",
        "p-6",
        "min-h-[160px]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:border-[rgba(255,255,255,0.18)] hover:shadow-[0_14px_60px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.10)]",
        allowWidthGrow &&
          "origin-left hover:scale-x-[1.22] hover:z-20 will-change-transform",
      )}
    >
      <div
        className="absolute left-0 right-0 top-0 h-[2px] rounded-t-2xl"
        style={{ background: barGradient }}
        aria-hidden
      />

      <h3 className="text-[1rem] font-semibold leading-snug tracking-tight text-white">
        {step.title}
      </h3>

      <p
        className={cn(
          "mt-2.5 text-[12.5px] leading-[1.72] text-[rgba(255,255,255,0.65)] sm:text-[13px]",
          "transition-[color] duration-200",
          "group-hover:text-[rgba(255,255,255,0.78)]",
          "line-clamp-3",
          allowWidthGrow && "group-hover:line-clamp-none",
        )}
      >
        {step.description}
      </p>
    </motion.article>
  );
}