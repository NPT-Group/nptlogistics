import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../components/layout/Container";
import { getSeoLaneBySlug, getSeoLanePriority, getSeoLaneSlugs } from "@/config/seoLanes";
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
  const priority = getSeoLanePriority(lane.slug);

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
            <span className="inline-flex rounded-full border border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-brand-700)]">
              {priority} corridor
            </span>
            <h1 className="mt-3 max-w-4xl text-[1.9rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]">
              {lane.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)] sm:text-[15px]">
              {lane.intro}
            </p>
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
            <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">Best fit for this lane</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:var(--color-muted-light)]">
              {lane.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">Related services</h2>
              <div className="mt-3 flex flex-col gap-2">
                {lane.relatedServices.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="rounded-xl border border-[color:var(--color-border-light)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-text-light)] transition hover:border-[color:var(--color-text-light)]"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">Related locations</h2>
              <div className="mt-3 flex flex-col gap-2">
                {lane.relatedLocations.map((location) => (
                  <Link
                    key={location.href}
                    href={location.href}
                    className="rounded-xl border border-[color:var(--color-border-light)] bg-white px-4 py-3 text-sm font-medium text-[color:var(--color-text-light)] transition hover:border-[color:var(--color-text-light)]"
                  >
                    {location.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-8">
            <Link
              href="/quote"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[color:var(--color-brand-600)] px-5 text-sm font-semibold text-white hover:bg-[color:var(--color-brand-700)]"
            >
              Request a quote for this lane
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

