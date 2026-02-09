// src/app/admin/blog/new/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import NewBlogPostClient from "./NewBlogPostClient";

export const metadata = nptMetadata({
  title: "Admin - New blog post",
  description: "Create a new blog post.",
  noIndex: true,
});

export default async function AdminNewBlogPostPage() {
  return <NewBlogPostClient />;
}
