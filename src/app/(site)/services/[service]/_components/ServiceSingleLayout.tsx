"use client";

import { Container } from "@/app/(site)/components/layout/Container";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";
import type { ServicePageModel } from "@/config/services";
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
  intermodal: {
    accent: "#2563eb",
    bg: "bg-[linear-gradient(180deg,rgba(248,251,255,0.99),rgba(243,248,255,0.97))]",
    veil: "bg-[radial-gradient(980px_500px_at_50%_-12%,rgba(37,99,235,0.045),transparent_68%)]",
    shell: "bg-white/72",
  },
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

  return (
    <section className={cn("relative overflow-hidden", theme.bg)}>
      <div className={cn("pointer-events-none absolute inset-0", theme.veil)} aria-hidden="true" />

      <Container className="relative z-10 max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="space-y-6 lg:col-span-8">
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

            <SinglePanel
              title={model.singleLayout.howItWorks.title}
              intro={model.singleLayout.howItWorks.intro}
              className={theme.shell}
            >
              <StepTimeline steps={model.singleLayout.howItWorks.steps} accent={theme.accent} />
            </SinglePanel>

            <SinglePanel
              title={model.singleLayout.capabilities.title}
              intro={model.singleLayout.capabilities.intro}
              className={theme.shell}
            >
              <BulletList items={model.singleLayout.capabilities.items} accent={theme.accent} />
            </SinglePanel>

            <SinglePanel
              title={model.singleLayout.riskAndCompliance.title}
              intro={model.singleLayout.riskAndCompliance.intro}
              className={theme.shell}
            >
              <BulletList items={model.singleLayout.riskAndCompliance.items} accent={theme.accent} />
            </SinglePanel>
          </div>

          <div className="space-y-6 lg:col-span-4">
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

            <RelatedServicesList
              title={`Related services for ${model.hero.kicker}`}
              items={model.singleLayout.relatedServices}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
