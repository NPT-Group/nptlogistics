// src/app/(admin)/admin/blog/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { getAdminBlogPostById } from "@/lib/utils/blog/ssrBlogFetchers";
import EditBlogPostClient from "./EditBlogPostClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getAdminBlogPostById(id);
    return nptMetadata({
      title: post?.title ? `Admin - ${post.title}` : "Admin - Blog post",
      description: post?.excerpt ?? null,
      noIndex: true,
    });
  } catch {
    // Don't call notFound() here; metadata should be resilient.
    return nptMetadata({ title: "Admin - Blog post", noIndex: true });
  }
}

export default async function AdminEditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const post = await getAdminBlogPostById(id);
    return <EditBlogPostClient id={id} initialPost={post} />;
  } catch (e) {
    if ((e as any)?.status === 404) notFound();
    throw e; // other errors should still surface
  }
}
