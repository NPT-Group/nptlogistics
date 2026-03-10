import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../components/layout/Container";
import { SERVICES } from "@/config/services";

export const metadata: Metadata = {
  title: "Freight Services",
  description:
    "Explore NPT Logistics freight services across North America, including truckload, LTL, intermodal, cross-border, hazmat, and temperature-controlled shipping.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesHubPage() {
  const items = Object.values(SERVICES);

  return (
    <main className="bg-[color:var(--color-surface-0)] py-12 sm:py-14">
      <Container className="site-page-container max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-3xl">
          North America Freight Services
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
          Compare service options and select the best mode for your lane, transit requirements, and
          freight profile.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((service) => (
            <Link
              key={service.key}
              href={`/services/${service.slug}`}
              className="group rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 transition hover:-translate-y-[1px] hover:border-[color:var(--color-text-light)]"
            >
              <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
                {service.hero.kicker}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
                {service.meta.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}

