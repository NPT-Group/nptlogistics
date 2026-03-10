// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { getPublicBlogPostBySlug } from "@/lib/utils/blog/ssrBlogFetchers";
import { ssrApiFetch } from "@/lib/utils/ssrFetch";
import BlogPostClient from "./BlogPostClient";
import { BlogPostJsonLd } from "./BlogPostJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublicBlogPostBySlug(slug);
    return nptMetadata({
      title: post?.title ?? "Blog",
      description: post?.excerpt ?? null,
      canonicalPath: `/blog/${slug}`,
      ogImage: post?.bannerImage?.url ?? null,
    });
  } catch {
    return nptMetadata({ title: "Blog", canonicalPath: `/blog/${slug}` });
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: any;
  try {
    post = await getPublicBlogPostBySlug(slug);
  } catch (e) {
    if ((e as any)?.status === 404) notFound();
    throw e;
  }

  // Comments: SSR only the first page (match client pagination defaults)
  const COMMENTS_PAGE_SIZE = 10;
  const commentsPromise = ssrApiFetch<{ data: { items: any[]; meta: any } }>(
    `/api/v1/blog/${encodeURIComponent(slug)}/comments?page=1&pageSize=${COMMENTS_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`,
  );

  // Related articles: same first category (if available), exclude current slug
  const firstCategoryId =
    Array.isArray(post?.categoryIds) && post.categoryIds.length
      ? String(post.categoryIds[0])
      : null;

  const relatedPromise = (async () => {
    if (!firstCategoryId) return { data: { items: [] as any[] } };

    const qs = new URLSearchParams();
    qs.set("page", "1");
    // /api/v1/blog route expects `limit`, not `pageSize`
    qs.set("limit", "6");

    // allowed sort keys: newest | oldest | mostViewed | titleAsc | relevance
    qs.set("sortBy", "newest");

    // categoryId is supported
    qs.set("categoryId", firstCategoryId);

    const res = await ssrApiFetch<{ data: { items: any[]; meta: any } }>(
      `/api/v1/blog?${qs.toString()}`,
    );

    const items = (res?.data?.items ?? [])
      .filter((p: any) => p?.slug && p.slug !== slug)
      .slice(0, 3);
    return { data: { items } };
  })();

  const [commentsRes, relatedRes] = await Promise.all([commentsPromise, relatedPromise]);

  return (
    <>
      <BlogPostJsonLd post={post} slug={slug} />
      <BlogPostClient
        slug={slug}
        initialPost={post}
        initialComments={commentsRes.data.items}
        initialCommentsMeta={commentsRes.data.meta}
        initialRelated={relatedRes.data.items}
      />
    </>
  );
}
