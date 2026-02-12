// src/app/admin/blog/new/NewBlogPostClient.tsx
"use client";

import { useRouter } from "next/navigation";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { adminCreatePost, adminPublishPost } from "@/lib/utils/blog/adminBlogApi";
import { EBlogStatus } from "@/types/blogPost.types";

export default function NewBlogPostClient() {
  const router = useRouter();

  return (
    <BlogEditor
      mode="create"
      headerTitle="New blog post"
      headerSubtitle="Write on the left. Configure on the right."
      backHref="/admin/blog"
      onBack={() => router.push("/admin/blog")}
      primaryLabel="Save draft"
      secondaryLabel="Publish"
      secondaryActionKind="PUBLISH"
      onSavePrimary={async (payload) => {
        const created = await adminCreatePost({ ...payload, status: EBlogStatus.DRAFT, publishedAt: null });
        const id = (created as any)?.id || (created as any)?._id;
        if (id) router.push(`/admin/blog/${id}`);
      }}
      onSaveSecondary={async (payload) => {
        const created = await adminCreatePost({ ...payload, status: EBlogStatus.DRAFT, publishedAt: null });
        const id = (created as any)?.id || (created as any)?._id;
        if (!id) throw new Error("Failed to create post");
        await adminPublishPost(id, payload.publishedAt ?? null);
        router.push(`/admin/blog/${id}`);
      }}
    />
  );
}
