// src/lib/utils/blog/publicBlogApi.ts

export async function publicFetchComments(
  slug: string,
  opts?: {
    page?: number;
    pageSize?: number;
    sortBy?: "createdAt";
    sortDir?: "asc" | "desc";
  },
): Promise<{ items: any[]; meta: any }> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;
  const sortBy = opts?.sortBy ?? "createdAt";
  const sortDir = opts?.sortDir ?? "desc";

  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortDir,
  });

  const res = await fetch(`/api/v1/blog/${encodeURIComponent(slug)}/comments?${qs.toString()}`, {
    method: "GET",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to fetch comments");
  return json?.data ?? { items: [], meta: {} };
}

export async function publicCreateComment(slug: string, body: { name: string; email?: string | null; comment: string }): Promise<any> {
  const res = await fetch(`/api/v1/blog/${encodeURIComponent(slug)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to create comment");
  return json?.data?.comment;
}

/**
 * Increment viewCount for a published post.
 * Dedupe should be handled by the caller (session/local storage).
 */
export async function publicCountView(slug: string): Promise<{ slug: string; viewCount: number } | null> {
  const res = await fetch(`/api/v1/blog/${encodeURIComponent(slug)}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Helps when user navigates away quickly
    keepalive: true as any,
  });

  // Avoid throwing here — view count is non-critical
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return null;

  return json?.data ?? null;
}
