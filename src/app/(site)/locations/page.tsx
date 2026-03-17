import type { Metadata } from "next";
import { Container } from "../components/layout/Container";
import { TrackedLink } from "../components/analytics/TrackedLink";
import { SEO_LOCATIONS, getSeoLocationPriority, type SeoPriority } from "@/config/seoLocations";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Freight Locations",
  description:
    "Freight shipping and trucking services by location across Canada, the United States, and Mexico.",
  alternates: {
    canonical: "/locations",
  },
};

export default function LocationsHubPage() {
  const sorted = [...SEO_LOCATIONS].sort((a, b) => {
    const rank: Record<SeoPriority, number> = { P1: 1, P2: 2, P3: 3 };
    const pa = rank[getSeoLocationPriority(a.slug)];
    const pb = rank[getSeoLocationPriority(b.slug)];
    return pa - pb || a.city.localeCompare(b.city);
  });

  return (
    <main className="bg-[color:var(--color-surface-0)]">
      <section className="relative overflow-hidden bg-[color:var(--color-surface-0)] py-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:80px_80px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_440px_at_70%_24%,rgba(30,64,175,0.16),transparent_58%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(2,6,23,0.7)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
        </div>
        <Container className="site-page-container relative max-w-6xl">
          <div className="py-6 sm:py-8">
            <div className="mb-2.5 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-brand-500)]">
              Freight by location
            </p>
            <h1 className="mt-2.5 max-w-4xl text-[1.9rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]">
              North America freight hubs and market coverage
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)] sm:text-[15px]">
              Explore key markets where NPT executes truckload, LTL, and cross-border
              freight programs.
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
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.map((location) => {
              const priority = getSeoLocationPriority(location.slug);
              return (
                <TrackedLink
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  ctaId={`locations_hub_open_${location.slug}`}
                  location="locations_hub:cards"
                  label={`${location.city}, ${location.region}`}
                  className="group relative rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-[1px] hover:border-[color:var(--color-text-light)] hover:shadow-[0_14px_30px_rgba(15,23,42,0.10)]"
                >
                  <span
                    className={cn(
                      "absolute top-3 right-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase",
                      priority === "P1"
                        ? "border-[color:var(--color-brand-100)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]"
                        : "border-[color:var(--color-border-light)] bg-white text-[color:var(--color-muted-light)]",
                    )}
                  >
                    {priority}
                  </span>
                  <h2 className="text-[15px] font-semibold text-[color:var(--color-text-light)]">
                    {location.city}, {location.region}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-muted-light)]">{location.country}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
                    {location.intro}
                  </p>
                </TrackedLink>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}

