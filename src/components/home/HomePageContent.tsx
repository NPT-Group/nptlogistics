import { Hero } from "@/components/home/Hero";
import { AudienceSection } from "@/components/home/AudienceSection";
import { SolutionsOverview } from "@/components/home/SolutionsOverview";
import { WhyNPTOrbitClient } from "@/components/home/WhyNptOrbitClient";

export function HomePageContent() {
  return (
    <>
      <Hero />
      <AudienceSection />
      <SolutionsOverview />
      <WhyNPTOrbitClient />
    </>
  );
}
