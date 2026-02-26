"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { SHIPPING_GUIDES, type ShippingGuide } from "@/config/faqs";
import { cn } from "@/lib/cn";

function GuideCard({
  guide,
  index,
  variants,
  reduceMotion,
}: {
  guide: ShippingGuide;
  index: number;
  variants: Variants;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.article
      variants={variants}
      className={cn(
        "group relative rounded-2xl border border-[color:var(--color-border-light)]/80",
        "bg-white/98 shadow-[0_2px_12px_rgba(2,6,23,0.04),0_4px_24px_rgba(2,6,23,0.05)]",
        "p-6 transition-all duration-300 sm:p-7 lg:p-8",
        "hover:border-[color:var(--color-border-light)] hover:shadow-[0_8px_32px_rgba(2,6,23,0.08),0_2px_0_0_0_rgba(220,38,38,0.15)]",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
            "bg-[color:var(--color-brand-500)]/10 text-[color:var(--color-brand-600)]",
            "ring-1 ring-[color:var(--color-brand-500)]/20",
            "transition-colors duration-300 group-hover:bg-[color:var(--color-brand-500)]/15 group-hover:ring-[color:var(--color-brand-500)]/30",
          )}
          aria-hidden
        >
          {index + 1}
        </span>
        <h3 className="text-[1.125rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.25rem]">
          {guide.title}
        </h3>
      </div>
      <p className="mb-4 text-[13.5px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[14px]">
        {guide.description}
      </p>
      <div className="border-t border-[color:var(--color-border-light)]/50 pt-4">
        <p className="mb-3 text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[color:var(--color-muted-light)]">
          Key points
        </p>
        <ul className="space-y-2.5" role="list">
          {guide.points.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 text-[13px] leading-[1.68] text-[color:var(--color-text-light)] sm:text-[13.5px]"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-500)]"
                aria-hidden
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function ShippingGuidesSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };

  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

  return (
    <Section
      variant="dark"
      id="shipping-guides"
      className="relative scroll-mt-[184px] overflow-hidden"
      style={{ backgroundColor: "var(--color-about-operating-bg)" }}
    >
      {/* Background depth — gradient orbs (consistent with OperatingModel, LocationsNetwork) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.08),transparent_60%)]" />
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(185,28,28,0.05),transparent_65%)]" />
      </div>
      {/* Subtle grid on navy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Container className="relative max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="w-full"
        >
          <motion.header variants={fadeUp} className="mb-8 sm:mb-10">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
              <span className="text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-500)]">
                Resources
              </span>
            </div>
            <h2 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
              Shipping Guides
            </h2>
            <p className="mt-2.5 max-w-2xl text-[13.5px] leading-[1.7] text-[color:var(--color-muted)] sm:text-[15px]">
              Enterprise-level practices for mode selection, quote readiness, visibility, cross-border, compliance, and lane planning—aligned to how disciplined shippers run their networks.
            </p>
            {/* Topic pills (consistent with OperatingModel pill style) */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Mode selection", "Quote readiness", "Visibility", "Cross-border", "Compliance", "Lane & capacity"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.14)] px-2.5 py-[3px] text-[11px] font-semibold tracking-wide text-[rgba(255,255,255,0.9)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.header>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {SHIPPING_GUIDES.map((guide, index) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                index={index}
                variants={fadeUp}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
