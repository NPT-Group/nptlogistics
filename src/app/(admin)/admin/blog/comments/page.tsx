// src/app/admin/blog/categories/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import AdminCommentsClient from "./AdminCommentsClient";

export const metadata = nptMetadata({
  title: "Admin - Blog comments",
  description: "Moderate blog comments.",
  noIndex: true,
});

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;

  const qs = new URLSearchParams();
  qs.set("page", typeof sp.page === "string" ? sp.page : "1");
  qs.set("pageSize", typeof sp.pageSize === "string" ? sp.pageSize : "50");
  if (typeof sp.postId === "string") qs.set("postId", sp.postId);

  const data = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(`/api/v1/admin/blog/comments?${qs.toString()}`);
  return <AdminCommentsClient initialItems={data.data.items} initialMeta={data.data.meta} />;
}
