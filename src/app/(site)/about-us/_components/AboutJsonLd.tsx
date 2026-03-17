import { COMPANY_CONTACT, SITE_NAME, SITE_URL, toAbsoluteUrl } from "@/lib/seo/site";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteUrl("/_optimized/brand/NPTlogo2.webp"),
    email: COMPANY_CONTACT.email,
    telephone: COMPANY_CONTACT.phoneE164,
    areaServed: ["Canada", "United States", "Mexico"],
    description:
      "NPT Logistics provides disciplined freight execution across Canada, the United States, and Mexico with a compliance-first operating model.",
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About NPT Logistics",
    url: toAbsoluteUrl("/about-us"),
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    description:
      "About NPT Logistics, our operating model, compliance standards, network coverage, and service philosophy.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: toAbsoluteUrl("/about-us"),
      },
    ],
  },
];

export function AboutJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
