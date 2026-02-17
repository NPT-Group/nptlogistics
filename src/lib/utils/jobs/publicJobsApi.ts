// src/lib/utils/jobs/publicJobsApi.ts
import type { IJobPosting, EEmploymentType, EWorkplaceType } from "@/types/jobPosting.types";

function pickMessage(json: any, fallback: string) {
  return json?.message || json?.error?.message || fallback;
}

async function readJsonSafe(res: Response) {
  return res.json().catch(() => ({}));
}

export type PublicJobsListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  sortBy?: string;
  sortDir?: string;
  filters?: Record<string, any>;
};

export async function publicFetchJobs(opts?: {
  page?: number;
  pageSize?: number;
  q?: string;
  workplaceType?: EWorkplaceType | string;
  employmentType?: EEmploymentType | string;
  department?: string;
  location?: string;
  sortBy?: "publishedAt" | "title" | "createdAt";
  sortDir?: "asc" | "desc";
}): Promise<{ items: Partial<IJobPosting>[]; meta: PublicJobsListMeta }> {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page ?? 1));
  qs.set("pageSize", String(opts?.pageSize ?? 12));

  if (opts?.q) qs.set("q", opts.q);
  if (opts?.workplaceType) qs.set("workplaceType", String(opts.workplaceType));
  if (opts?.employmentType) qs.set("employmentType", String(opts.employmentType));
  if (opts?.department) qs.set("department", opts.department);
  if (opts?.location) qs.set("location", opts.location);
  if (opts?.sortBy) qs.set("sortBy", opts.sortBy);
  if (opts?.sortDir) qs.set("sortDir", opts.sortDir);

  const res = await fetch(`/api/v1/jobs?${qs.toString()}`, { method: "GET" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch jobs"));
  return json?.data ?? { items: [], meta: {} };
}

export async function publicFetchJobBySlug(slug: string): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/jobs/${encodeURIComponent(slug)}`, { method: "GET" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

/**
 * Increment viewCount for a published job.
 * Dedupe should be handled by the caller (session/local storage).
 */
export async function publicCountJobView(
  slug: string,
): Promise<{ slug: string; viewCount: number } | null> {
  const res = await fetch(`/api/v1/jobs/${encodeURIComponent(slug)}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Helps when user navigates away quickly
    keepalive: true as any,
  });

  // Avoid throwing here - view count is non-critical
  const json = await readJsonSafe(res);
  if (!res.ok) return null;

  return json?.data ?? null;
}
