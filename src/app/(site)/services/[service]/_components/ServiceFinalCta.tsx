"use client";

// src/app/(site)/services/[service]/_components/ServiceFinalCta.tsx
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";
import { trackCtaClick } from "@/lib/analytics/cta";
import type { ServicePageModel } from "@/config/services";

function withServiceQuery(href: string, model: ServicePageModel) {
  // If the destination is /quote, enrich it with a service hint for preselection.
  // Keeps backwards compatibility if your quote form ignores these params today.
  if (!href.startsWith("/quote")) return href;

  const url = new URL(href, "https://npt.local"); // base required for URL()
  url.searchParams.set("service", model.slug ?? model.key);
  // Optional: give the quote page a friendly label (safe, non-breaking)
  url.searchParams.set("serviceLabel", model.meta?.title ?? model.hero?.title ?? "Service");

  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function ServiceFinalCta({ model }: { model: ServicePageModel }) {
  const primaryHref = withServiceQuery(model.finalCta.primary.href, model);
  const secondaryHref = model.finalCta.secondary.href;
  const handleSecondaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Future live-chat integration: avoid hash jump if no anchor exists yet.
    if (secondaryHref.startsWith("#") && !document.getElementById(secondaryHref.slice(1))) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("npt:open-live-chat"));
    }
  };

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface-0-light)]">
      {/* Ambient closure: feels like the end of a premium page */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.48),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(220,38,38,0.08),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(860px_520px_at_12%_100%,rgba(37,99,235,0.055),transparent_64%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(241,245,249,0.96))]" />
      </div>

      <Container className="site-page-container-narrow relative py-10 sm:py-12 md:py-14">
        <div
          className={cn(
            "relative isolate mx-auto overflow-hidden rounded-[28px]",
            "border border-[color:var(--color-border-light)]/70",
            "bg-[linear-gradient(165deg,rgba(255,255,255,0.94),rgba(255,255,255,0.86))]",
            "shadow-[0_18px_42px_rgba(2,6,23,0.09),inset_0_1px_0_rgba(255,255,255,0.92)]",
            "px-5 py-6 sm:px-8 sm:py-7 lg:px-10",
          )}
        >
          {/* Premium top sheen */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(420px_120px_at_16%_0%,rgba(220,38,38,0.1),transparent_72%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[46%] bg-[radial-gradient(480px_320px_at_100%_52%,rgba(37,99,235,0.08),transparent_72%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-6">
              <div className="grid min-h-[220px] grid-cols-1 items-center gap-3 sm:min-h-[248px] sm:grid-cols-[210px_1fr] sm:items-end sm:gap-2.5 md:grid-cols-[226px_1fr]">
                <div className="relative mx-auto hidden h-[214px] w-[170px] sm:-mb-6 sm:-ml-6 sm:mx-0 sm:block sm:h-[250px] sm:w-[190px] md:-mb-7 md:-ml-8 md:h-[286px] md:w-[226px] lg:-ml-10">
                  <Image
                    src="/services/Curtis.png"
                    alt="Curtis from NPT Logistics"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 640px) 170px, (max-width: 768px) 190px, 226px"
                  />
                </div>
                <div className="flex h-full flex-col justify-center pb-1 text-center sm:-ml-1 sm:text-left md:-ml-2">
                  <div className="mx-auto h-[2px] w-14 bg-[color:var(--color-brand-500)] sm:mx-0" />
                  <div className="mt-3 text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                    Need guidance?
                  </div>
                  <h2 className="mt-2 max-w-[460px] text-[21px] leading-tight font-semibold text-[color:var(--color-text-light)] sm:text-[25px] md:text-[26px]">
                    {model.finalCta.title}
                  </h2>
                  <p className="mt-2 max-w-[430px] text-[13.5px] leading-relaxed text-[color:var(--color-muted-light)] sm:text-sm">
                    {model.finalCta.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                className={cn(
                  "rounded-2xl border border-[color:var(--color-border-light)]/85",
                  "bg-[linear-gradient(155deg,rgba(255,255,255,0.96),rgba(255,255,255,0.86))]",
                  "p-4 sm:p-5 md:p-6",
                  "shadow-[0_10px_26px_rgba(2,6,23,0.06)]",
                )}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {model.finalCta.proof.map((p, idx) => (
                    <div
                      key={p.value}
                      className={cn(
                        "rounded-xl border border-[color:var(--color-border-light)] bg-white px-2 py-2 text-center",
                        idx === 2 && "col-span-2 sm:col-span-1",
                      )}
                    >
                      <div className="text-[13px] font-semibold text-[color:var(--color-text-light)]">
                        {p.value}
                      </div>
                      <div className="mt-0.5 text-[10px] leading-snug text-[color:var(--color-muted-light)]">
                        {p.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  <Link
                    href={primaryHref}
                    onClick={() =>
                      trackCtaClick({
                        ctaId: model.finalCta.primary.ctaId,
                        location: `service_final_cta:${model.key}`,
                        destination: primaryHref,
                        label: model.finalCta.primary.label,
                      })
                    }
                    className={cn(
                      "inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-semibold md:h-11",
                      "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                      "shadow-[0_8px_22px_rgba(220,38,38,0.25)]",
                      "focus-ring-light",
                    )}
                  >
                    {model.finalCta.primary.label}
                  </Link>

                  <Link
                    href={secondaryHref}
                    onClick={(event) => {
                      handleSecondaryClick(event);
                      trackCtaClick({
                        ctaId: model.finalCta.secondary.ctaId,
                        location: `service_final_cta:${model.key}`,
                        destination: secondaryHref,
                        label: model.finalCta.secondary.label,
                      });
                    }}
                    className={cn(
                      "inline-flex h-12 cursor-pointer items-center justify-center rounded-md px-5 text-sm font-semibold md:h-11",
                      "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                      "focus-ring-light",
                    )}
                  >
                    {model.finalCta.secondary.label}
                  </Link>
                </div>

                <div className="mt-3 text-center text-[11px] text-[color:var(--color-muted-light)]">
                  We&apos;ll align on lane profile, equipment fit, and launch timing before
                  execution starts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
