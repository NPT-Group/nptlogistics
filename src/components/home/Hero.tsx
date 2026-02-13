"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

const VIDEO_DESKTOP = "/hero/hero-desktop.mp4";
const VIDEO_MOBILE = "/hero/hero-mobile.mp4";
const POSTER = "/hero/hero-poster.png";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const desktopVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [desktopVideoState, setDesktopVideoState] = React.useState<"loading" | "ready" | "failed">(
    "loading",
  );
  const [mobileVideoState, setMobileVideoState] = React.useState<"loading" | "ready" | "failed">(
    "loading",
  );

  const markDesktopReady = React.useCallback(() => setDesktopVideoState("ready"), []);
  const markMobileReady = React.useCallback(() => setMobileVideoState("ready"), []);
  const markDesktopFailed = React.useCallback(() => setDesktopVideoState("failed"), []);
  const markMobileFailed = React.useCallback(() => setMobileVideoState("failed"), []);

  // Watchdog: some browsers can fail silently on bad src.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const el = desktopVideoRef.current;
      if (!el || desktopVideoState !== "loading") return;
      if (el.error || el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        setDesktopVideoState("failed");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [desktopVideoState]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const el = mobileVideoRef.current;
      if (!el || mobileVideoState !== "loading") return;
      if (el.error || el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        setMobileVideoState("failed");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [mobileVideoState]);

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } } };

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="relative overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0">
        {desktopVideoState === "failed" ? (
          <div
            className="absolute inset-0 hidden bg-cover bg-center md:block"
            style={{ backgroundImage: `url(${POSTER})` }}
            aria-hidden="true"
          />
        ) : null}
        {mobileVideoState === "failed" ? (
          <div
            className="absolute inset-0 block bg-cover bg-center md:hidden"
            style={{ backgroundImage: `url(${POSTER})` }}
            aria-hidden="true"
          />
        ) : null}

        <video
          ref={desktopVideoRef}
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          onLoadedData={markDesktopReady}
          onCanPlay={markDesktopReady}
          onError={markDesktopFailed}
          src={VIDEO_DESKTOP}
        />

        <video
          ref={mobileVideoRef}
          className="absolute inset-0 block h-full w-full object-cover md:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          onLoadedData={markMobileReady}
          onCanPlay={markMobileReady}
          onError={markMobileFailed}
          src={VIDEO_MOBILE}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15"
          aria-hidden="true"
        />

        {/* Bottom fade into site background — shorter so more video shows */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[color:var(--color-surface-0)]"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-6">
          <motion.div
            className={cn(
              "relative z-10 flex flex-col justify-center",
              "min-h-[85svh] md:min-h-[80svh]",
              "pt-14 pb-24 sm:pt-20 sm:pb-28 lg:pt-24",
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
                "mb-5 inline-flex w-fit items-center gap-2 rounded-full",
                "border border-white/18 bg-white/10 px-3 py-1 text-xs text-white",
                "backdrop-blur",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
              Asset based trucking across North America
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
              className={cn(
                "max-w-4xl leading-[1.05] font-bold text-white",
                "text-4xl sm:text-5xl lg:text-6xl",
              )}
            >
              North America moves fast.
              <br className="hidden sm:block" />
              Your freight should too.
            </motion.h1>

            {/* Subtext with left accent — no box, clean bar + type only */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-5 max-w-2xl"
            >
              <p
                className={cn(
                  "border-l-2 border-[color:var(--color-brand-500)] pl-5",
                  "text-base text-pretty text-white/90 sm:text-lg",
                  "leading-relaxed tracking-wide",
                )}
              >
                Truckload, LTL, intermodal, and cross border shipping with proactive updates,
                compliance first execution, and clear handoffs from pickup to delivery.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/contact"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
                  "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                  "shadow-sm shadow-black/25",
                  focusRing,
                )}
              >
                Contact Us
              </Link>

              <Link
                href="/#solutions"
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
                  "border border-white/22 bg-white/10 text-white hover:bg-white/15",
                  "backdrop-blur",
                  focusRing,
                )}
              >
                Our Services
              </Link>
            </motion.div>

            {/* Micro trust strip (3 items max) */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75"
              aria-label="Key capabilities"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                Canada USA Mexico coverage
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                24/7 dispatch support
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                Real time shipment visibility
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
