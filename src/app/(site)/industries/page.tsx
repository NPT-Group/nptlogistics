import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../components/layout/Container";
import { getIndustryBySlug, getIndustrySlugs } from "@/config/industryPages";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Discover industry logistics programs by NPT Logistics for automotive, manufacturing, retail, food and beverage, industrial energy, and steel/aluminum freight.",
  alternates: {
    canonical: "/industries",
  },
};

export default function IndustriesHubPage() {
  const items = getIndustrySlugs()
    .map((slug) => getIndustryBySlug(slug))
    .filter(Boolean);

  return (
    <div className="bg-[color:var(--color-surface-0)] py-12 sm:py-14">
      <Container className="site-page-container max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-light)] sm:text-3xl">
          Industry Logistics Solutions
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
          Explore execution models built for the freight risk profile, compliance standards, and
          timing realities of each industry.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((industry) => (
            <Link
              key={industry!.slug}
              href={`/industries/${industry!.slug}`}
              className="group rounded-2xl border border-[color:var(--color-border-light)] bg-white p-5 transition hover:-translate-y-[1px] hover:border-[color:var(--color-text-light)]"
            >
              <h2 className="text-base font-semibold text-[color:var(--color-text-light)]">
                {industry!.hero.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted-light)]">
                {industry!.meta.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
