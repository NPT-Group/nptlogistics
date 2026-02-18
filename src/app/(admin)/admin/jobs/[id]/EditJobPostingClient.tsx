// src/app/(admin)/admin/jobs/[id]/EditJobPostingClient.tsx
"use client";

import { useRouter } from "next/navigation";
import JobEditor from "@/app/(admin)/components/jobs/JobEditor";
import { EJobPostingStatus } from "@/types/jobPosting.types";
import {
  adminArchiveJob,
  adminCloseJob,
  adminPublishJob,
  adminUnarchiveJob,
  adminUpdateJob,
} from "@/lib/utils/jobs/adminJobsApi";

export default function EditJobPostingClient({ id, initialJob }: { id: string; initialJob: any }) {
  const router = useRouter();
  const status = initialJob?.status as EJobPostingStatus | undefined;

  const isPublished = status === EJobPostingStatus.PUBLISHED;
  const isArchived = status === EJobPostingStatus.ARCHIVED;

  // When archived, we want the "secondary" button to unarchive (JobEditor maps ARCHIVED + PUBLISH => Unarchive label)
  const secondaryActionKind = isPublished ? "CLOSE" : "PUBLISH";
  const secondaryLabel = isPublished ? "Close" : "Publish";

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
      secondaryLabel={secondaryLabel}
      secondaryActionKind={secondaryActionKind}
      // IMPORTANT: do NOT disable secondary when archived; we need it for Unarchive
      secondaryDisabled={false}
      // Only show Archive when NOT archived
      dangerLabel={!isArchived ? "Archive" : undefined}
      dangerDisabled={isArchived}
      dangerConfirmTitle="Archive this job?"
      dangerConfirmBody="Archived postings are removed from public listings and kept for records."
      onSavePrimary={async (payload) => {
        await adminUpdateJob(id, payload);
        router.refresh();
      }}
      onSaveSecondary={async (payload) => {
        // always save first to avoid closing/publishing/unarchiving stale data
        await adminUpdateJob(id, payload);

        if (isArchived) {
          await adminUnarchiveJob(id);
        } else if (isPublished) {
          await adminCloseJob(id);
        } else {
          await adminPublishJob(id, null);
        }

        router.refresh();
      }}
      onDanger={
        !isArchived
          ? async () => {
              await adminArchiveJob(id);
              router.refresh();
            }
          : undefined
      }
    />
  );
}
