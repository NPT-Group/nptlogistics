// src/app/(site)/quote/QuoteClient.tsx
"use client";

import { ShieldCheck, Clock3, Globe2, PhoneCall } from "lucide-react";

import { Container } from "../components/layout/Container";
import { Section } from "../components/layout/Section";
import LogisticsQuoteForm from "../components/forms/LogisticsQuoteForm";
import { cn } from "@/lib/cn";
import { NEXT_PUBLIC_NPT_PHONE } from "@/config/env";
import { NAV_OFFSET } from "@/constants/ui";

function QuoteHero() {
  return (
    <Section
      variant="dark"
      id="quote-hero"
      className="relative scroll-mt-16 overflow-hidden bg-[color:var(--color-surface-0)] py-8 sm:py-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_400px_at_70%_30%,rgba(220,38,38,0.12),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.6)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
      </div>

      <Container className="site-page-container relative">
        <div className="py-6 text-center sm:py-8 lg:py-10">
          <div className="mx-auto mb-2.5 h-[2px] w-12 bg-[color:var(--color-brand-500)] sm:w-14" />
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[color:var(--color-brand-500)] uppercase">
            Quotes &amp; Planning
          </p>
          <h1 className="mx-auto mt-2.5 max-w-3xl text-[1.9rem] leading-tight font-semibold tracking-tight text-white sm:text-[2.2rem] lg:text-[2.45rem]">
            Share your shipment. We’ll handle the precision.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-[1.65] text-[color:var(--color-muted)] sm:text-[14px]">
            Tell us where your freight is moving, what needs to move, and the service window. Our
            team reviews every request, aligns the right capacity, and comes back with a tailored
            quote—not a generic rate sheet.
          </p>
        </div>
      </Container>
    </Section>
  );
}

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function scrollToQuoteForm() {
  const el = document.getElementById("quote-form-card");
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - 20;
  window.scrollTo({ top, behavior: "smooth" });
}

function QuoteCallout() {
  return (
    <div className="mx-auto mb-4 max-w-5xl sm:mb-5">
      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] border px-4 py-2.5 sm:px-4.5 sm:py-3",
          "border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)]",
          "shadow-[0_10px_24px_rgba(2,6,23,0.12)]",
        )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_360px_140px_at_12%_0%,rgba(220,38,38,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_260px_120px_at_88%_100%,rgba(180,83,9,0.1),transparent_60%)]" />
        </div>

        <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-[12.5px] leading-5 text-[rgba(255,255,255,0.78)] sm:text-[13px]">
            <span className="mr-2 inline-block text-[10px] font-semibold tracking-[0.14em] text-[color:var(--color-brand-500)] uppercase">
              Prefer to call?
            </span>
            Reach us at{" "}
            <a
              href={toTelHref(NEXT_PUBLIC_NPT_PHONE)}
              className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
            >
              {NEXT_PUBLIC_NPT_PHONE}
            </a>
            .
          </p>

          <div className="flex shrink-0 gap-2">
            <a
              href={toTelHref(NEXT_PUBLIC_NPT_PHONE)}
              className={cn(
                "inline-flex h-8.5 items-center justify-center gap-2 rounded-md px-3.5 text-[12px] font-semibold sm:text-[13px]",
                "border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] text-white",
                "shadow-[0_6px_16px_rgba(220,38,38,0.18)] transition hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(220,38,38,0.24)]",
                "focus-ring-surface",
              )}
              aria-label={`Call NPT Logistics at ${NEXT_PUBLIC_NPT_PHONE}`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Call
            </a>

            <button
              type="button"
              onClick={scrollToQuoteForm}
              className={cn(
                "inline-flex h-8.5 items-center justify-center rounded-md px-3.5 text-[12px] font-semibold sm:text-[13px]",
                "border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.8)] backdrop-blur",
                "transition hover:-translate-y-[1px] hover:cursor-pointer hover:border-[rgba(255,255,255,0.28)] hover:text-white",
                "focus-ring-surface",
              )}
            >
              Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const assuranceItems = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description: "Your shipment details are submitted securely and handled with care.",
  },
  {
    icon: Clock3,
    title: "Fast, human response",
    description: "Experienced logistics professionals review every request.",
  },
  {
    icon: Globe2,
    title: "North America expertise",
    description: "Built for domestic, cross-border, and specialized freight.",
  },
];

function QuoteAssurance() {
  return (
    <section className="py-8 sm:py-10">
      <Container className="site-page-container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-3 h-[2px] w-12 bg-[color:var(--color-brand-500)]" />
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[color:var(--color-brand-500)] uppercase">
            Why shippers trust NPT
          </p>
          <h2 className="mt-3 text-[1.55rem] font-semibold tracking-tight text-white sm:text-[1.9rem]">
            Built for confidence at every step
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3">
          {assuranceItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={cn(
                  "group relative overflow-hidden rounded-[24px] border p-5 sm:p-6",
                  "border-[color:var(--color-border-light)] bg-white/88 backdrop-blur-sm",
                  "shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300",
                  "hover:-translate-y-[1px] hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]",
                )}
              >
                <div
                  aria-hidden
                  className="absolute top-0 left-0 h-16 w-16 rounded-br-[22px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(220,38,38,0.10) 0%, rgba(220,38,38,0.04) 55%, transparent 100%)",
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      "border border-[color:var(--color-brand-100)] bg-white",
                      "shadow-[0_4px_12px_rgba(15,23,42,0.05)]",
                    )}
                  >
                    <Icon className="h-5.5 w-5.5 text-[color:var(--color-brand-600)]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[1.05rem] font-semibold tracking-tight text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-[24ch] text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default function QuoteClient() {
  return (
    <main className="bg-[color:var(--color-surface-0)]">
      <QuoteHero />

      <section id="quote-form" className="relative py-10 sm:py-12 lg:py-14">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(920px 500px at 16% -4%, rgba(220,38,38,0.08), transparent 62%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1000px 580px at 84% 112%, rgba(180,83,9,0.08), transparent 66%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_45%,#e2e8f0_100%)]" />
        </div>

        <Container className="site-page-container relative">
          <QuoteCallout />

          <div id="quote-form-card" className="mx-auto max-w-5xl">
            <LogisticsQuoteForm />
          </div>
        </Container>
      </section>

      <QuoteAssurance />
    </main>
  );
}
