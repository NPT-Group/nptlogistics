// src/app/(site)/contact/ContactClient.tsx

"use client";

import { MessagesSquare, Headset, ShieldCheck, PhoneCall } from "lucide-react";

import { Container } from "../components/layout/Container";
import { Section } from "../components/layout/Section";
import ContactForm from "../components/forms/ContactForm";
import { cn } from "@/lib/cn";
import { NEXT_PUBLIC_NPT_PHONE } from "@/config/env";
import { NAV_OFFSET } from "@/constants/ui";

const contactSupportItems = [
  {
    icon: MessagesSquare,
    title: "Clear routing",
    description: "Your inquiry is directed to the appropriate department from the start.",
  },
  {
    icon: Headset,
    title: "Human support",
    description: "Real people review submissions and follow up with practical next steps.",
  },
  {
    icon: ShieldCheck,
    title: "Secure submission",
    description: "Information is transmitted securely and handled with care.",
  },
];

function ContactHero() {
  return (
    <Section
      variant="dark"
      id="contact-hero"
      className="relative scroll-mt-16 overflow-hidden bg-[color:var(--color-surface-0)] py-6 sm:py-8 lg:py-9"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:80px_80px] opacity-[0.035]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_760px_360px_at_68%_26%,rgba(220,38,38,0.11),transparent_56%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.55)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#070a12] to-transparent" />
      </div>

      <Container className="site-page-container relative">
        <div className="py-5 text-center sm:py-6 lg:py-7">
          <div className="mx-auto mb-2 h-[2px] w-12 bg-[color:var(--color-brand-500)] sm:w-14" />
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[color:var(--color-brand-500)] uppercase">
            Contact &amp; Support
          </p>

          <h1 className="mx-auto mt-2.5 max-w-3xl text-[1.8rem] leading-tight font-semibold tracking-tight text-white sm:text-[2.05rem] lg:text-[2.2rem]">
            Contact the right team, faster
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-[1.65] text-[color:var(--color-muted)] sm:text-[14px]">
            Choose a department and send your inquiry to the team best equipped to help with
            shipments, support, compliance, technical issues, or general business questions.
          </p>
        </div>
      </Container>
    </Section>
  );
}

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function scrollToContactForm() {
  const el = document.getElementById("contact-form-card");
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - 20;
  window.scrollTo({ top, behavior: "smooth" });
}

function ContactCallout() {
  return (
    <div className="mx-auto mb-3 max-w-5xl sm:mb-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-[16px] border px-4 py-2.5",
          "border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]",
          "shadow-[0_8px_18px_rgba(2,6,23,0.1)]",
        )}
      >
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-[12.5px] leading-5 text-[rgba(255,255,255,0.76)] sm:text-[13px]">
            Need help right away? Call{" "}
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
                "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] font-semibold",
                "border border-[color:var(--color-brand-600)] bg-[linear-gradient(180deg,var(--color-brand-600),var(--color-brand-700))] text-white",
                "shadow-[0_6px_16px_rgba(220,38,38,0.16)] transition hover:-translate-y-[1px] hover:shadow-[0_10px_20px_rgba(220,38,38,0.22)]",
                "focus-ring-surface",
              )}
              aria-label={`Call NPT Logistics at ${NEXT_PUBLIC_NPT_PHONE}`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Call
            </a>

            <button
              type="button"
              onClick={scrollToContactForm}
              className={cn(
                "inline-flex h-8 items-center justify-center rounded-md px-3 text-[12px] font-semibold",
                "border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.78)] backdrop-blur",
                "transition hover:-translate-y-[1px] hover:cursor-pointer hover:border-[rgba(255,255,255,0.24)] hover:text-white",
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

function ContactSupportSection() {
  return (
    <section className="py-8 sm:py-10">
      <Container className="site-page-container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-3 h-[2px] w-12 bg-[color:var(--color-brand-500)]" />
          <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[color:var(--color-brand-500)] uppercase">
            What to expect
          </p>
          <h2 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-white sm:text-[1.85rem]">
            Simple, direct, and responsive
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3">
          {contactSupportItems.map((item) => {
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

export default function ContactClient() {
  return (
    <div className="bg-[color:var(--color-surface-0)]">
      <ContactHero />

      <section id="contact-form" className="relative py-10 sm:py-12 lg:py-14">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(860px 460px at 16% -4%, rgba(220,38,38,0.07), transparent 62%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(980px 560px at 84% 112%, rgba(180,83,9,0.07), transparent 66%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_45%,#e2e8f0_100%)]" />
        </div>

        <Container className="site-page-container relative">
          <ContactCallout />

          <div id="contact-form-card" className="mx-auto max-w-5xl">
            <ContactForm />
          </div>
        </Container>
      </section>

      <ContactSupportSection />
    </div>
  );
}
