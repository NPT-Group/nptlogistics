// src/app/(site)/services/[service]/_components/ServiceJsonLd.tsx
import type { ServicePageModel } from "@/config/services";

export function ServiceJsonLd({ model }: { model: ServicePageModel }) {
  const sectionOffers =
    model.sections?.map((s) => ({
      "@type": "Offer",
      name: s.label,
      description: s.description,
    })) ?? [];

  const singleOffers =
    model.singleLayout?.capabilities.items.slice(0, 4).map((item) => ({
      "@type": "Offer",
      name: item,
      description: model.singleLayout?.capabilities.intro,
    })) ?? [];

  const itemListElement = sectionOffers.length > 0 ? sectionOffers : singleOffers;

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
      itemListElement,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
