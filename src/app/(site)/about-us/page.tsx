import type { Metadata } from "next";
import { companyAbout } from "@/config/company";

import { AboutHero } from "./_components/AboutHero";
import { WhoWeAre } from "./_components/WhoWeAre";
import { MissionVisionPrinciples } from "./_components/MissionVisionPrinciples";
import { OperatingModel } from "./_components/OperatingModel";
import { SafetyCompliance } from "./_components/SafetyCompliance";
import { LocationsNetwork } from "./_components/LocationsNetwork";
import { AboutFinalCta } from "./_components/AboutFinalCta";
import { AboutJsonLd } from "./_components/AboutJsonLd";

export const metadata: Metadata = {
  title: "About NPT Logistics",
  description:
    "NPT Logistics is a transportation partner focused on disciplined execution, compliance, and lane-level control across Canada and the U.S.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About NPT Logistics",
    description:
      "Learn how NPT Logistics delivers disciplined freight execution across Canada and the U.S. through compliance-first operations and accountable communication.",
    type: "website",
    url: "/about-us",
    images: ["/_optimized/brand/nptLogo-glow.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About NPT Logistics",
    description:
      "Learn how NPT Logistics delivers disciplined freight execution across Canada and the U.S. through compliance-first operations and accountable communication.",
    images: ["/_optimized/brand/nptLogo-glow.webp"],
  },
};

export default function AboutUsPage() {
  return (
    <>
      <AboutJsonLd />
      <AboutHero data={companyAbout.hero} />
      <WhoWeAre data={companyAbout.whoWeAre} />
      <MissionVisionPrinciples data={companyAbout.missionVision} />
      <OperatingModel data={companyAbout.operatingModel} />
      <SafetyCompliance data={companyAbout.safetyCompliance} />
      <LocationsNetwork data={companyAbout.locationsNetwork} />
      <AboutFinalCta data={companyAbout.finalCta} />
    </>
  );
}
