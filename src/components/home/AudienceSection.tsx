"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import { PackageSearch, Radar, Briefcase } from "lucide-react";

const AUDIENCES = [
  {
    title: "I’m Shipping Freight",
    description: "Explore shipping solutions for your freight, lanes, and requirements.",
    href: "/solutions",
    cta: "View Solutions",
    icon: PackageSearch,
  },
  {
    title: "Track an Existing Shipment",
    description: "Check the latest status updates and shipment progress in real time.",
    href: "/tracking",
    cta: "Track Shipment",
    icon: Radar,
  },
  {
    title: "I Want to Work at NPT",
    description: "View open driver and corporate opportunities across the network.",
    href: "/careers",
    cta: "View Jobs",
    icon: Briefcase,
  },
] as const;

export function AudienceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section>
      <div className="relative">
        {/* This “bridge” background is what makes the site feel less dark right after the hero */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {/* soft light wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-transparent" />
          {/* subtle spotlight */}
          <div className="absolute top-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
          {/* gentle top divider line */}
          <div className="absolute top-0 right-0 left-0 h-px bg-white/10" />
        </div>

        <Container>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="py-10 sm:py-12"
          >
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {AUDIENCES.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: reduceMotion ? 0 : idx * 0.06,
                    }}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl",
                      "border border-white/10 bg-white/[0.05] backdrop-blur",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                      "transition",
                      "hover:border-white/15 hover:bg-white/[0.075]",
                      "focus-within:ring-2 focus-within:ring-[var(--color-brand-600)] focus-within:ring-offset-2 focus-within:ring-offset-black/40",
                    )}
                  >
                    {/* subtle hover sheen */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-white/[0.10] blur-2xl" />
                      <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-[var(--color-brand-600)]/[0.10] blur-2xl" />
                    </div>

                    <div className="relative p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            "border border-white/10 bg-white/[0.06]",
                            "text-white/90",
                          )}
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-white/75">
                            {item.description}
                          </p>

                          <Link
                            href={item.href}
                            className={cn(
                              "mt-4 inline-flex items-center gap-2 text-sm font-medium",
                              "text-white underline-offset-4",
                              "hover:underline",
                              "focus:outline-none",
                            )}
                          >
                            {item.cta} <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
