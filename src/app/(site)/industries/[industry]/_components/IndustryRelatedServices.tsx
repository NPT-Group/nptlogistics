"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { trackCtaClick } from "@/lib/analytics/cta";
import type { IndustryPageModel } from "@/config/industryPages";
import { cn } from "@/lib/cn";
import { THEME_ACCENT, THEME_LIGHT_BG } from "./industryTheme";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0-light)]";

export function IndustryRelatedServices({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const { relatedServices, hero } = model;
  const theme = hero.theme;
  const sectionBg = THEME_LIGHT_BG[theme];
  const accentColor = THEME_ACCENT[theme];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const stagger: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } } };

  return (
    <Section
      variant="light"
      id="related-services"
      className="relative scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      style={{ backgroundColor: sectionBg }}
    >
      <Container className="relative max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.header variants={fadeUp} className="max-w-2xl">
            <div className="mb-3 h-[2px] w-10 sm:w-14" style={{ backgroundColor: accentColor }} />
            <h2 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)] sm:text-[1.8rem]">
              {relatedServices.sectionTitle}
            </h2>
            {relatedServices.intro ? (
              <p className="mt-2 text-sm leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[15px]">
                {relatedServices.intro}
              </p>
            ) : null}
          </motion.header>
          <motion.nav
            variants={stagger}
            className="mt-6 flex flex-wrap gap-3 sm:mt-8"
            aria-label="Related freight services"
          >
            {relatedServices.links.map((link, i) => (
              <motion.span key={i} variants={fadeUp}>
                <Link
                  href={link.href}
                  onClick={() =>
                    trackCtaClick({
                      ctaId: `industry_related_${model.key}_${link.label.replace(/\s+/g, "_").toLowerCase()}`,
                      location: "industry_related_services",
                      destination: link.href,
                      label: link.label,
                    })
                  }
                  className={cn(
                    "inline-flex items-center rounded-full border border-[color:var(--color-border-light)]/80 bg-white/90 px-4 py-2 text-[13px] font-semibold text-[color:var(--color-text-light)] shadow-sm transition-all duration-200 hover:border-[color:var(--color-brand-500)]/40 hover:bg-[color:var(--color-brand-50)]/60 hover:shadow-md",
                    focusRing,
                  )}
                >
                  {link.label}
                </Link>
              </motion.span>
            ))}
          </motion.nav>
        </motion.div>
      </Container>
    </Section>
  );
}
