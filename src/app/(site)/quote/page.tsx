// src/app/quote/page.tsx
import type { Metadata } from "next";
import { ShieldCheck, Clock3, Globe2 } from "lucide-react";

import { Container } from "../components/layout/Container";
import LogisticsQuoteForm from "../components/LogisticsQuoteForm";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Quote",
  description: "Request a logistics quote from NPT Logistics.",
};

function QuoteHero() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-0)]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(700px 260px at 15% 0%, rgba(220,38,38,0.10) 0%, transparent 55%),
            radial-gradient(700px 260px at 85% 0%, rgba(59,130,246,0.08) 0%, transparent 55%),
            linear-gradient(180deg, #050816 0%, #070b18 100%)
          `,
        }}
      />

      <Container className="relative max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-600)]" />
              Request a Quote
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.1rem]">
              Request your custom quote
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-[15px]">
              Share your shipment details and service needs. Our team will review your request and
              follow up with the right next step.
            </p>
          </div>
        </div>
      </Container>
    </section>
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
    <section className="py-8 sm:py-10">
      <Container className="max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                {/* integrated accent instead of disconnected top border */}
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
                    <h3 className="text-[1.05rem] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-[24ch] text-sm leading-6 text-[color:var(--color-muted-light)]">
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
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_42%,#e2e8f0_100%)]">
      <QuoteHero />

      <section
        id="quote-form"
        className={cn(
          "py-8 sm:py-10",
          "bg-[radial-gradient(900px_520px_at_50%_-10%,rgba(255,255,255,0.10),transparent_65%),linear-gradient(180deg,#f1f5f9_0%,#e2e8f0_45%,#cbd5e1_100%)]",
        )}
      >
        <Container className="max-w-5xl px-4 sm:px-6 lg:px-8">
          <LogisticsQuoteForm />
        </Container>
      </section>

      <QuoteAssurance />
    </main>
  );
}
