"use client";

import { FaqHero } from "./FaqHero";
import { FaqMain } from "./FaqMain";
import { FaqSubnav } from "./FaqSubnav";
import { ShippingGuidesSection } from "./ShippingGuidesSection";

export function FaqPageContent() {
  return (
    <>
      <FaqHero />
      <FaqSubnav />
      <FaqMain />
      <ShippingGuidesSection />
    </>
  );
}
