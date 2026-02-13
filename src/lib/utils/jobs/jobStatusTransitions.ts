// src/lib/utils/jobs/jobStatusTransitions.ts
import { EJobPostingStatus } from "@/types/jobPosting.types";

export type JobAction = "publish" | "close" | "archive";

export function getAllowedJobActions(status: EJobPostingStatus | string | undefined) {
  const s = status as EJobPostingStatus | undefined;

  // Adjust if you have different enum names; these are based on your routes.
  const canPublish = s !== EJobPostingStatus.PUBLISHED; // allow publish from DRAFT/CLOSED/ARCHIVED (your requirement)
  const canClose = s === EJobPostingStatus.PUBLISHED; // only close if currently published
  const canArchive = s !== EJobPostingStatus.ARCHIVED; // allow archive from anything except already archived

  return { canPublish, canClose, canArchive };
}
