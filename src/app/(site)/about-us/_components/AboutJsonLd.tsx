const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NPT Logistics",
    url: "https://nptlogistics.com",
    logo: "https://nptlogistics.com/brand/NPTlogo2.png",
    areaServed: ["Canada", "United States"],
    description:
      "NPT Logistics provides disciplined freight execution across Canada and the United States with a compliance-first operating model.",
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About NPT Logistics",
    url: "https://nptlogistics.com/about-us",
    isPartOf: {
      "@type": "WebSite",
      name: "NPT Logistics",
      url: "https://nptlogistics.com",
    },
    about: {
      "@type": "Organization",
      name: "NPT Logistics",
      url: "https://nptlogistics.com",
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
        item: "https://nptlogistics.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://nptlogistics.com/about-us",
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
