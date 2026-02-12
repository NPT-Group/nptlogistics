// src/app/admin/blog/categories/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import AdminCategoriesClient from "./AdminCategoriesClient";

export const metadata = nptMetadata({
  title: "Admin - Blog categories",
  description: "Manage blog categories.",
  noIndex: true,
});

export default async function AdminCategoriesPage() {
  const data = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(`/api/v1/admin/blog/categories?page=1&pageSize=200&sortBy=name&sortDir=asc`);
  return <AdminCategoriesClient initialItems={data.data.items} />;
}
