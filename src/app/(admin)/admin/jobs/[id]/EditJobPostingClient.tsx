// src/app/(admin)/admin/jobs/[id]/EditJobPostingClient.tsx
"use client";

import { useRouter } from "next/navigation";
import JobEditor from "@/components/admin/jobs/JobEditor";
import { EJobPostingStatus } from "@/types/jobPosting.types";
import {
  adminArchiveJob,
  adminCloseJob,
  adminPublishJob,
  adminUpdateJob,
} from "@/lib/utils/jobs/adminJobsApi";

export default function EditJobPostingClient({ id, initialJob }: { id: string; initialJob: any }) {
  const router = useRouter();
  const status = initialJob?.status as EJobPostingStatus | undefined;

  const isPublished = status === EJobPostingStatus.PUBLISHED;
  const isArchived = status === EJobPostingStatus.ARCHIVED;

  return (
    <JobEditor
      mode="edit"
      headerTitle="Edit job posting"
      headerSubtitle="Keep it crisp and scannable — applicants skim."
      backHref="/admin/jobs"
      onBack={() => router.push("/admin/jobs")}
      initial={initialJob}
      previewUrl={isPublished ? `/careers/${encodeURIComponent(initialJob?.slug ?? "")}` : null}
      primaryLabel="Save"
      secondaryLabel={isPublished ? "Close" : "Publish"}
      secondaryActionKind={isPublished ? "CLOSE" : "PUBLISH"}
      secondaryDisabled={isArchived}
      dangerLabel="Archive"
      dangerDisabled={isArchived}
      dangerConfirmTitle="Archive this job?"
      dangerConfirmBody="Archived postings are removed from public listings and kept for records."
      onSavePrimary={async (payload) => {
        await adminUpdateJob(id, payload);
        router.refresh();
      }}
      onSaveSecondary={async (payload) => {
        // always save first to avoid closing/publishing stale data
        await adminUpdateJob(id, payload);
        if (isPublished) await adminCloseJob(id);
        else await adminPublishJob(id, null);
        router.refresh();
      }}
      onDanger={async () => {
        await adminArchiveJob(id);
        router.refresh();
      }}
    />
  );
}
