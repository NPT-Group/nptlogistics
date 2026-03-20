import type { Metadata } from "next";
import { IndustriesCarouselSection } from "@/app/(site)/components/home/IndustriesCarouselSection";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Discover industry logistics programs by NPT Logistics for automotive, manufacturing, retail, food and beverage, industrial energy, and steel/aluminum freight.",
  alternates: {
    canonical: "/industries",
  },
};

export default function IndustriesHubPage() {
  return (
    <div className="bg-[color:var(--color-surface-0)]">
      <IndustriesCarouselSection />
    </div>
  );
}
