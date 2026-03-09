// src/app/(site)/services/[service]/_components/ServicePage.tsx
import type { ServicePageModel } from "@/config/services";
import { ServiceHero } from "./ServiceHero";
import { ServiceSubnav } from "./ServiceSubnav";
import { ServiceSection } from "./ServiceSection";
import { ServiceFinalCta } from "./ServiceFinalCta";
import { ServiceJsonLd } from "./ServiceJsonLd";
import { ServicePageShell } from "./ServicePageShell";
import { ServiceSingleLayout } from "./ServiceSingleLayout";

export function ServicePage({ model }: { model: ServicePageModel }) {
  const hasSections = Boolean(model.sections && model.sections.length > 0);
  const orderedSections = hasSections
    ? model.key === "expedited-specialized"
      ? [...model.sections!].sort((a, b) => {
          if (a.key === "specialized-vehicle-programs") return -1;
          if (b.key === "specialized-vehicle-programs") return 1;
          return 0;
        })
      : model.sections!
    : undefined;

  return (
    <ServicePageShell>
      <ServiceJsonLd model={model} />
      <ServiceHero model={model} />
      {hasSections ? <ServiceSubnav model={model} sections={orderedSections} /> : null}

      {hasSections
        ? orderedSections!.map((section, index) => (
            <ServiceSection key={section.key} section={section} serviceKey={model.key} index={index} />
          ))
        : <ServiceSingleLayout model={model} />}

      <ServiceFinalCta model={model} />
    </ServicePageShell>
  );
}
