"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";

type Data = Readonly<{
  kicker?: string;
  title: string;
  body: string;
  trustSignals?: readonly string[];
  proof: readonly { value: string; label: string }[];
  microCopy?: string;
  ctas: {
    primary: { label: string; href: string; ctaId: string };
    secondary: { label: string; href: string; ctaId: string };
  };
}>;

const LIVE_CHAT_HREF = "#live-chat";
const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0-light)]";

function openLiveChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("npt:open-live-chat"));
  }
}

export function AboutFinalCta({
  data,
  variant = "default",
}: {
  data: Data;
  variant?: "default" | "faq";
}) {
  const reduceMotion = useReducedMotion();
  const kicker = data.kicker ?? "Let's execute";
  const trustSignals = data.trustSignals ?? [];
  const microCopy = data.microCopy ?? "We'll align on lanes, service levels, and launch timing in minutes.";
  const sectionBg =
    variant === "faq"
      ? "bg-[color:var(--color-about-safety-bg)]"
      : "bg-[color:var(--color-surface-0-light)]";

  return (
    <section className={cn("relative overflow-hidden", sectionBg)}>
      {/* Ambient closure — light section after dark Locations; matches Home + Services Final CTA */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.48),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(220,38,38,0.08),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(860px_520px_at_12%_100%,rgba(37,99,235,0.055),transparent_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(241,245,249,0.96))]" />
      </div>

      <Container className="relative max-w-[1360px] px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={cn(
            "relative isolate mx-auto overflow-hidden rounded-[28px] border border-[color:var(--color-border-light)]/70",
            "bg-[linear-gradient(165deg,rgba(255,255,255,0.92),rgba(255,255,255,0.76))]",
            "shadow-[0_26px_58px_rgba(2,6,23,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]",
            "px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10",
          )}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(420px_140px_at_16%_0%,rgba(220,38,38,0.13),transparent_70%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(420px_320px_at_100%_52%,rgba(37,99,235,0.11),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <div className="mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
              <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                {kicker}
              </div>
              <h2 className="mt-2 text-[30px] leading-tight font-semibold text-[color:var(--color-text-light)] sm:text-4xl">
                {data.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
                {data.body}
              </p>

              {trustSignals.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {trustSignals.map((signal) => (
                    <span
                      key={signal}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-light)] bg-white/84 px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-text-light)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
                      {signal}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <div
                className={cn(
                  "rounded-2xl border border-[color:var(--color-border-light)]/85",
                  "bg-[linear-gradient(155deg,rgba(255,255,255,0.95),rgba(255,255,255,0.84))]",
                  "p-4 shadow-[0_14px_34px_rgba(2,6,23,0.08)] sm:p-5",
                )}
              >
                <div className="grid grid-cols-3 gap-2.5">
                  {data.proof.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[color:var(--color-border-light)] bg-white px-2 py-2 text-center"
                    >
                      <div className="text-[13px] font-semibold text-[color:var(--color-text-light)]">
                        {item.value}
                      </div>
                      <div className="mt-0.5 text-[10px] leading-snug text-[color:var(--color-muted-light)]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {data.ctas.primary.href === LIVE_CHAT_HREF ? (
                    <button
                      type="button"
                      onClick={() => {
                        trackCtaClick({
                          ctaId: data.ctas.primary.ctaId,
                          location: "about_final_cta",
                          destination: LIVE_CHAT_HREF,
                          label: data.ctas.primary.label,
                        });
                        openLiveChat();
                      }}
                      className={cn(
                        "inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-5 text-sm font-semibold",
                        "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                        "shadow-[0_8px_22px_rgba(220,38,38,0.25)]",
                        focusRing,
                      )}
                    >
                      {data.ctas.primary.label}
                    </button>
                  ) : (
                    <Link
                      href={data.ctas.primary.href}
                      onClick={() =>
                        trackCtaClick({
                          ctaId: data.ctas.primary.ctaId,
                          location: "about_final_cta",
                          destination: data.ctas.primary.href,
                          label: data.ctas.primary.label,
                        })
                      }
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
                        "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                        "shadow-[0_8px_22px_rgba(220,38,38,0.25)]",
                        focusRing,
                      )}
                    >
                      {data.ctas.primary.label}
                    </Link>
                  )}

                  {data.ctas.secondary.href === LIVE_CHAT_HREF ? (
                    <button
                      type="button"
                      onClick={() => {
                        trackCtaClick({
                          ctaId: data.ctas.secondary.ctaId,
                          location: "about_final_cta",
                          destination: LIVE_CHAT_HREF,
                          label: data.ctas.secondary.label,
                        });
                        openLiveChat();
                      }}
                      className={cn(
                        "inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-5 text-sm font-semibold",
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
                          location: "about_final_cta",
                          destination: data.ctas.secondary.href,
                          label: data.ctas.secondary.label,
                        })
                      }
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
                        "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                        focusRing,
                      )}
                    >
                      {data.ctas.secondary.label}
                    </Link>
                  )}
                </div>

                <div className="mt-3 text-center text-[11px] text-[color:var(--color-muted-light)]">
                  {microCopy}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
