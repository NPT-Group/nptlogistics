import { FAQ_CATEGORIES } from "@/config/faqs";
import { SITE_NAME, SITE_URL, toAbsoluteUrl } from "@/lib/seo/site";

const BASE = SITE_URL;

function buildFaqPageSchema() {
  const mainEntity = FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer,
      },
    })),
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    name: "FAQs & Shipping Guides | NPT Logistics",
    url: `${BASE}/about-us/faqs`,
    isPartOf: {
      "@type": "WebSite" as const,
      "@id": `${BASE}#website`,
      name: SITE_NAME,
      url: BASE,
    },
    mainEntity,
    description:
      "Frequently asked questions about NPT Logistics freight services, safety, compliance, tracking, and operations. Plus shipping guides for shippers.",
  };
}

function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: [
      { "@type": "ListItem" as const, position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem" as const, position: 2, name: "About Us", item: toAbsoluteUrl("/about-us") },
      { "@type": "ListItem" as const, position: 3, name: "FAQs & Shipping Guides", item: toAbsoluteUrl("/about-us/faqs") },
    ],
  };
}

export function FaqJsonLd() {
  const faqSchema = buildFaqPageSchema();
  const breadcrumbSchema = buildBreadcrumbSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
