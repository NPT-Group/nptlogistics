import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, Package } from "lucide-react";
import { Container } from "../../components/layout/Container";
import { TrackedLink } from "../../components/analytics/TrackedLink";
import { getSeoLaneBySlug, getSeoLaneSlugs } from "@/config/seoLanes";
import { SITE_NAME, toAbsoluteUrl } from "@/lib/seo/site";

type Params = { slug: string };

export function generateStaticParams() {
  return getSeoLaneSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const lane = getSeoLaneBySlug(slug);
  if (!lane) return {};

  const canonicalPath = `/lanes/${lane.slug}`;
  return {
    title: lane.title,
    description: lane.metaDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: lane.title,
      description: lane.metaDescription,
      url: toAbsoluteUrl(canonicalPath),
    },
    twitter: {
      card: "summary_large_image",
      title: lane.title,
      description: lane.metaDescription,
    },
  };
}

function LaneJsonLd({
  slug,
  title,
  description,
  originLabel,
  destinationLabel,
}: {
  slug: string;
  title: string;
  description: string;
  originLabel: string;
  destinationLabel: string;
}) {
  const pageUrl = toAbsoluteUrl(`/lanes/${slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: toAbsoluteUrl("/"),
      },
      areaServed: [originLabel, destinationLabel],
      url: pageUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: toAbsoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Lanes", item: toAbsoluteUrl("/lanes") },
        { "@type": "ListItem", position: 3, name: title, item: pageUrl },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LanePage({ params }: { params: Params | Promise<Params> }) {
  const { slug } = await Promise.resolve(params);
  const lane = getSeoLaneBySlug(slug);
  if (!lane) notFound();

  return (
    <main className="bg-[color:var(--color-surface-0)]">
      <LaneJsonLd
        slug={lane.slug}
        title={lane.title}
        description={lane.metaDescription}
        originLabel={lane.originLabel}
        destinationLabel={lane.destinationLabel}
      />
      <section className="relative overflow-hidden bg-[color:var(--color-surface-0)] py-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:80px_80px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_440px_at_70%_24%,rgba(30,64,175,0.16),transparent_58%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.7)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
        </div>
        <Container className="site-page-container relative max-w-6xl">
          <div className="py-6 sm:py-8">
            <div className="mb-2.5 h-[2px] w-12 bg-[color:var(--color-brand-500)] sm:w-14" />
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-brand-500)]">
              Freight lane
            </p>
            <h1 className="mt-2.5 max-w-4xl text-[1.9rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]">
              {lane.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)] sm:text-[15px]">
              {lane.intro}
            </p>
            <div className="mt-6">
              <TrackedLink
                href="/quote"
                ctaId={`lane_detail_quote_${lane.slug}`}
                location="lane_detail:hero"
                label="Request a quote for this lane"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[color:var(--color-brand-600)] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(220,38,38,0.25)] transition hover:bg-[color:var(--color-brand-700)]"
              >
                Request a quote for this lane
                <ArrowRight className="h-4 w-4" />
              </TrackedLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-10 sm:py-12">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_14%_-12%,rgba(220,38,38,0.08),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1000px_520px_at_88%_108%,rgba(30,64,175,0.10),transparent_66%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_45%,#e2e8f0_100%)]" />
        </div>
        <Container className="site-page-container relative max-w-6xl">
          <section className="overflow-hidden rounded-2xl border border-[color:var(--color-border-light)] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
            <div className="border-b border-[color:var(--color-border-light)] bg-[linear-gradient(180deg,rgba(248,250,252,0.9),white)] px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
                What we deliver on this lane
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--color-muted-light)]">
                Mode-fit planning, compliance, and visibility from pickup to delivery
              </p>
            </div>
            <ul className="divide-y divide-[color:var(--color-border-light)] px-5 py-3 sm:px-6">
              {lane.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-brand-600)]" />
                  <span className="text-sm text-[color:var(--color-text-light)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/50 px-5 py-3 text-center sm:px-6">
              <p className="text-[12px] text-[color:var(--color-muted-light)]">
                Our team typically responds within 24 hours
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[color:var(--color-brand-600)]" />
                <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
                  Related services
                </h2>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {lane.relatedServices.map((service) => (
                  <TrackedLink
                    key={service.href}
                    href={service.href}
                    ctaId={`lane_detail_related_service_${lane.slug}_${service.label}`}
                    location="lane_detail:related_services"
                    label={service.label}
                    className="group flex items-center justify-between rounded-xl border border-[color:var(--color-border-light)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-text-light)] transition hover:border-[color:var(--color-text-light)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                  >
                    {service.label}
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </TrackedLink>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[color:var(--color-brand-600)]" />
                <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
                  Related locations
                </h2>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {lane.relatedLocations.map((location) => (
                  <TrackedLink
                    key={location.href}
                    href={location.href}
                    ctaId={`lane_detail_related_location_${lane.slug}_${location.label}`}
                    location="lane_detail:related_locations"
                    label={location.label}
                    className="group flex items-center justify-between rounded-xl border border-[color:var(--color-border-light)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-text-light)] transition hover:border-[color:var(--color-text-light)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                  >
                    {location.label}
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </TrackedLink>
                ))}
              </div>
            </div>
          </section>
        </Container>
      </section>
    </main>
  );
}

