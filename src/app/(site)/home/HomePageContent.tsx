import { Hero } from "@/app/(site)/components/home/Hero";
import { AudienceSection } from "@/app/(site)/components/home/AudienceSection";
import { SolutionsOverview } from "@/app/(site)/components/home/SolutionsOverview";
import { WhyNptSection } from "@/app/(site)/components/home/WhyNptSection";
import { TrackingVisibilitySection } from "@/app/(site)/components/home/TrackingVisibilitySection";
import { TrustProofSection } from "@/app/(site)/components/home/TrustProofSection";
import { IndustriesCarouselSection } from "@/app/(site)/components/home/IndustriesCarouselSection";
import { CareersCultureSection } from "@/app/(site)/components/home/CareersCultureSection";
import { FinalCtaSection } from "@/app/(site)/components/home/FinalCtaSection";

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
