"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";

const TRUST_SIGNALS = [
  "Fast, structured quote responses",
  "Dedicated operations ownership",
  "Clear timelines and accountability",
] as const;

const CONVERSION_PROOF = [
  { id: "response", value: "≤ 15 min", label: "Initial response target" },
  { id: "coverage", value: "24/7", label: "Operations coverage" },
  { id: "scope", value: "CA-US-MX", label: "Lane execution scope" },
] as const;

export function FinalCtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(220,38,38,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(860px_520px_at_10%_100%,rgba(37,99,235,0.06),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,244,239,1))]" />
      </div>

      <Container className={cn("relative py-16 sm:py-20", "site-home-container")}>
        <motion.div
          // Production reliability: do not hide CTA content behind whileInView.
          // Visible-first motion: keep opacity readable, animate small lift + scale.
          initial={reduceMotion ? false : { opacity: 1, y: 12, scale: 0.985 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
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
                Let&apos;s Execute
              </div>
              <h2 className="mt-2 text-[30px] leading-tight font-semibold text-[color:var(--color-text-light)] sm:text-4xl">
                Ready to Move Freight With More Control?
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
                Get a fast, structured response from our operations team with lane-level clarity on
                pricing, timing, and execution.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {TRUST_SIGNALS.map((signal) => (
                  <span
                    key={signal}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-light)] bg-white/84 px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-text-light)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]" />
                    {signal}
                  </span>
                ))}
              </div>
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
                  {CONVERSION_PROOF.map((item) => (
                    <div
                      key={item.id}
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
                  <Link
                    href="/quote"
                    onClick={() =>
                      trackCtaClick({
                        ctaId: "final_cta_primary_request_quote",
                        location: "final_cta",
                        destination: "/quote",
                        label: "Request a Quote",
                      })
                    }
                    className={cn(
                      "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold",
                      "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                      "shadow-[0_8px_22px_rgba(220,38,38,0.25)]",
                      "focus-ring-light",
                    )}
                  >
                    Request a Quote
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      trackCtaClick({
                        ctaId: "final_cta_secondary_speak_live_agent",
                        location: "final_cta",
                        destination: "#live-chat",
                        label: "Speak with a live agent",
                      });
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("npt:open-live-chat"));
                      }
                    }}
                    className={cn(
                      "inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-5 text-sm font-semibold",
                      "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                      "focus-ring-light",
                    )}
                  >
                    Speak with a live agent
                  </button>
                </div>

                <div className="mt-3 text-center text-[11px] text-[color:var(--color-muted-light)]">
                  Prefer a quick call? We&apos;ll align on lanes, service levels, and launch timing
                  in minutes.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
