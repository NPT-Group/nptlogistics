// src/app/(admin)/admin/jobs/[id]/applications/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import AdminJobApplicationsForJobClient from "./AdminJobApplicationsForJobClient";

export const metadata = nptMetadata({
  title: "Admin - Job applications",
  description: "Review applications for a job posting.",
  noIndex: true,
});

export default async function AdminJobApplicationsForJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    else qs.set(k, v);
  }

  const data = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(
    `/api/v1/admin/jobs/${encodeURIComponent(id)}/applications?${qs.toString()}`,
  );

  // job title for header
  const jobRes = await ssrApiFetch<{ data: { jobPosting: any } }>(
    `/api/v1/admin/jobs/${encodeURIComponent(id)}`,
  );

  return (
    <AdminJobApplicationsForJobClient
      jobId={id}
      jobTitle={jobRes.data.jobPosting?.title ?? "Job"}
      initialItems={data.data.items}
      initialMeta={data.data.meta}
    />
  );
}
