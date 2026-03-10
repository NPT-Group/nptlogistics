// src/app/(site)/services/[service]/_components/ServiceJsonLd.tsx
import type { ServicePageModel } from "@/config/services";
import { SITE_NAME, SITE_URL, toAbsoluteUrl } from "@/lib/seo/site";

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

  const serviceUrl = toAbsoluteUrl(`/services/${model.slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${serviceUrl}#service`,
      name: model.hero.kicker,
      description: model.meta.description,
      url: serviceUrl,
      areaServed: ["Canada", "United States", "Mexico"],
      provider: {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      serviceType: model.key,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${model.hero.kicker} options`,
        itemListElement,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: toAbsoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Services", item: toAbsoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: model.hero.kicker, item: serviceUrl },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
