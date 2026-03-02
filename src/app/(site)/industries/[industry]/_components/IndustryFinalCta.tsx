"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";
import type { IndustryPageModel } from "@/config/industryPages";
import { THEME_ACCENT } from "./industryTheme";

const LIVE_CHAT_HREF = "#live-chat";
const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0-light)]";

function openLiveChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("npt:open-live-chat"));
  }
}

export function IndustryFinalCta({ model }: { model: IndustryPageModel }) {
  const reduceMotion = useReducedMotion();
  const data = model.finalCta;
  const kicker = data.kicker ?? "Ready to move your freight?";
  const trustSignals = data.trustSignals ?? [];
  const implementationSteps = data.implementationSteps ?? [];
  const accentColor = THEME_ACCENT[model.hero.theme];
  const accentSoft = `${accentColor}22`;
  const accentFaint = `${accentColor}12`;

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-0-light)]">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.42),transparent)]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(860px 500px at 12% 0%, ${accentFaint}, transparent 62%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(860px_520px_at_88%_100%,rgba(100,116,139,0.08),transparent_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.98))]" />
      </div>

      <Container className="relative max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={cn(
            "relative isolate mx-auto overflow-hidden rounded-[30px] border border-[color:var(--color-border-light)]/80 bg-white/90",
            "shadow-[0_16px_42px_rgba(2,6,23,0.11),inset_0_1px_0_rgba(255,255,255,0.92)]",
            "px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10",
          )}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{ background: `radial-gradient(420px 140px at 14% 0%, ${accentSoft}, transparent 70%)` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[40%] bg-[radial-gradient(460px_340px_at_100%_48%,rgba(148,163,184,0.10),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <div className="mb-3 h-[2px] w-14" style={{ backgroundColor: accentColor }} />
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-muted-light)]">
                {kicker}
              </div>
              <h2 className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[2.35rem]">
                {data.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[14px] leading-[1.75] text-[color:var(--color-muted-light)] sm:text-[15px]">
                {data.body}
              </p>
              {implementationSteps.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {implementationSteps.map((step) => (
                    <article
                      key={step.step}
                      className="rounded-xl border border-[color:var(--color-border-light)]/85 bg-white px-3.5 py-3.5 shadow-[0_4px_14px_rgba(2,6,23,0.05)]"
                    >
                      <p className="text-[10px] font-semibold tracking-[0.12em] text-[color:var(--color-muted-light)] uppercase">
                        Step {step.step}
                      </p>
                      <h3 className="mt-1 text-[13.5px] font-semibold leading-tight tracking-tight text-[color:var(--color-text-light)]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-[1.62] text-[color:var(--color-muted-light)]">
                        {step.body}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
              {trustSignals.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {trustSignals.map((signal) => (
                    <span
                      key={signal}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-light)] bg-white/84 px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-text-light)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      {signal}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5 lg:self-center">
              <div
                className={cn(
                  "rounded-2xl border border-[color:var(--color-border-light)]/85",
                  "bg-[linear-gradient(155deg,rgba(255,255,255,0.96),rgba(255,255,255,0.88))]",
                  "p-4 shadow-[0_10px_28px_rgba(2,6,23,0.08)] sm:p-5",
                )}
              >
                <p className="mb-3 text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-muted-light)]">
                  Program readiness
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {data.proof.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[color:var(--color-border-light)]/90 bg-white px-2 py-2 text-center"
                    >
                      <div className="text-[13px] font-semibold tracking-tight text-[color:var(--color-text-light)]">
                        {item.value}
                      </div>
                      <div className="mt-0.5 text-[10px] leading-snug text-[color:var(--color-muted-light)]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  <Link
                    href={data.ctas.primary.href}
                    onClick={() =>
                      trackCtaClick({
                        ctaId: data.ctas.primary.ctaId,
                        location: "industry_final_cta",
                        destination: data.ctas.primary.href,
                        label: data.ctas.primary.label,
                      })
                    }
                    className={cn(
                      "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold",
                      "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                      "shadow-[0_8px_20px_rgba(220,38,38,0.22)]",
                      focusRing,
                    )}
                  >
                    {data.ctas.primary.label}
                  </Link>
                  {data.ctas.secondary.href === LIVE_CHAT_HREF ? (
                    <button
                      type="button"
                      onClick={() => {
                        trackCtaClick({
                          ctaId: data.ctas.secondary.ctaId,
                          location: "industry_final_cta",
                          destination: LIVE_CHAT_HREF,
                          label: data.ctas.secondary.label,
                        });
                        openLiveChat();
                      }}
                      className={cn(
                        "inline-flex h-11 cursor-pointer items-center justify-center rounded-lg px-5 text-sm font-semibold",
                        "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                        focusRing,
                      )}
                    >
                      {data.ctas.secondary.label}
                    </button>
                  ) : (
                    <Link
                      href={data.ctas.secondary.href}
                      onClick={() =>
                        trackCtaClick({
                          ctaId: data.ctas.secondary.ctaId,
                          location: "industry_final_cta",
                          destination: data.ctas.secondary.href,
                          label: data.ctas.secondary.label,
                        })
                      }
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold",
                        "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                        focusRing,
                      )}
                    >
                      {data.ctas.secondary.label}
                    </Link>
                  )}
                </div>

                <p className="mt-3 text-center text-[11px] leading-relaxed text-[color:var(--color-muted-light)]">
                  Prefer a quick call? Our team can align on your lanes and timing.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
