import type { IndustryPageModel } from "@/config/industryPages";

const BASE = "https://nptlogistics.com";

export function IndustryJsonLd({ model }: { model: IndustryPageModel }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${BASE}/#industries` },
      { "@type": "ListItem", position: 3, name: model.hero.title, item: `${BASE}/industries/${model.slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
    />
  );
}
