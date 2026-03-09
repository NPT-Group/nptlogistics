"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { HeroImage } from "@/components/media/HeroImage";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";

type HeroData = Readonly<{
  title: string;
  description: string;
  ctas: {
    primary: { label: string; href: string; ctaId: string };
    secondary: { label: string; href: string; ctaId: string };
  };
}>;

export function AboutHero({ data }: { data: HeroData }) {
  const reduceMotion = useReducedMotion();

  return (
    <Section variant="dark" id="about-hero" className="relative overflow-hidden bg-[color:var(--color-surface-0)]">
      {/* Layered depth background — cinematic, not decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Barely-there grid — 5% opacity, institutional not templated */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:120px_120px]" />
        {/* Edge vignette — very soft so it doesn’t create a card frame around the image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(0,0,0,0.2)_100%)]" />
        {/* Top darkening — anchors the header */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.5)] to-transparent" />
        {/* Bottom fade — section bleeds cleanly into next */}
        <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, #070a12, transparent)" }} />
        {/* Radial brand glow behind truck position */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_600px_at_78%_60%,rgba(220,38,38,0.18),transparent_62%)]" />
      </div>

      <Container className="site-page-container relative">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[0.93fr_1.07fr] lg:gap-8">
          {/* Left — text content */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="py-10 sm:py-14 lg:py-16"
          >
            {/* Kicker */}
            <div className="mb-3 h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-12" />
            <p aria-hidden="true" className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-muted)]">
              About Us
            </p>

            {/* Headline — editorial weight contrast between lines */}
            <h1 className="mt-3 max-w-[20ch] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-text-strong)]
                           text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem]">
              <span className="block font-bold">{data.title.split(".")[0]}.</span>
              {data.title.split(".").slice(1).join(".").trim() && (
                <span className="block font-[500] text-[color:var(--color-muted-strong)]">
                  {data.title.split(".").slice(1).join(".").trim()}
                </span>
              )}
            </h1>

            <p className="mt-4 max-w-[58ch] text-[13.5px] leading-[1.75] text-[color:var(--color-muted)] sm:mt-5 sm:text-[15px] lg:text-[15.5px]">
              {data.description}
            </p>

            <nav className="mt-7 flex flex-wrap gap-3 sm:mt-8" aria-label="About page primary actions">
              {/* Primary — controlled glow, subtle lift on hover */}
              <Link
                href={data.ctas.primary.href}
                onClick={() =>
                  trackCtaClick({
                    ctaId: data.ctas.primary.ctaId,
                    location: "about_hero",
                    destination: data.ctas.primary.href,
                    label: data.ctas.primary.label,
                  })
                }
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] px-5 text-sm font-semibold text-white transition-all duration-200",
                  "shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(220,38,38,0.32)]",
                  "sm:px-6",
                  "focus-ring-surface",
                )}
              >
                {data.ctas.primary.label}
              </Link>

              {/* Secondary — ghost, restrained */}
              <Link
                href={data.ctas.secondary.href}
                onClick={() =>
                  trackCtaClick({
                    ctaId: data.ctas.secondary.ctaId,
                    location: "about_hero",
                    destination: data.ctas.secondary.href.startsWith("#")
                      ? "/about-us" + data.ctas.secondary.href
                      : data.ctas.secondary.href,
                    label: data.ctas.secondary.label,
                  })
                }
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md border border-[rgba(255,255,255,0.22)] bg-transparent px-5 text-sm font-semibold text-[color:var(--color-muted-strong)] transition-all duration-200",
                  "hover:-translate-y-[2px] hover:border-[rgba(255,255,255,0.38)] hover:text-white",
                  "sm:px-6",
                  "focus-ring-surface",
                )}
              >
                {data.ctas.secondary.label}
              </Link>
            </nav>
          </motion.div>

          {/* Right — truck image integrated into hero (same grid + soft fades so it feels one canvas) */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 12, scale: 0.98 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="relative mx-auto aspect-[4/3] w-full max-w-[480px]
                            sm:aspect-[16/10] sm:max-w-[680px]
                            lg:mx-0 lg:ml-auto lg:aspect-[16/10] lg:max-w-[1100px] lg:translate-x-10"
            >
              <HeroImage
                src="/_optimized/company/about-hero.webp"
                alt="NPT branded truck representing disciplined freight execution"
                fill
                sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 72vw, (min-width: 640px) 680px, 100vw"
                className={cn(
                  "object-contain",
                  !reduceMotion && "animate-hero-float [animation-duration:7s] [animation-timing-function:ease-in-out] [animation-iteration-count:infinite]",
                )}
                priority
              />
            </div>
          </motion.div>
        </div>
      </Container>

    </Section>
  );
}
