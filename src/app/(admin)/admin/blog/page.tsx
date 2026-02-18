// src/app/(admin)/admin/blog/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import AdminBlogListClient from "./AdminBlogListClient";

export const metadata = nptMetadata({
  title: "Admin - Blog",
  description: "Manage blog posts.",
  noIndex: true,
});

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    else qs.set(k, v);
  }

  const data = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(
    `/api/v1/admin/blog?${qs.toString()}`,
  );
  return <AdminBlogListClient initialItems={data.data.items} initialMeta={data.data.meta} />;
}
