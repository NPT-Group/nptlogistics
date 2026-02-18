// src/app/(site)/services/[service]/_components/ServiceJsonLd.tsx
import type { ServicePageModel } from "@/config/services";

export function ServiceJsonLd({ model }: { model: ServicePageModel }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: model.hero.kicker,
    description: model.meta.description,
    areaServed: ["Canada", "United States", "Mexico"],
    provider: {
      "@type": "Organization",
      name: "NPT Logistics",
    },
    serviceType: model.key,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${model.hero.kicker} options`,
      itemListElement: model.sections.map((s) => ({
        "@type": "Offer",
        name: s.label,
        description: s.description,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
