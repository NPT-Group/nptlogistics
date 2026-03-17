"use client";

import Link from "next/link";
import { Container } from "@/app/(site)/components/layout/Container";
import { trackCtaClick, toCtaSlug } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";
import type { ServicePageModel } from "@/config/services";
import {
  FreightFitGuideMedia,
  FreightFitGuideRecommendations,
} from "./FreightFitGuide";
import {
  BulletList,
  ConversionRail,
  RelatedServicesList,
  SinglePanel,
  StepTimeline,
} from "./ServiceSingleBlocks";

const SINGLE_THEME: Partial<
  Record<
    ServicePageModel["key"],
    {
      accent: string;
      bg: string;
      veil: string;
      shell: string;
    }
  >
> = {
  ltl: {
    accent: "#dc2626",
    bg: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(220,38,38,0.045),transparent_68%)]",
    shell: "bg-white/70",
  },
  /* COMMENTED OUT - uncomment to restore intermodal
  intermodal: {
    accent: "#2563eb",
    bg: "bg-[linear-gradient(180deg,rgba(248,251,255,0.99),rgba(243,248,255,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(37,99,235,0.045),transparent_68%)]",
    shell: "bg-white/72",
  },
  */
  hazmat: {
    accent: "#b91c1c",
    bg: "bg-[linear-gradient(180deg,rgba(252,248,248,0.99),rgba(250,244,244,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(185,28,28,0.05),transparent_68%)]",
    shell: "bg-white/74",
  },
  "temperature-controlled": {
    accent: "#0284c7",
    bg: "bg-[linear-gradient(180deg,rgba(248,252,255,0.99),rgba(243,249,253,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(2,132,199,0.05),transparent_68%)]",
    shell: "bg-white/72",
  },
};

export function ServiceSingleLayout({ model }: { model: ServicePageModel }) {
  if (!model.singleLayout) return null;

  const theme = SINGLE_THEME[model.key] ?? {
    accent: "#dc2626",
    bg: "bg-[linear-gradient(180deg,rgba(249,250,252,0.99),rgba(244,247,251,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(220,38,38,0.045),transparent_68%)]",
    shell: "bg-white/72",
  };

  const hasFreightFit = Boolean(model.singleLayout.freightFit);

  return (
    <section className={cn("relative overflow-hidden", theme.bg)}>
      <div className={cn("pointer-events-none absolute inset-0", theme.veil)} aria-hidden="true" />

      <Container className="site-page-container relative z-10 py-10 sm:py-12 md:py-14 lg:py-16">
        {hasFreightFit ? (
          /* Fortune 500 layout: matches Dry Van / truckload section grid and styling */
          <div className="relative">
            {/* Intro row: title left (6), diagram + specs right (6) */}
            <div className="grid gap-0 border-y border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
              <div className="bg-[rgba(255,255,255,0.82)] px-6 py-7 sm:px-8 sm:py-8 lg:col-span-6 lg:px-9 lg:py-10">
                <div className="mb-3 h-[2px] w-14" style={{ backgroundColor: theme.accent }} />
                <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                  {model.hero.kicker}
                </div>
                <h2 className="mt-2.5 text-[1.78rem] leading-[1.14] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[2.08rem]">
                  {model.hero.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                  {model.hero.description}
                </p>
              </div>
              <div className="relative border-t border-[color:var(--color-border-light)]/65 bg-white/60 lg:col-span-6 lg:border-t-0 lg:border-l">
                <div className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                  <FreightFitGuideMedia
                    diagram={model.singleLayout.freightFit!.diagram}
                    diagramAlt={model.singleLayout.freightFit!.diagramAlt}
                    specs={model.singleLayout.freightFit!.specs}
                    disclaimer={model.singleLayout.freightFit!.disclaimer}
                  />
                </div>
              </div>
            </div>

            {/* Content row: recommendations + content left (7), CTA right (5) — gap-0, stretch, same padding as Dry Van */}
            <div className="grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
              <div className="order-1 bg-white/64 px-5 py-6 sm:px-8 sm:py-8 md:px-9 md:py-9 lg:order-1 lg:col-span-7 lg:px-9 lg:py-10">
                <FreightFitGuideRecommendations
                  title={model.singleLayout.freightFit!.title}
                  intro={model.singleLayout.freightFit!.intro}
                  rules={model.singleLayout.freightFit!.rules}
                  onRecommendationClick={(rule, href) =>
                    trackCtaClick({
                      ctaId: `service_single_fit_${model.key}_${toCtaSlug(rule.recommendation)}`,
                      location: `service_single_fit:${model.key}`,
                      destination: href,
                      label: rule.recommendation,
                    })
                  }
                />

                <div className="mt-8">
                  <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
                    {model.singleLayout.whenToUse.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                    {model.singleLayout.whenToUse.intro}
                  </p>
                  <ul className="mt-4.5 space-y-2.5">
                    {model.singleLayout.whenToUse.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                          aria-hidden="true"
                        />
                        <span className="text-[14px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 lg:hidden">
                  <ConversionRail
                    title={model.singleLayout.conversion.title}
                    body={model.singleLayout.conversion.body}
                    signals={model.singleLayout.conversion.signals}
                    primary={{
                      label: model.hero.primaryCta.label,
                      href: model.hero.primaryCta.href,
                    }}
                    secondary={{
                      label: model.hero.secondaryCta.label,
                      href: model.hero.secondaryCta.href,
                    }}
                    accent={theme.accent}
                    onPrimaryClick={() =>
                      trackCtaClick({
                        ctaId: model.hero.primaryCta.ctaId,
                        location: `service_single_layout:${model.key}`,
                        destination: model.hero.primaryCta.href,
                        label: model.hero.primaryCta.label,
                      })
                    }
                    onSecondaryClick={() =>
                      trackCtaClick({
                        ctaId: model.hero.secondaryCta.ctaId,
                        location: `service_single_layout:${model.key}`,
                        destination: model.hero.secondaryCta.href,
                        label: model.hero.secondaryCta.label,
                      })
                    }
                  />
                </div>

                {model.singleLayout.howToUse ? (
                  <div className="mt-8">
                    <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
                      How to use this Service
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                      {model.singleLayout.howToUse.intro}
                    </p>
                    <ul className="mt-4.5 space-y-2.5">
                      {model.singleLayout.howToUse.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                            aria-hidden="true"
                          />
                          <span className="text-[14px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-8">
                    <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
                      {model.singleLayout.howItWorks.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                      {model.singleLayout.howItWorks.intro}
                    </p>
                    <ol className="mt-4.5 space-y-3.5">
                      {model.singleLayout.howItWorks.steps.map((step, idx) => (
                        <li
                          key={step.title}
                          className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-semibold text-white"
                              style={{ backgroundColor: theme.accent }}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-[13.5px] font-semibold text-[color:var(--color-text-light)]">
                              {step.title}
                            </span>
                          </div>
                          <p className="mt-2 text-[12.75px] leading-[1.62] text-[color:var(--color-muted-light)]">
                            {step.description}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
                    Operational Coverage & Service Standards
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                    {model.singleLayout.capabilities.intro}
                  </p>
                  <ul className="mt-4.5 space-y-2.5">
                    {model.singleLayout.capabilities.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                          aria-hidden="true"
                        />
                        <span className="text-[14px] leading-[1.65] text-[color:var(--color-muted-light)] sm:text-[14.5px]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {model.singleLayout.showRelated !== false ? (
                  <div className="mt-8 lg:hidden">
                    <RelatedServicesList
                      title={`Related services for ${model.hero.kicker}`}
                      items={model.singleLayout.relatedServices}
                      trackingContext={{
                        serviceKey: model.key,
                        location: `service_single_related:${model.key}`,
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "order-2 border-b border-[color:var(--color-border-light)]/65 px-5 py-6 sm:px-8 sm:py-8 md:px-9 md:py-9 lg:order-2 lg:col-span-5 lg:border-t-0 lg:border-b-0 lg:border-l lg:px-9 lg:py-10",
                  "bg-white/60",
                )}
              >
                <div className="flex h-full flex-col gap-4">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg",
                      "border border-[color:var(--color-border-light)]",
                      "bg-white/82",
                      "p-4 sm:p-5 md:p-6",
                    )}
                  >
                    <h3 className="text-[1.14rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.2rem]">
                      Get pricing and capacity for this mode
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                      Share your lane requirements and we will return a structured quote with
                      equipment fit, timing expectations, and operating assumptions.
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {model.singleLayout.conversion.signals.map((signal) => (
                        <li
                          key={signal}
                          className="flex items-center gap-2 text-xs text-[color:var(--color-muted-light)]"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                          />
                          {signal}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 grid gap-3">
                      <Link
                        href={model.hero.primaryCta.href}
                        onClick={() =>
                          trackCtaClick({
                            ctaId: model.hero.primaryCta.ctaId,
                            location: `service_single_layout:${model.key}`,
                            destination: model.hero.primaryCta.href,
                            label: model.hero.primaryCta.label,
                          })
                        }
                        className={cn(
                          "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold text-white md:h-11",
                          "shadow-[0_8px_22px_rgba(2,6,23,0.18)]",
                          "focus-ring-light",
                        )}
                        style={{ backgroundColor: theme.accent }}
                      >
                        {model.hero.primaryCta.label}
                      </Link>
                      <Link
                        href={model.hero.secondaryCta.href}
                        onClick={() =>
                          trackCtaClick({
                            ctaId: model.hero.secondaryCta.ctaId,
                            location: `service_single_layout:${model.key}`,
                            destination: model.hero.secondaryCta.href,
                            label: model.hero.secondaryCta.label,
                          })
                        }
                        className={cn(
                          "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:h-11",
                          "border border-[color:var(--color-border-light)] bg-white text-[color:var(--color-text-light)] hover:bg-[color:var(--color-surface-0-light)]",
                          "focus-ring-light",
                        )}
                      >
                        {model.hero.secondaryCta.label}
                      </Link>
                    </div>
                  </div>
                  {model.singleLayout.showRelated !== false ? (
                    <RelatedServicesList
                      title={`Related services for ${model.hero.kicker}`}
                      items={model.singleLayout.relatedServices}
                      trackingContext={{
                        serviceKey: model.key,
                        location: `service_single_related:${model.key}`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Utility row: Execution and compliance — full width, same as Dry Van */}
            {model.singleLayout.trustSnippet && model.singleLayout.highlights?.length ? (
              <div className="grid gap-0 border-b border-[color:var(--color-border-light)]/70 lg:grid-cols-12 lg:items-stretch">
                <div className="bg-white/62 px-6 py-7 sm:px-8 sm:py-8 lg:col-span-12 lg:px-9 lg:py-9">
                  <div className="h-full rounded-lg border border-[color:var(--color-border-light)] bg-white/82 p-5 sm:p-6">
                    <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                      Execution and compliance
                    </div>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-muted-light)]">
                      {model.singleLayout.trustSnippet.body}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {model.singleLayout.highlights.map((h) => (
                        <li
                          key={h.title}
                          className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                        >
                          <div className="text-[14px] font-semibold text-[color:var(--color-text-light)]">
                            {h.title}
                          </div>
                          <div className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                            {h.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* Original single layout: one content column (8) + sidebar (4) */
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-7">
            <div className="order-1 space-y-5 sm:space-y-6 lg:order-1 lg:col-span-8">
              <section
                className={cn(
                  "rounded-2xl border border-[color:var(--color-border-light)] p-6 sm:p-7",
                  theme.shell,
                )}
              >
                <div className="mb-3 h-[2px] w-14" style={{ backgroundColor: theme.accent }} />
                <div className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)]">
                  {model.hero.kicker}
                </div>
                <h2 className="mt-2 text-[1.78rem] leading-[1.14] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[2.04rem]">
                  {model.hero.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
                  {model.hero.description}
                </p>
              </section>

              <SinglePanel
              title={model.singleLayout.whenToUse.title}
              intro={model.singleLayout.whenToUse.intro}
              className={theme.shell}
            >
              <BulletList items={model.singleLayout.whenToUse.items} accent={theme.accent} />
            </SinglePanel>

            {/* Mobile-only placement: CTA after definition + when-to-use */}
            <div className="lg:hidden">
              <ConversionRail
                title={model.singleLayout.conversion.title}
                body={model.singleLayout.conversion.body}
                signals={model.singleLayout.conversion.signals}
                primary={{
                  label: model.hero.primaryCta.label,
                  href: model.hero.primaryCta.href,
                }}
                secondary={{
                  label: model.hero.secondaryCta.label,
                  href: model.hero.secondaryCta.href,
                }}
                accent={theme.accent}
                onPrimaryClick={() =>
                  trackCtaClick({
                    ctaId: model.hero.primaryCta.ctaId,
                    location: `service_single_layout:${model.key}`,
                    destination: model.hero.primaryCta.href,
                    label: model.hero.primaryCta.label,
                  })
                }
                onSecondaryClick={() =>
                  trackCtaClick({
                    ctaId: model.hero.secondaryCta.ctaId,
                    location: `service_single_layout:${model.key}`,
                    destination: model.hero.secondaryCta.href,
                    label: model.hero.secondaryCta.label,
                  })
                }
              />
            </div>

            {model.singleLayout.howToUse ? (
              <SinglePanel
                title="How to use this Service"
                intro={model.singleLayout.howToUse.intro}
                className={theme.shell}
              >
                <BulletList items={model.singleLayout.howToUse.items} accent={theme.accent} />
              </SinglePanel>
            ) : (
              <SinglePanel
                title={model.singleLayout.howItWorks.title}
                intro={model.singleLayout.howItWorks.intro}
                className={theme.shell}
              >
                <StepTimeline steps={model.singleLayout.howItWorks.steps} accent={theme.accent} />
              </SinglePanel>
            )}

            <SinglePanel
              title={
                model.singleLayout.freightFit
                  ? "Operational Coverage & Service Standards"
                  : model.singleLayout.capabilities.title
              }
              intro={model.singleLayout.capabilities.intro}
              className={theme.shell}
            >
              <BulletList items={model.singleLayout.capabilities.items} accent={theme.accent} />
            </SinglePanel>

            {model.singleLayout.freightFit &&
            model.singleLayout.trustSnippet &&
            model.singleLayout.highlights?.length ? (
              <SinglePanel
                title="Execution and compliance"
                intro={model.singleLayout.trustSnippet.body}
                className={theme.shell}
              >
                <ul className="mt-4 space-y-3">
                  {model.singleLayout.highlights.map((h) => (
                    <li
                      key={h.title}
                      className="rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] px-4 py-3"
                    >
                      <div className="text-[14px] font-semibold text-[color:var(--color-text-light)]">
                        {h.title}
                      </div>
                      <div className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--color-muted-light)]">
                        {h.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </SinglePanel>
            ) : (
              <SinglePanel
                title={model.singleLayout.riskAndCompliance.title}
                intro={model.singleLayout.riskAndCompliance.intro}
                className={theme.shell}
              >
                <BulletList items={model.singleLayout.riskAndCompliance.items} accent={theme.accent} />
              </SinglePanel>
            )}

            {/* Mobile-only placement: related services at the end */}
            {model.singleLayout.showRelated !== false ? (
              <div className="lg:hidden">
                <RelatedServicesList
                  title={`Related services for ${model.hero.kicker}`}
                  items={model.singleLayout.relatedServices}
                  trackingContext={{
                    serviceKey: model.key,
                    location: `service_single_related:${model.key}`,
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="order-2 hidden space-y-5 sm:space-y-6 lg:block lg:col-span-4">
            <ConversionRail
              title={model.singleLayout.conversion.title}
              body={model.singleLayout.conversion.body}
              signals={model.singleLayout.conversion.signals}
              primary={{
                label: model.hero.primaryCta.label,
                href: model.hero.primaryCta.href,
              }}
              secondary={{
                label: model.hero.secondaryCta.label,
                href: model.hero.secondaryCta.href,
              }}
              accent={theme.accent}
              onPrimaryClick={() =>
                trackCtaClick({
                  ctaId: model.hero.primaryCta.ctaId,
                  location: `service_single_layout:${model.key}`,
                  destination: model.hero.primaryCta.href,
                  label: model.hero.primaryCta.label,
                })
              }
              onSecondaryClick={() =>
                trackCtaClick({
                  ctaId: model.hero.secondaryCta.ctaId,
                  location: `service_single_layout:${model.key}`,
                  destination: model.hero.secondaryCta.href,
                  label: model.hero.secondaryCta.label,
                })
              }
            />

            {model.singleLayout.showRelated !== false ? (
              <RelatedServicesList
                title={`Related services for ${model.hero.kicker}`}
                items={model.singleLayout.relatedServices}
                trackingContext={{
                  serviceKey: model.key,
                  location: `service_single_related:${model.key}`,
                }}
              />
            ) : null}
          </div>
        </div>
        )}
      </Container>
    </section>
  );
}
