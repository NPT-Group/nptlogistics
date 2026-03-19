"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { SectionImage } from "@/components/media/SectionImage";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";

type Data = Readonly<{
  title: string;
  subtitle: string;
  body: readonly string[];
  stats: readonly { value: string; label: string }[];
  cta: { label: string; href: string; ctaId: string };
}>;

// Hoisted: no deps on props/state, safe to define once at module level
function formatStatLabel(label: string): string {
  const parts = label.trim().split(/\s+/);
  if (parts.length <= 1) return label;
  return `${parts[0]}\n${parts.slice(1).join(" ")}`;
}

export function WhoWeAre({ data }: { data: Data }) {
  const [primaryStat, ...secondaryStats] = data.stats;
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        // Visible-first motion: animate small lift + scale, but keep opacity readable.
        hidden: { opacity: 1, y: 12, scale: 0.985 },
        show: { opacity: 1, y: 0, scale: 1 },
      };

  const fadeLeft: Variants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : {
        // Visible-first motion: animate subtle horizontal drift + scale, but keep opacity readable.
        hidden: { opacity: 1, x: -12, scale: 0.985 },
        show: { opacity: 1, x: 0, scale: 1 },
      };

  return (
    <Section
      variant="light"
      id="who-we-are"
      className="scroll-mt-24 !pt-10 !pb-0 sm:scroll-mt-28 sm:!pt-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_320px_at_20%_-8%,var(--color-section-glow-brand),transparent_55%)]"
      />
      <Container className="site-page-container relative">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          variants={fadeUp}
          className="mb-2 max-w-3xl sm:mb-3"
        >
          <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
          <h2 className="mt-2 text-[1.6rem] leading-tight font-semibold tracking-tight text-[color:var(--color-text-light)] sm:mt-3 sm:text-[1.95rem] lg:text-[2.2rem]">
            {data.title}
          </h2>
          <p className="mt-1 text-sm leading-snug font-normal tracking-[-0.01em] text-[color:var(--color-text-light)] sm:text-[15.5px] lg:text-[16px]">
            {data.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          {/* Left — image column */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            variants={fadeLeft}
            className="relative"
          >
            {/*
              Mobile (<640px):  portrait-ish aspect so circle bottom is clipped, image shows well
              Tablet (640-1023px): wider but still aspect-ratio constrained, centred, taller
              Desktop (lg+): free height, fills the grid row
            */}
            <div className="relative mx-auto w-full overflow-hidden
                            aspect-[4/3] max-w-[420px]
                            sm:aspect-[16/10] sm:max-w-[600px]
                            lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-[600px] lg:min-h-[460px]">
              {/* Decorative circle — warm stone to match pills + next section, no pink */}
              <div
                aria-hidden="true"
                className="absolute top-[6%] left-1/2 z-[2] aspect-[1/1] w-[90%] -translate-x-1/2 rounded-full lg:w-[95%]"
                style={{ backgroundColor: "#e8e4df" }}
              />
              {/* Left pill — lg+ only */}
              <div
                aria-hidden="true"
                className="absolute top-[18%] left-[3%] z-[1] hidden h-7 w-32 rounded-full border border-[rgba(180,170,158,0.45)] bg-[color:var(--color-about-safety-bg)] shadow-[0_4px_14px_rgba(15,23,42,0.07)] lg:block"
              />
              {/* Right pill — lg+ only */}
              <div
                aria-hidden="true"
                className="absolute right-[2%] bottom-[5%] z-[1] hidden h-7 w-20 rounded-full border border-[rgba(180,170,158,0.45)] bg-[color:var(--color-about-safety-bg)] shadow-[0_4px_14px_rgba(15,23,42,0.07)] lg:block"
              />
              <SectionImage
                src="/_optimized/company/groupPhoto.webp"
                alt="NPT Logistics team members"
                fill
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, (min-width: 640px) 600px, 100vw"
                className="relative z-10 object-contain object-bottom"
              />
            </div>
          </motion.div>

          {/* Right — content column */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            variants={fadeUp}
            className="relative flex flex-col justify-start
                       border-t border-[color:var(--color-border-light-soft)] pt-7 pb-10
                       sm:pt-8 sm:pb-12
                       lg:border-t-0 lg:max-w-[480px] lg:pt-12 lg:pb-12"
          >
            {/* Circular arrow ornament — lg+ only */}
            <div
              aria-hidden="true"
              className="group absolute top-10 right-0 hidden lg:inline-flex h-[60px] w-[60px] cursor-default items-center justify-center rounded-full border-2 border-[color:var(--color-surface-0)] bg-transparent text-[1.1rem] text-[color:var(--color-surface-0)] transition-all duration-500 hover:scale-110 hover:border-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-600)] hover:text-white hover:shadow-[var(--shadow-action-primary)]"
            >
              <span className="inline-block -rotate-[35deg] transition-transform duration-500 group-hover:rotate-[325deg]">
                ←
              </span>
            </div>

            {/* Stats block */}
            <div className="pb-5 sm:pb-7">
              {primaryStat ? (
                <div className="flex items-start gap-2.5 border-l-2 border-[color:var(--color-brand-500)] pl-3 sm:gap-3 sm:pl-3.5">
                  <p className="text-[2rem] leading-none font-semibold tracking-tight text-[color:var(--color-text-light)] md:text-[2.4rem] lg:text-[2.6rem]">
                    {primaryStat.value}
                  </p>
                  <p className="pt-1.5 text-[10px] leading-tight font-normal tracking-wide whitespace-pre-line uppercase text-[color:var(--color-subtle-light)] md:pt-2 md:text-[11px]">
                    {formatStatLabel(primaryStat.label)}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 grid max-w-[300px] grid-cols-2 gap-x-5 gap-y-0 sm:mt-6 sm:max-w-[320px] sm:gap-x-6">
                {secondaryStats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="flex items-start gap-2">
                    <p className="text-[2rem] leading-none font-semibold tracking-tight text-[color:var(--color-text-light)] md:text-[2.4rem] lg:text-[2.6rem]">
                      {stat.value}
                    </p>
                    <p className="pt-1.5 text-[10px] leading-tight font-normal tracking-wide whitespace-pre-line uppercase text-[color:var(--color-subtle-light)] md:pt-2 md:text-[11px]">
                      {formatStatLabel(stat.label)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px w-12 bg-[color:var(--color-brand-500)] opacity-40 sm:mb-6 sm:w-16" />

            {/* Body */}
            <p className="max-w-[48ch] text-sm leading-[1.75] font-normal tracking-[-0.005em] text-[color:var(--color-muted-light)] sm:text-[15px] sm:leading-[1.8]">
              {data.body.join(" ")}
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-2.5">
              <p className="text-[11px] font-semibold tracking-[0.1em] text-[color:var(--color-subtle-light)] uppercase sm:text-[11.5px]">
                Interested in joining us?
              </p>
              <Link
                href={data.cta.href}
                aria-label={`${data.cta.label} — join the NPT Logistics team`}
                onClick={() =>
                  trackCtaClick({
                    ctaId: data.cta.ctaId,
                    location: "about_who_we_are",
                    destination: data.cta.href,
                    label: data.cta.label,
                  })
                }
                className={cn(
                  "inline-flex h-10 items-center justify-center self-start rounded-md border border-[color:var(--color-brand-500)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] px-5 text-sm font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(220,38,38,0.32)] sm:h-11 sm:px-7",
                  "focus-ring-light",
                )}
              >
                {data.cta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
