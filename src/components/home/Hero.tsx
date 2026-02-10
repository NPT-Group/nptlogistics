"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

const VIDEO_DESKTOP = "/hero/hero-desktop.mp4";
const VIDEO_MOBILE = "/hero/hero-mobile.mp4";
const POSTER = "/hero/hero-poster.png";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const stagger: Variants = reduceMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      };

  const fadeUp: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      };

  return (
    <section className="relative overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0">
        {/* Poster fallback ALWAYS exists */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER})` }}
          aria-hidden="true"
        />

        {/* Desktop video */}
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          disablePictureInPicture
        >
          <source src={VIDEO_DESKTOP} type="video/mp4" />
        </video>

        {/* Mobile video */}
        <video
          className="absolute inset-0 block h-full w-full object-cover md:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          disablePictureInPicture
        >
          <source src={VIDEO_MOBILE} type="video/mp4" />
        </video>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/30 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <Container>
          <motion.div
            className={cn(
              "relative z-10",
              "min-h-[calc(100svh-64px)]",
              "flex flex-col justify-center",
              "py-16 sm:py-20",
            )}
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className={cn(
                "mb-4 inline-flex w-fit items-center gap-2 rounded-full",
                "border border-white/20 bg-white/10 px-3 py-1 text-xs text-white",
                "backdrop-blur",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-600)]" />
              Asset-based trucking • North America
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="max-w-2xl text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl"
            >
              Reliable freight solutions
              <br className="hidden sm:block" /> across North America
            </motion.h1>

            {/* Subcopy */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-4 max-w-xl text-base text-white/80 sm:text-lg"
            >
              Truckload, LTL, intermodal, and cross-border shipping built on compliance, visibility,
              and execution.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/quote"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium",
                  "bg-white text-black hover:bg-white/90",
                  "focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none",
                )}
              >
                Request a Quote
              </Link>

              <Link
                href="/#core-solutions"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium",
                  "border border-white/20 bg-white/10 text-white hover:bg-white/15",
                  "backdrop-blur",
                  "focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none",
                )}
              >
                Our Services
              </Link>
            </motion.div>

            {/* Value props */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                Canada ↔ USA coverage
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                24/7 dispatch support
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                Real-time visibility
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
