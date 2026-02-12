// src/app/blog/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import BlogIndexClient from "./BlogIndexClient";

export const metadata = nptMetadata({
  title: "Blog",
  description: "News, updates, and insights from NPT Logistics.",
});

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;

  const qs = new URLSearchParams();

  if (typeof sp.page === "string") qs.set("page", sp.page);
  if (typeof sp.pageSize === "string") qs.set("pageSize", sp.pageSize);
  if (typeof sp.q === "string") qs.set("q", sp.q);
  if (typeof sp.categoryId === "string") qs.set("categoryId", sp.categoryId);
  if (typeof sp.sortBy === "string") qs.set("sortBy", sp.sortBy);
  if (typeof sp.sortDir === "string") qs.set("sortDir", sp.sortDir);

  // Main list (respects filters)
  const postsPromise = ssrApiFetch<{ data: { items: any[]; meta: any } }>(`/api/v1/blog?${qs.toString()}`);

  // Sidebar data
  const catsPromise = ssrApiFetch<{ data: { items: any[] } }>(`/api/v1/blog/categories`);

  const recentQs = new URLSearchParams();
  recentQs.set("page", "1");
  recentQs.set("pageSize", "6");
  recentQs.set("sortBy", "publishedAt");
  recentQs.set("sortDir", "desc");
  const recentPromise = ssrApiFetch<{ data: { items: any[]; meta: any } }>(`/api/v1/blog?${recentQs.toString()}`);

  const [postsRes, catsRes, recentRes] = await Promise.all([postsPromise, catsPromise, recentPromise]);

  return <BlogIndexClient initialItems={postsRes.data.items} initialMeta={postsRes.data.meta} initialCategories={catsRes.data.items} initialRecentPosts={recentRes.data.items} />;
}
