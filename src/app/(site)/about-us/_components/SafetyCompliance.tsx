"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { Section } from "@/app/(site)/components/layout/Section";
import { TRUST_PARTNER_LOGOS } from "@/config/testimonials";
import { cn } from "@/lib/cn";

type PolicyCard = Readonly<{ title: string; body: string }>;
type Data = Readonly<{
  sectionLabel: string;
  title: string;
  subtitle: string;
  body: string;
  heroImage: string;
  snapshot: { value: string; label: string; supportingText: string };
  policyCards: readonly PolicyCard[];
  howWeStayAboveStandardHeading: string;
  howWeStayAboveStandard: readonly string[];
  certificationsHeading: string;
  certificationsSubline: string;
  certificationsTagline?: string;
}>;

export function SafetyCompliance({ data }: { data: Data }) {
  const reduceMotion = useReducedMotion();
  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };
  const fadeLeft: Variants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : { hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } } };

  return (
    <Section
      variant="light"
      id="safety-compliance"
      className="relative scroll-mt-16 overflow-hidden pt-10 pb-12 sm:pt-12 sm:pb-14"
      style={{ backgroundColor: "var(--color-about-safety-bg)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Container className="relative max-w-[1440px] px-4 sm:px-6 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12"
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="min-w-0 space-y-6 sm:space-y-7"
          >
            {/* Section header block — aligned with Who We Are / Mission & Vision */}
            <div>
              <div className="mb-2 flex items-center gap-2.5">
                <div className="h-[2px] w-10 bg-[color:var(--color-brand-500)] sm:w-14" />
                <span className="text-[10.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--color-brand-500)]">
                  {data.sectionLabel}
                </span>
              </div>
              <h2 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)] sm:text-[1.95rem] lg:text-[2.2rem]">
                {data.title}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-[color:var(--color-brand-500)]">
                {data.subtitle}
              </p>
              <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[color:var(--color-muted-light)]">
                {data.body}
              </p>
            </div>

            {/* Snapshot stat */}
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[color:var(--color-brand-500)] sm:text-3xl">
                  {data.snapshot.value}
                </span>
                <span className="text-sm font-semibold text-[color:var(--color-text-light)]">
                  {data.snapshot.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">
                {data.snapshot.supportingText}
              </p>
            </div>

            {/* Policy bullets */}
            <ul className="space-y-2.5">
              {data.policyCards.map((card) => (
                <li key={card.title} className="flex gap-2.5 text-sm">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--color-brand-500)]"
                  />
                  <div>
                    <span className="font-semibold text-[color:var(--color-text-light)]">{card.title}</span>
                    <span className="text-[color:var(--color-muted-light)]"> — {card.body}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* How we stay above standard */}
            <div className="border-t border-[color:var(--color-border-light)]/50 pt-5 sm:pt-6">
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[color:var(--color-subtle-light)]">
                {data.howWeStayAboveStandardHeading}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
                {data.howWeStayAboveStandard.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[color:var(--color-border-light)]/50 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-[color:var(--color-text-light)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column: image — bottom-aligned so man’s cut line meets navy strip */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[6/5] lg:aspect-[8/5] lg:min-h-[340px]">
              <Image
                src={data.heroImage}
                alt="Safety and compliance at NPT Logistics: disciplined standards, documented accountability, and verified execution."
                fill
                className="object-contain object-center"
                sizes="(max-width: 1023px) 100vw, 55vw"
                priority={false}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Certifications strip — clear framing so it’s not “just logos” */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          className="mt-10 sm:mt-12 lg:mt-14"
        >
          <div className="mb-4 sm:mb-5">
            <h3 className="text-sm font-semibold tracking-tight text-[color:var(--color-text-light)]">
              {data.certificationsHeading}
            </h3>
            {data.certificationsTagline ? (
              <p className="mt-1.5 text-sm font-medium text-[color:var(--color-muted-light)]">
                {data.certificationsTagline}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-[color:var(--color-muted-light)] sm:text-sm">
                {data.certificationsSubline}
              </p>
            )}
          </div>
          <CertificationsMarquee />
        </motion.div>
      </Container>
    </Section>
  );
}

function CertificationsMarquee() {
  const items = [...TRUST_PARTNER_LOGOS, ...TRUST_PARTNER_LOGOS];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        "border border-[color:var(--color-border-light)]/60 bg-white/90",
        "shadow-[0_4px_20px_rgba(2,6,23,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
      )}
    >
      <div className="relative">
        <div className="certifications-marquee-track flex items-center gap-6 px-4 py-4 sm:gap-8 sm:py-4">
          {items.map((logo, idx) => (
            <div
              key={`${logo.src}-${idx}`}
              className="flex h-8 w-[100px] flex-shrink-0 items-center justify-center opacity-90 transition-opacity hover:opacity-100 sm:h-9 sm:w-[120px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={56}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>

      <style jsx>{`
        .certifications-marquee-track {
          width: max-content;
          animation: certifications-marquee 28s linear infinite;
        }
        @keyframes certifications-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .certifications-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
