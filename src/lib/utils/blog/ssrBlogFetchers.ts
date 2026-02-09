// src/lib/utils/blog/ssrBlogFetchers.ts
import { cache } from "react";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";

export const getAdminBlogPostById = cache(async (id: string) => {
  const res = await ssrApiFetch<{ data: { blogPost: any } }>(`/api/v1/admin/blog/${encodeURIComponent(id)}`);
  return res.data.blogPost;
});

export const getPublicBlogPostBySlug = cache(async (slug: string) => {
  const res = await ssrApiFetch<{ data: { blogPost: any } }>(`/api/v1/blog/${encodeURIComponent(slug)}`);
  return res.data.blogPost;
});
