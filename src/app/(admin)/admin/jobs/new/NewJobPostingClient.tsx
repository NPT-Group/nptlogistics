// src/app/(admin)/admin/jobs/new/NewJobPostingClient.tsx
"use client";

import { useRouter } from "next/navigation";
import JobEditor from "@/components/admin/jobs/JobEditor";
import { adminCreateJob, adminPublishJob } from "@/lib/utils/jobs/adminJobsApi";

export default function NewJobPostingClient() {
  const router = useRouter();

  return (
    <JobEditor
      mode="create"
      headerTitle="New job posting"
      headerSubtitle="Write the job description on the left. Configure the details on the right."
      backHref="/admin/jobs"
      onBack={() => router.push("/admin/jobs")}
      primaryLabel="Save draft"
      secondaryLabel="Publish"
      secondaryActionKind="PUBLISH"
      onSavePrimary={async (payload) => {
        const created = await adminCreateJob(payload);
        router.replace(`/admin/jobs/${String((created as any).id)}`);
      }}
      onSaveSecondary={async (payload) => {
        const created = await adminCreateJob(payload);
        await adminPublishJob(String((created as any).id), null);
        router.replace(`/admin/jobs/${String((created as any).id)}`);
      }}
    />
  );
}
