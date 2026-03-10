import Link from "next/link";
import { Section } from "@/app/(site)/components/layout/Section";
import { Container } from "@/app/(site)/components/layout/Container";
import { cn } from "@/lib/cn";

export type FreightRule = {
  condition: string;
  recommendation: string;
  serviceSlug?: string;
  description: string;
};

export type FreightFitGuideProps = {
  title: string;
  intro?: string;
  diagram: string;
  diagramAlt?: string;
  specs: FreightSpecs;
  rules: FreightRule[];
  disclaimer?: string;
};

export type FreightSpecs = {
  length: string;
  width: string;
  height: string;
  weight: string;
  pallets?: string;
};

const SERVICE_LINKS: Record<string, string> = {
  ltl: "/services/ltl",
  "dry-van": "/services/truckload#section-dry-van",
  reefer: "/services/temperature-controlled",
  flatbed: "/services/truckload#section-flatbed",
  "step-deck": "/services/truckload#section-rgn-oversize",
  "rgn-oversize": "/services/truckload#section-rgn-oversize",
  hazmat: "/services/hazmat",
  intermodal: "/services/intermodal",
  "canada-us": "/services/cross-border#section-canada-us",
  "mexico-cross-border": "/services/cross-border#section-mexico-cross-border",
  "ocean-freight": "/services/cross-border#section-ocean-freight",
  "air-freight": "/services/cross-border#section-air-freight",
  "warehousing-distribution": "/services/value-added#section-warehousing-distribution",
  "managed-capacity": "/services/value-added#section-managed-capacity",
  "dedicated-contract": "/services/value-added#section-dedicated-contract",
  "project-oversize-programs": "/services/value-added#section-project-oversize-programs",
};

function toServiceHref(serviceSlug?: string) {
  if (!serviceSlug) return undefined;
  if (serviceSlug.startsWith("/")) return serviceSlug;
  return SERVICE_LINKS[serviceSlug] ?? `/services/${serviceSlug}`;
}

export function FreightFitGuideMedia({
  diagram,
  diagramAlt = "Freight equipment dimensions diagram",
  specs,
  disclaimer,
}: {
  diagram: string;
  diagramAlt?: string;
  specs: FreightSpecs;
  disclaimer?: string;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border-light)] bg-white p-4 shadow-sm">
      <div className="overflow-hidden rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]">
        <img src={diagram} alt={diagramAlt} className="h-auto w-full" />
      </div>

      <div className="mt-4 rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)] p-3">
        <h3 className="text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)] uppercase">
          Technical Specs
        </h3>
        <dl className="mt-2 space-y-1.5 text-sm text-[color:var(--color-text-light)]">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-[color:var(--color-muted-light)]">Length</dt>
            <dd className="text-right font-medium">{specs.length}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-[color:var(--color-muted-light)]">Width</dt>
            <dd className="text-right font-medium">{specs.width}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-[color:var(--color-muted-light)]">Height</dt>
            <dd className="text-right font-medium">{specs.height}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-[color:var(--color-muted-light)]">Max Freight Weight</dt>
            <dd className="text-right font-medium">{specs.weight}</dd>
          </div>
          {specs.pallets ? (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[color:var(--color-muted-light)]">Pallet Capacity</dt>
              <dd className="text-right font-medium">{specs.pallets}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      {disclaimer ? (
        <p className="mt-2 text-[11px] leading-[1.5] text-[color:var(--color-subtle-light)]">{disclaimer}</p>
      ) : null}
    </div>
  );
}

export function FreightFitGuideRecommendations({
  rules,
  title = "Freight Fit Recommendations",
  intro,
  onRecommendationClick,
}: {
  rules: FreightRule[];
  title?: string;
  intro?: string;
  onRecommendationClick?: (rule: FreightRule, href: string) => void;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-[1.18rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.28rem]">
        {title}
      </h3>
      {intro ? (
        <p className="mt-2.5 text-[15px] leading-[1.72] text-[color:var(--color-muted-light)] sm:text-[15.5px]">
          {intro}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {rules.map((rule) => {
          const href = toServiceHref(rule.serviceSlug);
          const cardClass = cn(
            "rounded-lg border border-[color:var(--color-border-light)] bg-white p-4 shadow-sm",
            "transition-all",
            href
              ? "group block cursor-pointer hover:border-[color:var(--color-brand-300)] hover:shadow-md"
              : "",
          );

          const content = (
            <>
              <div className="text-[11px] font-semibold tracking-wide text-[color:var(--color-muted-light)] uppercase">
                If your freight is
              </div>
              <h4 className="mt-1 text-sm font-semibold text-[color:var(--color-text-light)]">
                {rule.condition}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
                {rule.description}
              </p>
              <div className="mt-3 text-xs font-semibold tracking-wide text-[color:var(--color-muted-light)] uppercase">
                Recommended
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    href
                      ? "text-[color:var(--color-brand-600)] underline decoration-[color:var(--color-brand-300)] underline-offset-2 group-hover:text-[color:var(--color-brand-700)]"
                      : "text-[color:var(--color-text-light)]",
                  )}
                >
                  {rule.recommendation}
                </span>
                {href ? (
                  <span className="text-xs font-medium text-[color:var(--color-subtle-light)] group-hover:text-[color:var(--color-brand-600)]">
                    View service {" >"}
                  </span>
                ) : null}
              </div>
            </>
          );

          if (href) {
            return (
              <Link
                key={`${rule.condition}-${rule.recommendation}`}
                href={href}
                onClick={() => onRecommendationClick?.(rule, href)}
                className={cardClass}
              >
                {content}
              </Link>
            );
          }

          return (
            <article key={`${rule.condition}-${rule.recommendation}`} className={cardClass}>
              {content}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function FreightFitGuide({
  title,
  intro,
  diagram,
  diagramAlt,
  specs,
  rules,
  disclaimer,
}: FreightFitGuideProps) {
  return (
    <Section variant="light" className="!py-0 bg-transparent">
      <Container className="max-w-none px-0">
        <h2 className="text-[1.35rem] font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-[1.5rem]">
          {title}
        </h2>
        {intro ? (
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">{intro}</p>
        ) : null}

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <FreightFitGuideMedia
            diagram={diagram}
            diagramAlt={diagramAlt}
            specs={specs}
            disclaimer={disclaimer}
          />
          <FreightFitGuideRecommendations rules={rules} title={title} intro={intro} />
        </div>
      </Container>
    </Section>
  );
}
