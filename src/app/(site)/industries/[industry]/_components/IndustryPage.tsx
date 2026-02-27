"use client";

import type { IndustryPageModel } from "@/config/industryPages";
import { IndustryJsonLd } from "./IndustryJsonLd";
import { IndustryHero } from "./IndustryHero";
import { IndustryWhatMatters } from "./IndustryWhatMatters";
import { IndustryHowWeSupport } from "./IndustryHowWeSupport";
import { IndustryTrustProof } from "./IndustryTrustProof";
import { IndustryRelatedServices } from "./IndustryRelatedServices";
import { IndustryFinalCta } from "./IndustryFinalCta";

export function IndustryPage({ model }: { model: IndustryPageModel }) {
  return (
    <>
      <IndustryJsonLd model={model} />
      <IndustryHero model={model} />
      <IndustryWhatMatters model={model} />
      <IndustryHowWeSupport model={model} />
      <IndustryTrustProof model={model} />
      <IndustryRelatedServices model={model} />
      <IndustryFinalCta model={model} />
    </>
  );
}
