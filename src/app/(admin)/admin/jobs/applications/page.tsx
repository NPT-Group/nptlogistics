// src/app/(admin)/admin/jobs/applications/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import AdminJobApplicationsClient from "./AdminJobApplicationsClient";

export const metadata = nptMetadata({
  title: "Admin - Job applications",
  description: "Review job applications.",
  noIndex: true,
});

export default async function AdminJobApplicationsPage({
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
    `/api/v1/admin/job-applications?${qs.toString()}`,
  );

  return <AdminJobApplicationsClient initialItems={data.data.items} initialMeta={data.data.meta} />;
}
