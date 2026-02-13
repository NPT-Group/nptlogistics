import { Hero } from "@/components/home/Hero";
import { AudienceSection } from "@/components/home/AudienceSection";
import { SolutionsOverview } from "@/components/home/SolutionsOverview";
import { WhyNPTOrbitClient } from "@/components/home/WhyNptOrbitClient";
import { TrackingVisibilitySection } from "./TrackingVisibilitySection";
import { TrustProofSection } from "./TrustProofSection";
import { IndustriesCarouselSection } from "./IndustriesCarouselSection";

export function HomePageContent() {
  return (
    <>
      <Hero />
      <AudienceSection />
      <SolutionsOverview />
      <WhyNPTOrbitClient />
      <IndustriesCarouselSection />
      <TrackingVisibilitySection />
      <TrustProofSection />
    </>
  );
}
