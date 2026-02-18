// src/app/(site)/services/[service]/_components/ServicePage.tsx
import type { ServicePageModel } from "@/config/services";
import { ServiceHero } from "./ServiceHero";
import { ServiceSubnav } from "./ServiceSubnav";
import { ServiceSection } from "./ServiceSection";
import { ServiceFinalCta } from "./ServiceFinalCta";
import { ServiceJsonLd } from "./ServiceJsonLd";
import { ServicePageShell } from "./ServicePageShell";

export function ServicePage({ model }: { model: ServicePageModel }) {
  return (
    <ServicePageShell>
      <ServiceJsonLd model={model} />
      <ServiceHero model={model} />
      <ServiceSubnav model={model} />

      {model.sections.map((section, index) => (
        <ServiceSection key={section.key} section={section} serviceKey={model.key} index={index} />
      ))}

      <ServiceFinalCta model={model} />
    </ServicePageShell>
  );
}
