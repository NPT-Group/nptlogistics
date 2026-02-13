// src/app/(admin)/admin/jobs/new/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import NewJobPostingClient from "./NewJobPostingClient";

export const metadata = nptMetadata({
  title: "Admin - New job posting",
  description: "Create a new job posting.",
  noIndex: true,
});

export default async function AdminNewJobPostingPage() {
  return <NewJobPostingClient />;
}
