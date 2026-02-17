import { Hero } from "@/components/home/Hero";
import { AudienceSection } from "@/components/home/AudienceSection";
import { SolutionsOverview } from "@/components/home/SolutionsOverview";
import { WhyNptSection } from "@/components/home/WhyNptSection";
import { TrackingVisibilitySection } from "./TrackingVisibilitySection";
import { TrustProofSection } from "./TrustProofSection";
import { IndustriesCarouselSection } from "./IndustriesCarouselSection";
import { CareersCultureSection } from "./CareersCultureSection";
import { FinalCtaSection } from "./FinalCtaSection";

export function HomePageContent() {
  return (
    <>
      <Hero />
      <AudienceSection />
      <SolutionsOverview />
      <WhyNptSection />
      <IndustriesCarouselSection />
      <TrackingVisibilitySection />
      <TrustProofSection />
      <CareersCultureSection />
      <FinalCtaSection />
    </>
  );
}
