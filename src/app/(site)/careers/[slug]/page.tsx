import { nptMetadata } from "@/lib/utils/blog/metadata";
import { getPublicJobBySlugSSR } from "@/lib/utils/jobs/ssrJobsFetchers";
import JobPublicClient from "./JobPublicClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const job = await getPublicJobBySlugSSR(slug);
    return nptMetadata({
      title: job?.title ?? "Job",
      description: job?.summary ?? "View this role and apply online.",
      canonicalPath: `/careers/${slug}`,
    });
  } catch {
    return nptMetadata({ title: "Job", canonicalPath: `/careers/${slug}` });
  }
}

export default async function JobPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getPublicJobBySlugSSR(slug);

  // If ssrApiFetch throws, your existing error handler should catch it.
  // If it returns null-ish, render a simple fallback.
  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
            Job not found.
          </div>
        </div>
      </div>
    );
  }

  return <JobPublicClient job={job as any} />;
}
