// src/lib/utils/jobs/adminJobsApi.ts
import type { IJobPosting } from "@/types/jobPosting.types";
import type { IJobApplication, EJobApplicationStatus } from "@/types/jobApplication.types";
import type { EJobPostingStatus } from "@/types/jobPosting.types";

function pickMessage(json: any, fallback: string) {
  return json?.message || json?.error?.message || fallback;
}

async function readJsonSafe(res: Response) {
  return res.json().catch(() => ({}));
}

/* ───────────────────────── Jobs (Postings) ───────────────────────── */

export async function adminFetchJobs(opts?: {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: EJobPostingStatus | string;
  sortBy?: "updatedAt" | "createdAt" | "publishedAt";
  sortDir?: "asc" | "desc";
}): Promise<{ items: any[]; meta: any }> {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page ?? 1));
  qs.set("pageSize", String(opts?.pageSize ?? 20));
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.status) qs.set("status", String(opts.status));
  if (opts?.sortBy) qs.set("sortBy", opts.sortBy);
  if (opts?.sortDir) qs.set("sortDir", opts.sortDir);

  const res = await fetch(`/api/v1/admin/jobs?${qs.toString()}`, { method: "GET" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch jobs"));
  return json?.data ?? { items: [], meta: {} };
}

export async function adminGetJobById(id: string): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}`, { method: "GET" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

export async function adminCreateJob(payload: Partial<IJobPosting>): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to create job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

export async function adminUpdateJob(
  id: string,
  payload: Partial<IJobPosting>,
): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to update job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

export async function adminDeleteJob(id: string): Promise<void> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to delete job"));
}

export async function adminPublishJob(
  id: string,
  publishedAt?: string | Date | null,
): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publishedAt: publishedAt ?? null }),
  });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to publish job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

export async function adminCloseJob(id: string): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}/close`, { method: "POST" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to close job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

export async function adminArchiveJob(id: string): Promise<IJobPosting> {
  const res = await fetch(`/api/v1/admin/jobs/${encodeURIComponent(id)}/archive`, {
    method: "POST",
  });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to archive job"));
  return (json?.data?.jobPosting ?? json?.data?.job ?? json?.data) as IJobPosting;
}

/* ───────────────────────── Applications ───────────────────────── */

export async function adminFetchJobApplications(opts?: {
  page?: number;
  pageSize?: number;
  q?: string; // name/email contains
  status?: string;
  jobPostingId?: string;
  sortBy?: "createdAt";
  sortDir?: "asc" | "desc";
}): Promise<{ items: any[]; meta: any }> {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page ?? 1));
  qs.set("pageSize", String(opts?.pageSize ?? 25));
  qs.set("sortBy", opts?.sortBy ?? "createdAt");
  qs.set("sortDir", opts?.sortDir ?? "desc");
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.status) qs.set("status", String(opts.status));
  if (opts?.jobPostingId) qs.set("jobPostingId", opts.jobPostingId);

  const res = await fetch(`/api/v1/admin/job-applications?${qs.toString()}`, { method: "GET" });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch applications"));
  return json?.data ?? { items: [], meta: {} };
}

export async function adminFetchApplicationsForJob(
  jobId: string,
  opts?: { page?: number; pageSize?: number; q?: string; status?: string },
) {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page ?? 1));
  qs.set("pageSize", String(opts?.pageSize ?? 25));
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.status) qs.set("status", String(opts.status));

  const res = await fetch(
    `/api/v1/admin/jobs/${encodeURIComponent(jobId)}/applications?${qs.toString()}`,
    { method: "GET" },
  );
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to fetch job applications"));
  return json?.data ?? { items: [], meta: {} };
}

/**
 * Optional: if your /api/v1/admin/job-applications supports PATCH to update status
 * (RECEIVED/VIEWED/ARCHIVED). If not, you can remove usage in UI or adapt to your route.
 */
export async function adminSetApplicationStatus(
  id: string,
  status: EJobApplicationStatus,
): Promise<IJobApplication> {
  const res = await fetch(`/api/v1/admin/job-applications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  const json = await readJsonSafe(res);
  if (!res.ok) throw new Error(pickMessage(json, "Failed to update application"));
  return (json?.data?.jobApplication ?? json?.data?.application ?? json?.data) as IJobApplication;
}
