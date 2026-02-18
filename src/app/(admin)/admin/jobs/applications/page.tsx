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

  try {
    const data = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(
      `/api/v1/admin/job-applications?${qs.toString()}`,
    );

    return (
      <AdminJobApplicationsClient initialItems={data.data.items} initialMeta={data.data.meta} />
    );
  } catch (e: any) {
    // Render a simple fallback instead of throwing to Next runtime overlay
    const message = e?.payload?.message || e?.message || "Failed to load job applications.";

    return (
      <div className="min-h-[60vh] w-full px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-white">Couldn’t load job applications</h1>
          <p className="mt-2 text-sm text-white/70">{message}</p>
        </div>
      </div>
    );
  }
}
