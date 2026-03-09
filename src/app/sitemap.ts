import type { MetadataRoute } from "next";
import { SERVICES } from "@/config/services";
import { getIndustrySlugs } from "@/config/industryPages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nptlogistics.com";

function toAbsolute(path: string) {
  return new URL(path, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about-us",
    "/about-us/faqs",
    "/careers",
    "/blog",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
    "/cookies",
    "/cookie-preferences",
    "/accessibility",
  ];

  const serviceRoutes = Object.values(SERVICES).map((service) => `/services/${service.slug}`);
  const industryRoutes = getIndustrySlugs().map((slug) => `/industries/${slug}`);

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes].map((path) => ({
    url: toAbsolute(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
