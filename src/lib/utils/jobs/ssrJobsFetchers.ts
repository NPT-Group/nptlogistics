import type { IJobPosting, EEmploymentType, EWorkplaceType } from "@/types/jobPosting.types";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";

export async function getPublicJobsListSSR(opts?: {
  page?: string;
  pageSize?: string;
  q?: string;
  workplaceType?: EWorkplaceType | string;
  employmentType?: EEmploymentType | string;
  department?: string;
  location?: string;
  sortBy?: "publishedAt" | "title" | "createdAt";
  sortDir?: "asc" | "desc";
}) {
  const qs = new URLSearchParams();

  if (opts?.page) qs.set("page", opts.page);
  if (opts?.pageSize) qs.set("pageSize", opts.pageSize);
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.workplaceType) qs.set("workplaceType", String(opts.workplaceType));
  if (opts?.employmentType) qs.set("employmentType", String(opts.employmentType));
  if (opts?.department) qs.set("department", opts.department);
  if (opts?.location) qs.set("location", opts.location);
  if (opts?.sortBy) qs.set("sortBy", opts.sortBy);
  if (opts?.sortDir) qs.set("sortDir", opts.sortDir);

  const res = await ssrApiFetch<{ data: { items: Partial<IJobPosting>[]; meta: any } }>(
    `/api/v1/jobs?${qs.toString()}`,
  );
  return res?.data ?? { items: [], meta: {} };
}

export async function getPublicJobBySlugSSR(slug: string) {
  const res = await ssrApiFetch<{ data: { jobPosting: IJobPosting } }>(
    `/api/v1/jobs/${encodeURIComponent(slug)}`,
  );
  return res?.data?.jobPosting;
}
