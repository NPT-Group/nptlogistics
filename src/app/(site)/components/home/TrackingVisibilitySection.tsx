"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { SectionImage } from "@/components/media/SectionImage";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";

const TRACKING_VISIBILITY_TOKENS = {
  focusRing:
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5eee6]",
  sectionClass: cn(
    "relative overflow-hidden",
    "bg-[linear-gradient(165deg,#f7f1ea_0%,#efe3d6_52%,#e7d8c8_100%)]",
    "border-t border-[color:var(--color-border-light)]/50",
  ),
  ambientLayerClass: "pointer-events-none absolute inset-0",
  ambientWarmGlowStyle: {
    background: "radial-gradient(760px 420px at 14% 14%, rgba(180,83,9,0.09), transparent 64%)",
  },
  ambientRoseGlowStyle: {
    background: "radial-gradient(980px 560px at 86% 112%, rgba(190,24,93,0.08), transparent 66%)",
  },
  ambientWashClass:
    "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.42))]",
  containerClass: "relative max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-6 lg:py-16",
  gridClass: "grid items-center gap-10 lg:grid-cols-12 lg:gap-12",
  mapMotionClass: "relative order-2 lg:order-2 lg:col-span-7",
  mapWrapperClass: "relative aspect-[16/10] w-full overflow-hidden",
  mapImageClass:
    "-translate-y-[2%] scale-[1.26] object-contain object-center brightness-[1.02] contrast-[1.02] saturate-[0.9]",
  mapSignalLayerClass: "pointer-events-none absolute inset-0",
  mapSignalPulseClass:
    "absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-brand-500)]/45",
  mapSignalCoreClass:
    "absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-brand-500)]/80",
  mapSignalGlowClass:
    "absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-brand-500)]/20 blur-[1px]",
  copyMotionClass: "order-1 lg:order-1 lg:col-span-5",
  eyebrowLineClass: "mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]",
  kickerClass: "text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]",
  headingClass:
    "mt-2 text-3xl font-semibold text-[color:var(--color-text-light)] sm:text-4xl lg:text-[2.35rem]",
  bodyClass:
    "mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base",
  bulletsListClass: "mt-6 space-y-3",
  bulletItemClass: cn(
    "rounded-2xl border border-[color:var(--color-border-light)]/65",
    "bg-[linear-gradient(140deg,rgba(255,255,255,0.72),rgba(255,255,255,0.46))]",
    "px-4 py-3",
    "shadow-[0_16px_36px_rgba(2,6,23,0.1),inset_0_1px_0_rgba(255,255,255,0.82)]",
    "backdrop-blur-2xl",
  ),
  bulletRowClass: "flex items-start gap-3",
  bulletDotClass: "mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-brand-500)]",
  bulletTitleClass: "text-sm font-semibold text-[color:var(--color-text-light)]",
  bulletDescriptionClass: "mt-1 text-[13px] leading-relaxed text-[color:var(--color-muted-light)]",
  ctaRowClass: "mt-7 flex justify-start",
  ctaButtonClass: cn(
    "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
    "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
    "shadow-sm shadow-black/8",
  ),
} as const;

type SignalNode = {
  id: string;
  left: string;
  top: string;
  delay: number;
};

const TRACKING_SIGNAL_NODES: SignalNode[] = [
  { id: "west", left: "48%", top: "21%", delay: 0 },
  { id: "central", left: "35%", top: "60%", delay: 0.85 },
  { id: "east", left: "52%", top: "49%", delay: 1.7 },
];

type Bullet = { title: string; description?: string };

const BULLETS: Bullet[] = [
  {
    title: "Real-time shipment status you can trust",
    description: "Live milestone updates with context, not noise.",
  },
  {
    title: "Proactive exception management",
    description: "When conditions shift, we alert early and execute a recovery plan fast.",
  },
  {
    title: "Single-thread communication",
    description:
      "one accountable team that coordinates tracking and updates, so you never have to wonder where your shipment is.",
  },
];

export function TrackingVisibilitySection() {
  const reduceMotion = useReducedMotion();
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapInView = useInView(mapRef, { amount: 0.25 });

  return (
    <section id="tracking" className={TRACKING_VISIBILITY_TOKENS.sectionClass}>
      {/* Ambient premium transitional background */}
      <div className={TRACKING_VISIBILITY_TOKENS.ambientLayerClass} aria-hidden="true">
        <div className="absolute inset-0" style={TRACKING_VISIBILITY_TOKENS.ambientWarmGlowStyle} />
        <div className="absolute inset-0" style={TRACKING_VISIBILITY_TOKENS.ambientRoseGlowStyle} />
        <div className={TRACKING_VISIBILITY_TOKENS.ambientWashClass} />
      </div>

      <Container className={TRACKING_VISIBILITY_TOKENS.containerClass}>
        <div className={TRACKING_VISIBILITY_TOKENS.gridClass}>
          {/* Map (right on desktop) */}
          <motion.div
            className={TRACKING_VISIBILITY_TOKENS.mapMotionClass}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* The map image */}
            <div ref={mapRef} className={TRACKING_VISIBILITY_TOKENS.mapWrapperClass}>
              <SectionImage
                src="/_optimized/tracking/Tracking-map2.webp"
                alt="North America shipment tracking coverage map"
                fill
                className={TRACKING_VISIBILITY_TOKENS.mapImageClass}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {!reduceMotion && mapInView ? (
                <div className={TRACKING_VISIBILITY_TOKENS.mapSignalLayerClass} aria-hidden="true">
                  {TRACKING_SIGNAL_NODES.map((node) => (
                    <motion.span
                      key={node.id}
                      className={TRACKING_VISIBILITY_TOKENS.mapSignalPulseClass}
                      style={{ left: node.left, top: node.top }}
                      animate={{ scale: [0.88, 1.32, 1.32], opacity: [0.26, 0.08, 0] }}
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        repeatDelay: 0.35,
                        ease: "easeOut",
                        delay: node.delay,
                      }}
                    />
                  ))}
                  {TRACKING_SIGNAL_NODES.map((node) => (
                    <span
                      key={`${node.id}-core`}
                      className={TRACKING_VISIBILITY_TOKENS.mapSignalCoreClass}
                      style={{ left: node.left, top: node.top }}
                    />
                  ))}
                  {TRACKING_SIGNAL_NODES.map((node) => (
                    <span
                      key={`${node.id}-glow`}
                      className={TRACKING_VISIBILITY_TOKENS.mapSignalGlowClass}
                      style={{ left: node.left, top: node.top }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>

          {/* Copy (left on desktop) */}
          <motion.div
            className={TRACKING_VISIBILITY_TOKENS.copyMotionClass}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: reduceMotion ? 0 : 0.05 }}
          >
            <div className={TRACKING_VISIBILITY_TOKENS.eyebrowLineClass} />
            <div className={TRACKING_VISIBILITY_TOKENS.kickerClass}>Tracking &amp; Visibility</div>

            <h2 className={TRACKING_VISIBILITY_TOKENS.headingClass}>
              Efficiency Through Real-Time Insight
            </h2>

            <p className={TRACKING_VISIBILITY_TOKENS.bodyClass}>
              Tracking is only valuable when it improves outcomes. We combine live location data
              with operational control, proactive communication, and exception recovery.
            </p>

            {/* Bullets */}
            <ul className={TRACKING_VISIBILITY_TOKENS.bulletsListClass}>
              {BULLETS.map((b) => (
                <li key={b.title} className={TRACKING_VISIBILITY_TOKENS.bulletItemClass}>
                  <div className={TRACKING_VISIBILITY_TOKENS.bulletRowClass}>
                    <span
                      className={TRACKING_VISIBILITY_TOKENS.bulletDotClass}
                      aria-hidden="true"
                    />
                    <div>
                      <div className={TRACKING_VISIBILITY_TOKENS.bulletTitleClass}>{b.title}</div>
                      {b.description ? (
                        <div className={TRACKING_VISIBILITY_TOKENS.bulletDescriptionClass}>
                          {b.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className={TRACKING_VISIBILITY_TOKENS.ctaRowClass}>
              <Link
                href="/tracking"
                onClick={() =>
                  trackCtaClick({
                    ctaId: "tracking_primary_track_shipment",
                    location: "tracking_visibility",
                    destination: "/tracking",
                    label: "Track Shipment",
                  })
                }
                className={cn(
                  TRACKING_VISIBILITY_TOKENS.ctaButtonClass,
                  TRACKING_VISIBILITY_TOKENS.focusRing,
                )}
              >
                Track Shipment
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
