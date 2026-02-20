"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-0)]";

const CULTURE_PILLARS = [
  {
    title: "Safety Before Speed",
    desc: "Disciplined procedures and compliant execution protect people, freight, and customer outcomes.",
  },
  {
    title: "Ownership At Every Step",
    desc: "From dispatch to final POD, each role has clear accountability and measurable standards.",
  },
  {
    title: "Structured Growth",
    desc: "High performers earn expanded scope through consistent execution, communication, and leadership.",
  },
] as const;

const HIRING_TRACKS = [
  "Company drivers and owner-operators",
  "Dispatch and operations coordinators",
  "Cross-border and compliance specialists",
] as const;

const PROOF_POINTS = [
  { label: "24/7", sub: "Operations coverage" },
  { label: "CA-US-MX", sub: "Cross-border network" },
  { label: "Safety-led", sub: "Execution culture" },
] as const;

export function CareersCultureSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-0)]">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(920px_520px_at_18%_12%,rgba(220,38,38,0.13),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_620px_at_84%_104%,rgba(37,99,235,0.09),transparent_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08),rgba(7,10,18,0.9))]" />
      </div>

      <Container className="relative max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-6 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
          <div className="text-xs font-semibold tracking-wide text-white/60">Careers & Culture</div>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Build Your Career With a Team That Executes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            We hire professionals who value structure, accountability, and clear communication. If
            you thrive in high-standards logistics, there is room to grow here.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-7 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {CULTURE_PILLARS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: reduceMotion ? 0 : idx * 0.04,
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/12",
                    idx === 0
                      ? "bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]"
                      : "bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]",
                    "p-6 shadow-[0_20px_40px_rgba(2,6,23,0.5)] backdrop-blur-xl",
                    "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/22 hover:shadow-[0_24px_48px_rgba(2,6,23,0.58)]",
                    idx === 2 ? "sm:col-span-2" : "",
                  )}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/34 to-transparent" />
                  {idx === 0 ? (
                    <div
                      className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full blur-3xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(220,38,38,0.22) 0%, rgba(220,38,38,0.03) 62%, transparent 78%)",
                      }}
                    />
                  ) : null}

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 items-center justify-center rounded-full border border-white/16 bg-white/[0.05] px-2.5 text-[11px] font-semibold text-white/72">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/18 to-transparent" />
                  </div>
                  <div
                    className={cn(
                      "relative z-10 mt-4 font-semibold text-white",
                      idx === 0 ? "text-[1.2rem] leading-tight" : "text-lg",
                    )}
                  >
                    {item.title}
                  </div>
                  <p className="relative z-10 mt-3 max-w-[48ch] text-sm leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <motion.div
              className={cn(
                "h-full rounded-3xl border border-white/14",
                "bg-[linear-gradient(150deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))]",
                "p-6 sm:p-7",
                "shadow-[0_26px_56px_rgba(2,6,23,0.52),inset_0_1px_0_rgba(255,255,255,0.16)]",
                "backdrop-blur-2xl",
              )}
            >
              <div className="text-xs font-semibold tracking-wide text-white/62">Now Hiring</div>
              <div className="mt-2 text-2xl font-semibold text-white sm:text-[1.8rem]">
                High-standard people for high-impact roles.
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Join an operations-first team where execution quality matters every day.
              </p>

              <ul className="mt-6 space-y-2.5">
                {HIRING_TRACKS.map((role) => (
                  <li key={role} className="flex items-start gap-2.5 text-sm text-white/82">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-500)]" />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {PROOF_POINTS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/14 bg-white/[0.04] px-2.5 py-2.5 text-center"
                  >
                    <div className="text-[13px] font-semibold text-white">{item.label}</div>
                    <div className="mt-0.5 text-[11px] text-white/62">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/careers#jobs"
                  onClick={() =>
                    trackCtaClick({
                      ctaId: "careers_primary_view_open_roles",
                      location: "careers_culture",
                      destination: "/careers#jobs",
                      label: "View Open Roles",
                    })
                  }
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold",
                    "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                    "shadow-[0_10px_24px_rgba(220,38,38,0.26)]",
                    focusRing,
                  )}
                >
                  View Open Roles
                </Link>
                <Link
                  href="/careers#drive"
                  onClick={() =>
                    trackCtaClick({
                      ctaId: "careers_secondary_driver_opportunities",
                      location: "careers_culture",
                      destination: "/careers#drive",
                      label: "Driver Opportunities",
                    })
                  }
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold",
                    "border border-white/20 bg-white/6 text-white hover:bg-white/10",
                    focusRing,
                  )}
                >
                  Driver Opportunities
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
