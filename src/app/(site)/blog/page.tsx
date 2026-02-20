// src/app/blog/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import BlogIndexClient from "./BlogIndexClient";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";

type SearchParams = Record<string, string | string[] | undefined>;

function spGet(sp: SearchParams, key: string) {
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

function toNum(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const metadata = nptMetadata({
  title: "Blog",
  description: "Insights, updates, and logistics knowledge from NPT.",
});

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  const q = (spGet(sp, "q") ?? "").toString();
  const categoryId = (spGet(sp, "categoryId") ?? "").toString();
  const categorySlug = (spGet(sp, "categorySlug") ?? "").toString();
  const sortBy = (spGet(sp, "sortBy") ?? "newest").toString();
  const page = toNum((spGet(sp, "page") ?? "1").toString(), 1);
  const limit = toNum((spGet(sp, "limit") ?? "9").toString(), 9);

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (categoryId) qs.set("categoryId", categoryId);
  if (categorySlug) qs.set("categorySlug", categorySlug);
  if (sortBy) qs.set("sortBy", sortBy);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  const postsResp = await ssrApiFetch<{
    data: {
      items: any[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    };
  }>(`/api/v1/blog?${qs.toString()}`);

  const cqs = new URLSearchParams();
  if (q) cqs.set("q", q);
  if (categorySlug) cqs.set("categorySlug", categorySlug);

  const catsResp = await ssrApiFetch<{
    data: Array<{ id: string; name: string; slug: string; postCount?: number }>;
  }>(`/api/v1/blog/categories?${cqs.toString()}`);

  const recentResp = await ssrApiFetch<{
    data: {
      items: any[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    };
  }>(`/api/v1/blog?${new URLSearchParams({ page: "1", limit: "5", sortBy: "newest" }).toString()}`);

  const initialQuery = { q, categoryId, categorySlug, sortBy, page, limit };

  return (
    <BlogIndexClient
      initialItems={postsResp.data.items}
      initialMeta={postsResp.data.meta}
      categories={catsResp.data}
      recentItems={recentResp.data.items}
      initialQuery={initialQuery}
    />
  );
}
