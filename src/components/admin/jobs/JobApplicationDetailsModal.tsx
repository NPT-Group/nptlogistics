// src/components/admin/jobs/JobApplicationDetailsModal.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  FileText,
  User,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { EJobApplicationStatus } from "@/types/jobApplication.types";
import { getDownloadUrlFromS3Key } from "@/lib/utils/s3Helper";

function usePortalReady() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => setReady(true), []);
  return ready;
}

function displayDate(value?: string | Date) {
  if (!value) return "-";
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleString();
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] || "").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return a + b || "?";
}

function statusBadge(status?: string) {
  const s = String(status || "").toUpperCase();
  if (s === String(EJobApplicationStatus.RECEIVED))
    return "border-amber-200 bg-amber-50 text-amber-900";
  if (s === String(EJobApplicationStatus.VIEWED))
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (s === String(EJobApplicationStatus.ARCHIVED))
    return "border-gray-200 bg-gray-50 text-gray-800";
  return "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]";
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-bg)] p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon ? <div className="text-[var(--dash-muted)]">{icon}</div> : null}
        <div className="text-xs font-semibold tracking-wide text-[var(--dash-muted)] uppercase">
          {title}
        </div>
      </div>
      <div className="text-sm text-[var(--dash-text)]">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-3">
      <div className="text-xs font-semibold tracking-wide text-[var(--dash-muted)] uppercase">
        {label}
      </div>
      <div className="min-w-0 text-sm text-[var(--dash-text)]">{children}</div>
    </div>
  );
}

export function JobApplicationDetailsModal({
  open,
  onClose,
  application,
  onDownloadResume,
  onDownloadPhoto,
}: {
  open: boolean;
  onClose: () => void;
  application: any | null;
  onDownloadResume: (application: any) => void;
  onDownloadPhoto: (application: any) => void;
}) {
  const ready = usePortalReady();
  const router = useRouter();
  const markOnceRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto-mark viewed when the modal is opened (admins "view" via modal).
  React.useEffect(() => {
    if (!open || !application?.id) return;

    const id = String(application.id);
    if (markOnceRef.current === id) return;

    const status = String(application.status || "").toUpperCase();
    if (status === String(EJobApplicationStatus.VIEWED)) {
      markOnceRef.current = id;
      return;
    }

    markOnceRef.current = id;

    (async () => {
      try {
        // Uses existing PATCH route: /api/v1/admin/job-applications
        // Body supports { id, markViewed: true } which sets VIEWED + viewedAt + viewedBy.
        const res = await fetch("/api/v1/admin/job-applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, markViewed: true }),
        });

        // Best-effort: no user interruption if it fails.
        if (res.ok) {
          // refresh lists behind the modal to reflect viewed status
          router.refresh();
        }
      } catch {
        // ignore (best-effort)
      }
    })();
  }, [open, application?.id, application?.status, router]);

  if (!open || !ready || !application) return null;

  const fullName = `${application.firstName || ""} ${application.lastName || ""}`.trim() || "-";
  const jobTitle =
    application.jobPosting?.title || application.jobTitle || application.jobPostingId || "-";
  const slug = application?.jobPosting?.slug || application?.jobSlug || application?.jobPostingSlug;
  const publicJobUrl = slug ? `/careers/${encodeURIComponent(slug)}` : null;

  async function downloadAsset(s3Key?: string, fallbackName?: string) {
    if (!s3Key) return;
    const url = await getDownloadUrlFromS3Key({ s3Key, filename: fallbackName || "download" });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const canWorkOnsite = application.canWorkOnsite;
  const hasReferences = application.hasReferences;

  return createPortal(
    <div className="fixed inset-0 z-[130]">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onMouseDown={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-4xl overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-[var(--dash-border)] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                    "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                  )}
                >
                  <span className="text-sm font-bold">{initials(fullName)}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-base font-semibold text-[var(--dash-text)]">
                      {fullName}
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        statusBadge(application.status),
                      )}
                    >
                      {application.status || "-"}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--dash-muted)]">
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="truncate">{jobTitle}</span>
                    </span>

                    {publicJobUrl ? (
                      <button
                        type="button"
                        onClick={() => window.open(publicJobUrl, "_blank", "noopener,noreferrer")}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold",
                          "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                          "hover:bg-[var(--dash-surface-2)]",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                        )}
                        title="Open public job posting"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Public posting
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-2xl p-2 transition",
                  "text-[var(--dash-muted)] hover:bg-[var(--dash-surface-2)] hover:text-[var(--dash-text)]",
                )}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[72vh] overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <Section title="Contact" icon={<User className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <Field label="Email">
                      <div className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[var(--dash-muted)]" />
                        <span className="break-all">{application.email || "-"}</span>
                      </div>
                    </Field>
                    <Field label="Phone">
                      <div className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--dash-muted)]" />
                        <span>{application.phone || "-"}</span>
                      </div>
                    </Field>
                    <Field label="Location">
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[var(--dash-muted)]" />
                        <span>{application.currentLocation || application.addressLine || "-"}</span>
                      </div>
                    </Field>
                  </div>
                </Section>

                <Section title="Links" icon={<LinkIcon className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <Field label="LinkedIn">
                      {application.linkedInUrl ? (
                        <a
                          href={application.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 underline underline-offset-4"
                        >
                          <ExternalLink className="h-4 w-4 text-[var(--dash-muted)]" />
                          <span className="break-all">{application.linkedInUrl}</span>
                        </a>
                      ) : (
                        "-"
                      )}
                    </Field>

                    <Field label="Portfolio">
                      {application.portfolioUrl ? (
                        <a
                          href={application.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 underline underline-offset-4"
                        >
                          <ExternalLink className="h-4 w-4 text-[var(--dash-muted)]" />
                          <span className="break-all">{application.portfolioUrl}</span>
                        </a>
                      ) : (
                        "-"
                      )}
                    </Field>
                  </div>
                </Section>

                <Section title="Cover letter" icon={<FileText className="h-4 w-4" />}>
                  {application.coverLetter ? (
                    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-sm break-words whitespace-pre-wrap">
                      {application.coverLetter}
                    </div>
                  ) : (
                    <div className="text-[var(--dash-muted)]">No cover letter provided.</div>
                  )}
                </Section>
              </div>

              <div className="space-y-4">
                <Section title="Timeline" icon={<Clock className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <Field label="Submitted">
                      <div className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--dash-muted)]" />
                        <span>{displayDate(application.createdAt)}</span>
                      </div>
                    </Field>
                    <Field label="Viewed at">
                      <span>{displayDate(application.viewedAt)}</span>
                    </Field>
                  </div>
                </Section>

                <Section title="Screening" icon={<CheckCircle2 className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <Field label="Can work onsite">
                      <span
                        className={cn(
                          "font-semibold",
                          canWorkOnsite === true
                            ? "text-emerald-700"
                            : canWorkOnsite === false
                              ? "text-amber-700"
                              : "text-[var(--dash-muted)]",
                        )}
                      >
                        {canWorkOnsite === true ? "Yes" : canWorkOnsite === false ? "No" : "-"}
                      </span>
                    </Field>
                    <Field label="Has references">
                      <span
                        className={cn(
                          "font-semibold",
                          hasReferences === true
                            ? "text-emerald-700"
                            : hasReferences === false
                              ? "text-amber-700"
                              : "text-[var(--dash-muted)]",
                        )}
                      >
                        {hasReferences === true ? "Yes" : hasReferences === false ? "No" : "-"}
                      </span>
                    </Field>
                    <Field label="Commute mode">
                      <span>{application.commuteMode || "-"}</span>
                    </Field>
                  </div>
                </Section>

                <Section title="Files" icon={<FileText className="h-4 w-4" />}>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const name = fullName !== "-" ? fullName : "application";
                        downloadAsset(application?.resume?.s3Key, `${name}-resume`);
                        onDownloadResume(application);
                      }}
                      disabled={!application?.resume?.s3Key}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                        "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                        "hover:bg-[var(--dash-surface-2)]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      Download resume
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const name = fullName !== "-" ? fullName : "application";
                        downloadAsset(application?.photo?.s3Key, `${name}-photo`);
                        onDownloadPhoto(application);
                      }}
                      disabled={!application?.photo?.s3Key}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                        "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                        "hover:bg-[var(--dash-surface-2)]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    >
                      <User className="h-4 w-4" />
                      Download photo
                    </button>
                  </div>
                </Section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 border-t border-[var(--dash-border)] px-5 py-4">
            <div className="text-xs text-[var(--dash-muted)]">
              Application ID: <span className="font-mono">{String(application.id || "-")}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition",
                "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                "hover:bg-[var(--dash-surface-2)]",
              )}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
