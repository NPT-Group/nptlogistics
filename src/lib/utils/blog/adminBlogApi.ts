import type { IBlogCategory, IBlogPost, EBlogStatus } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";

export async function adminFetchCategories(q?: string): Promise<IBlogCategory[]> {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);

  const res = await fetch(`/api/v1/admin/blog/categories?${sp.toString()}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return (json?.data?.items ?? []) as IBlogCategory[];
}

export async function adminCreateCategory(name: string): Promise<IBlogCategory> {
  const res = await fetch(`/api/v1/admin/blog/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to create category");
  return json?.data?.category as IBlogCategory;
}

export type AdminCreatePostPayload = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  body: BlockNoteDocJSON;
  bannerImage?: IFileAsset;
  categoryIds?: string[];
  status?: EBlogStatus;
  publishedAt?: string | Date | null;
};

export async function adminCreatePost(payload: AdminCreatePostPayload): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, content: undefined }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to create blog post");
  return json?.data?.blogPost as IBlogPost;
}

export async function adminFetchPostById(id: string): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}`, { method: "GET" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to fetch blog post");
  return json?.data?.blogPost as IBlogPost;
}

export type AdminUpdatePostPayload = Partial<AdminCreatePostPayload>;

export async function adminUpdatePost(
  id: string,
  payload: AdminUpdatePostPayload,
): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, content: undefined }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to update blog post");
  return json?.data?.blogPost as IBlogPost;
}

/* -------------------------------------------------------------------------- */
/* Status action endpoints                                                    */
/* -------------------------------------------------------------------------- */

export async function adminPublishPost(
  id: string,
  publishedAt?: string | Date | null,
): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publishedAt: publishedAt ?? null }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to publish blog post");

  // Endpoint returns { id, status, publishedAt }. We want a full post in UI,
  // so we re-fetch to keep everything consistent.
  return adminFetchPostById(id);
}

export async function adminUnpublishPost(id: string): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}/unpublish`, {
    method: "POST",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to unpublish blog post");
  return adminFetchPostById(id);
}

export async function adminArchivePost(id: string): Promise<IBlogPost> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}/archive`, {
    method: "POST",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to archive blog post");
  return adminFetchPostById(id);
}

export async function adminDeletePost(id: string): Promise<void> {
  const res = await fetch(`/api/v1/admin/blog/${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to delete post");
}

export async function adminBulkDeletePosts(ids: string[]): Promise<void> {
  const res = await fetch(`/api/v1/admin/blog/bulk-delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to bulk delete posts");
}

export async function adminUpdateCategory(
  id: string,
  payload: { name?: string; slug?: string; description?: string | null },
): Promise<any> {
  const res = await fetch(`/api/v1/admin/blog/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to update category");
  return json?.data?.category;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/v1/admin/blog/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to delete category");
}

export async function adminDeleteComment(id: string): Promise<void> {
  const res = await fetch(`/api/v1/admin/blog/comments/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Failed to delete comment");
}
