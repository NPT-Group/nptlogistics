// src/app/quote/page.tsx
import type { Metadata } from "next";
import { ShieldCheck, Clock3, Globe2 } from "lucide-react";

import { Container } from "../components/layout/Container";
import { Section } from "../components/layout/Section";
import LogisticsQuoteForm from "../components/forms/LogisticsQuoteForm";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Request a logistics quote from NPT Logistics.",
  alternates: {
    canonical: "/quote",
  },
};

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

export function QuoteAssurance() {
  return (
    <section className="relative overflow-hidden bg-[#070b14] py-14 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.035]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_320px_at_18%_18%,rgba(220,38,38,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(820px_360px_at_82%_100%,rgba(59,130,246,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>

      <Container className="site-page-container relative">
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
                  "group relative overflow-hidden rounded-[24px] p-[1px]",
                  "bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))]",
                  "shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-300",
                  "hover:-translate-y-[2px] hover:shadow-[0_22px_60px_rgba(0,0,0,0.34)]",
                )}
              >
                <div className="relative h-full rounded-[23px] border border-white/6 bg-[linear-gradient(180deg,rgba(10,14,24,0.88),rgba(7,11,20,0.96))] p-5 sm:p-6">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.12),transparent_55%)]"
                  />

                  <div className="relative">
                    <div
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                        "border border-white/10 bg-white/[0.045] backdrop-blur-sm",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                      )}
                    >
                      <Icon className="h-5 w-5 text-[color:var(--color-brand-500)]" />
                    </div>

                    <h3 className="mt-5 text-[1.02rem] font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-[30ch] text-sm leading-6 text-white/64">
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

export default function QuotePage() {
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

        <Container className={cn("site-page-container relative")}>
          <div className="mx-auto max-w-5xl">
            <LogisticsQuoteForm />
          </div>
        </Container>
      </section>

      <QuoteAssurance />
    </main>
  );
}
