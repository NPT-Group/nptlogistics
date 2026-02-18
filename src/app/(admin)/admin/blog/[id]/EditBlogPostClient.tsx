"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/app/(admin)/components/blog/BlogEditor";
import {
  adminUpdatePost,
  adminPublishPost,
  adminUnpublishPost,
  adminArchivePost,
} from "@/lib/utils/blog/adminBlogApi";
import { EBlogStatus } from "@/types/blogPost.types";

export default function EditBlogPostClient({ id, initialPost }: { id: string; initialPost: any }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<EBlogStatus>(initialPost.status);

  const isPublished = status === EBlogStatus.PUBLISHED;

  const initial = {
    title: initialPost.title,
    slug: initialPost.slug,
    excerpt: initialPost.excerpt ?? "",
    body: initialPost.body,
    bannerImage: initialPost.bannerImage,
    categoryIds: (initialPost.categoryIds ?? []).map(String),
    publishedAt: initialPost.publishedAt ?? null,
    status: initialPost.status,
  };

  return (
    <BlogEditor
      mode="edit"
      headerTitle="Edit blog post"
      headerSubtitle="Update content and settings. Publish/unpublish or archive when you're ready."
      backHref="/admin/blog"
      onBack={() => router.push("/admin/blog")}
      initial={initial}
      primaryLabel="Save changes"
      secondaryLabel={isPublished ? "Unpublish" : "Publish"}
      secondaryActionKind={isPublished ? "UNPUBLISH" : "PUBLISH"}
      onSavePrimary={async (payload) => {
        const updated = await adminUpdatePost(id, {
          ...payload,
          status: undefined,
          publishedAt: undefined,
        } as any);
        setStatus(updated.status);
        router.refresh();
      }}
      onSaveSecondary={async (payload) => {
        if (isPublished) {
          const updated = await adminUnpublishPost(id);
          setStatus(updated.status);
        } else {
          const updated = await adminPublishPost(id, payload.publishedAt ?? null);
          setStatus(updated.status);
        }
        router.refresh();
      }}
      dangerLabel="Archive"
      dangerConfirmTitle="Archive this post?"
      dangerConfirmBody="This will set the status to ARCHIVED and remove it from public listings. Published date is retained for restoration later."
      onDanger={async () => {
        const updated = await adminArchivePost(id);
        setStatus(updated.status);
        router.refresh();
      }}
      previewUrl={
        status === EBlogStatus.PUBLISHED ? `/blog/${encodeURIComponent(initialPost.slug)}` : null
      }
    />
  );
}
