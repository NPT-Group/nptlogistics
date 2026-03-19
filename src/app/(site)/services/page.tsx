import type { Metadata } from "next";
import { SolutionsOverview } from "@/app/(site)/components/home/SolutionsOverview";

export const metadata: Metadata = {
  title: "Freight Services",
  description:
    "Explore NPT Logistics freight services across North America, including truckload, LTL, cross-border, hazmat, and temperature-controlled shipping.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesHubPage() {
  return (
    <main className="bg-[color:var(--color-surface-0)]">
      <SolutionsOverview />
    </main>
  );
}

