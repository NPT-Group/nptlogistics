import type { MetadataRoute } from "next";
import { SERVICES } from "@/config/services";
import { getIndustrySlugs } from "@/config/industryPages";
import { getSeoLocationPriority, getSeoLocationSlugs } from "@/config/seoLocations";
import { getSeoLanePriority, getSeoLaneSlugs } from "@/config/seoLanes";
import { SITE_URL } from "@/lib/seo/site";

const siteUrl = SITE_URL;

function toAbsolute(path: string) {
  return new URL(path, siteUrl).toString();
}

async function getBlogRoutes() {
  try {
    const qs = new URLSearchParams({ page: "1", limit: "200", sortBy: "newest" });
    const res = await fetch(`${siteUrl}/api/v1/blog?${qs.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [] as string[];
    const data = (await res.json()) as { data?: { items?: Array<{ slug?: string }> } };
    return (data.data?.items ?? [])
      .map((x) => x?.slug)
      .filter((x): x is string => Boolean(x))
      .map((slug) => `/blog/${slug}`);
  } catch {
    return [] as string[];
  }
}

async function getCareersRoutes() {
  try {
    const qs = new URLSearchParams({ page: "1", pageSize: "200", sortBy: "publishedAt", sortDir: "desc" });
    const res = await fetch(`${siteUrl}/api/v1/jobs?${qs.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [] as string[];
    const data = (await res.json()) as { data?: { items?: Array<{ slug?: string }> } };
    return (data.data?.items ?? [])
      .map((x) => x?.slug)
      .filter((x): x is string => Boolean(x))
      .map((slug) => `/careers/${slug}`);
  } catch {
    return [] as string[];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/services",
    "/industries",
    "/locations",
    "/lanes",
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
  const locationRoutes = getSeoLocationSlugs().map((slug) => `/locations/${slug}`);
  const laneRoutes = getSeoLaneSlugs().map((slug) => `/lanes/${slug}`);
  const [blogRoutes, careersRoutes] = await Promise.all([getBlogRoutes(), getCareersRoutes()]);

  const getPriority = (path: string) => {
    if (path === "/") return 1;
    if (path.startsWith("/services/")) return 0.9;
    if (path.startsWith("/locations/")) {
      const slug = path.replace("/locations/", "");
      const rank = getSeoLocationPriority(slug);
      return rank === "P1" ? 0.9 : rank === "P2" ? 0.8 : 0.7;
    }
    if (path.startsWith("/lanes/")) {
      const slug = path.replace("/lanes/", "");
      const rank = getSeoLanePriority(slug);
      return rank === "P1" ? 0.9 : rank === "P2" ? 0.8 : 0.7;
    }
    if (path.startsWith("/industries/")) return 0.82;
    return 0.7;
  };

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...locationRoutes,
    ...laneRoutes,
    ...blogRoutes,
    ...careersRoutes,
  ].map((path) => ({
    url: toAbsolute(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : path.startsWith("/blog/") ? "weekly" : "monthly",
    priority: getPriority(path),
  }));
}
