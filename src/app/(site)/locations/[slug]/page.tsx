import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "../../components/layout/Container";
import { TrackedLink } from "../../components/analytics/TrackedLink";
import { getSeoLocationBySlug, getSeoLocationSlugs } from "@/config/seoLocations";
import { SITE_NAME, toAbsoluteUrl } from "@/lib/seo/site";

type Params = { slug: string };

export function generateStaticParams() {
  return getSeoLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const location = getSeoLocationBySlug(slug);
  if (!location) return {};

  const canonicalPath = `/locations/${location.slug}`;
  return {
    title: location.title,
    description: location.metaDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${location.city}, ${location.region} Freight Logistics`,
      description: location.metaDescription,
      url: toAbsoluteUrl(canonicalPath),
    },
    twitter: {
      card: "summary_large_image",
      title: `${location.city}, ${location.region} Freight Logistics`,
      description: location.metaDescription,
    },
  };
}

function LocationJsonLd({
  slug,
  city,
  region,
  country,
  title,
  description,
}: {
  slug: string;
  city: string;
  region: string;
  country: string;
  title: string;
  description: string;
}) {
  const pageUrl = toAbsoluteUrl(`/locations/${slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      areaServed: `${city}, ${region}, ${country}`,
      description,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: toAbsoluteUrl("/"),
      },
      url: pageUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: toAbsoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Locations", item: toAbsoluteUrl("/locations") },
        { "@type": "ListItem", position: 3, name: `${city}, ${region}`, item: pageUrl },
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

export default async function LocationPage({ params }: { params: Params | Promise<Params> }) {
  const { slug } = await Promise.resolve(params);
  const location = getSeoLocationBySlug(slug);
  if (!location) notFound();

  return (
    <main className="bg-[color:var(--color-surface-0)]">
      <LocationJsonLd
        slug={location.slug}
        city={location.city}
        region={location.region}
        country={location.country}
        title={location.title}
        description={location.metaDescription}
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
              Freight hub
            </p>
            <h1 className="mt-2.5 max-w-4xl text-[1.9rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]">
              {location.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)] sm:text-[15px]">
              {location.intro}
            </p>
            <div className="mt-6">
              <TrackedLink
                href="/quote"
                ctaId={`location_detail_quote_${location.slug}`}
                location="location_detail:hero"
                label="Request a freight quote"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[color:var(--color-brand-600)] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(220,38,38,0.25)] transition hover:bg-[color:var(--color-brand-700)]"
              >
                Request a freight quote
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
          <section className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
            <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
              Freight capabilities in {location.city}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:var(--color-muted-light)]">
              {location.serviceHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
              Popular lanes from {location.city}, {location.region}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {location.topLanes.map((lane) => (
                <TrackedLink
                  key={lane.href}
                  href={lane.href}
                  ctaId={`location_detail_lane_${location.slug}_${lane.label}`}
                  location="location_detail:top_lanes"
                  label={lane.label}
                  className="rounded-xl border border-[color:var(--color-border-light)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-text-light)] transition hover:border-[color:var(--color-text-light)]"
                >
                  {lane.label}
                </TrackedLink>
              ))}
            </div>
          </section>
        </Container>
      </section>
    </main>
  );
}

