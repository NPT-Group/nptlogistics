export async function publicFetchComments(slug: string): Promise<{ items: any[]; meta: any }> {
  const res = await fetch(`/api/v1/blog/${encodeURIComponent(slug)}/comments?page=1&pageSize=200&sortBy=createdAt&sortDir=desc`, {
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
