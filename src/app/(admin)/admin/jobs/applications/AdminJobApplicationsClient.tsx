// src/app/(admin)/admin/jobs/applications/AdminJobApplicationsClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";
import { ConfirmModal, type ConfirmTone } from "@/app/(admin)/components/ui/ConfirmModal";
import { Select } from "@/app/(admin)/components/ui/Select";
import { SoftButton, IconButton } from "@/app/(admin)/components/ui/Buttons";
import { JobApplicationDetailsModal } from "@/app/(admin)/components/jobs/JobApplicationDetailsModal";
import {
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  Eye,
  Archive,
  ExternalLink,
  ArchiveRestore,
} from "lucide-react";
import { EJobApplicationStatus } from "@/types/jobApplication.types";
import { adminSetApplicationStatus } from "@/lib/utils/jobs/adminJobsApi";

export default function AdminJobApplicationsClient({
  initialItems,
  initialMeta,
}: {
  initialItems: any[];
  initialMeta: any;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const items = initialItems ?? [];
  const meta = initialMeta ?? {};

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [status, setStatus] = React.useState(sp.get("status") ?? "");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [selectedApplication, setSelectedApplication] = React.useState<any | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmActionRef = React.useRef<null | (() => Promise<void>)>(null);
  const [confirmTone, setConfirmTone] = React.useState<ConfirmTone>("neutral");
  const [confirmTitle, setConfirmTitle] = React.useState("");
  const [confirmDesc, setConfirmDesc] = React.useState<React.ReactNode>(null);
  const [confirmLabel, setConfirmLabel] = React.useState("Confirm");

  function pushQuery(next: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    startTransition(() => router.push(`/admin/jobs/applications?${qs.toString()}`));
  }

  async function run(fn: () => Promise<void>) {
    setErr(null);
    setBusy(true);
    try {
      await fn();
      startTransition(() => router.refresh());
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  }

  function confirm(opts: {
    tone?: ConfirmTone;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    action: () => Promise<void>;
  }) {
    confirmActionRef.current = opts.action;
    setConfirmTone(opts.tone ?? "neutral");
    setConfirmTitle(opts.title);
    setConfirmDesc(opts.description ?? null);
    setConfirmLabel(opts.confirmLabel ?? "Confirm");
    setConfirmOpen(true);
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 -z-10",
          isDark
            ? "bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(220,38,38,0.14),transparent_55%),radial-gradient(900px_500px_at_90%_10%,rgba(255,255,255,0.06),transparent_55%)]"
            : "bg-[radial-gradient(1100px_520px_at_10%_0%,rgba(220,38,38,0.08),transparent_55%),radial-gradient(900px_480px_at_90%_10%,rgba(15,23,42,0.06),transparent_55%)]",
        )}
      />

      <ConfirmModal
        open={confirmOpen}
        tone={confirmTone}
        title={confirmTitle}
        description={confirmDesc}
        confirmLabel={confirmLabel}
        busy={busy}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          const act = confirmActionRef.current;
          setConfirmOpen(false);
          if (!act) return;
          run(act);
        }}
      />

      <JobApplicationDetailsModal
        open={Boolean(selectedApplication)}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onDownloadResume={() => {
          // handled inside modal via passed callbacks in your existing usage pattern
          // (kept signature required by modal)
        }}
        onDownloadPhoto={() => {
          // handled inside modal via passed callbacks in your existing usage pattern
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className={cn(
            "mb-6 rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                  Job applications
                </div>
                <div className="mt-1 text-sm text-[var(--dash-muted)]">
                  Review applicants and track status.
                </div>
              </div>

              <SoftButton
                disabled={busy || isPending}
                onClick={() => startTransition(() => router.refresh())}
                icon={
                  <RefreshCw className={cn("h-4 w-4", (busy || isPending) && "animate-spin")} />
                }
                label="Refresh"
              />
            </div>

            {err ? (
              <div
                className={cn(
                  "mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm",
                  isDark
                    ? "border-red-500/25 bg-red-600/15 text-red-50"
                    : "border-red-200 bg-red-50 text-red-900",
                )}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div className="flex-1">{err}</div>
                <button
                  type="button"
                  onClick={() => setErr(null)}
                  className={cn(
                    "rounded-2xl p-1.5 transition",
                    "text-inherit hover:bg-black/5",
                    isDark && "hover:bg-white/5",
                  )}
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_160px]">
              <div
                className={cn(
                  "group flex items-center gap-2 rounded-2xl border px-3 py-2 transition",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)]",
                  "focus-within:ring-2 focus-within:ring-[var(--dash-red-soft)]",
                )}
              >
                <Search className="h-4 w-4 text-[var(--dash-muted)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, email..."
                  className="w-full bg-transparent text-sm text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-muted)]"
                />
                {q.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className={cn(
                      "rounded-2xl p-1.5 text-[var(--dash-muted)] transition",
                      "hover:bg-[var(--dash-surface-2)] hover:text-[var(--dash-text)]",
                    )}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <Select
                value={status}
                onChange={setStatus}
                placeholder="All statuses"
                disabled={busy || isPending}
                options={[
                  { value: EJobApplicationStatus.RECEIVED, label: "Received" },
                  { value: EJobApplicationStatus.VIEWED, label: "Viewed" },
                  { value: EJobApplicationStatus.ARCHIVED, label: "Archived" },
                ]}
                className="z-[80]"
              />

              <SoftButton
                disabled={busy || isPending}
                onClick={() =>
                  pushQuery({ q: q.trim() || null, status: status || null, page: "1" })
                }
                icon={<Search className="h-4 w-4" />}
                label="Search"
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-3xl border bg-[var(--dash-surface)] shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)]",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[var(--dash-border)] bg-[var(--dash-surface-2)]/60 backdrop-blur">
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Applicant</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Job</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Contact</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Submitted</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--dash-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((a: any) => {
                  const id = String(a.id);
                  const name = `${a.firstName || ""} ${a.lastName || ""}`.trim() || "-";
                  const email = a.email || "-";

                  const jobTitle = a?.jobPosting?.title || a?.jobTitle || a?.jobPostingId || "-";
                  const slug = a?.jobPosting?.slug || a?.jobSlug || a?.jobPostingSlug;
                  const isArchived = a.status === EJobApplicationStatus.ARCHIVED;

                  return (
                    <tr
                      key={id}
                      className={cn(
                        "border-b border-[var(--dash-border)]/70 last:border-b-0",
                        "transition hover:bg-[var(--dash-surface-2)]/45",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--dash-text)]">{name}</div>
                        <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
                          {a.currentLocation || a.addressLine || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="max-w-[320px] truncate">
                          {slug ? (
                            <a
                              href={`/careers/${encodeURIComponent(slug)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "inline-flex items-center gap-2 text-left font-semibold",
                                "underline decoration-[var(--dash-muted)]/50 underline-offset-4",
                                "text-[var(--dash-text)] hover:decoration-[var(--dash-red-soft)]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                              )}
                              title="Open public job posting"
                            >
                              <span className="truncate">{jobTitle}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--dash-muted)]" />
                            </a>
                          ) : (
                            <div className="text-[var(--dash-text)]/90">{jobTitle}</div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-[var(--dash-text)]/90">{email}</div>
                        <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
                          {a.phone || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                          )}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-[var(--dash-muted)]">
                        {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <SoftButton
                            disabled={busy || isPending}
                            onClick={() => setSelectedApplication(a)}
                            icon={<Eye className="h-4 w-4" />}
                            label="View"
                          />

                          {isArchived ? (
                            <IconButton
                              title="Unarchive application"
                              disabled={busy || isPending}
                              onClick={() =>
                                confirm({
                                  tone: "neutral",
                                  title: "Unarchive this application?",
                                  description: "This will make it visible again in default views.",
                                  confirmLabel: "Unarchive",
                                  action: async () => {
                                    // choose the default “restored” state:
                                    await adminSetApplicationStatus(
                                      id,
                                      EJobApplicationStatus.RECEIVED,
                                    );
                                  },
                                })
                              }
                            >
                              {/* Use any icon you like; if you don't have RotateCcw imported, use Archive with styling or add RotateCcw */}
                              <ArchiveRestore className="h-4 w-4 -scale-x-100" />
                            </IconButton>
                          ) : (
                            <IconButton
                              title="Archive application"
                              disabled={busy || isPending}
                              onClick={() =>
                                confirm({
                                  tone: "danger",
                                  title: "Archive this application?",
                                  description:
                                    "Archived applications are hidden from default views.",
                                  confirmLabel: "Archive",
                                  action: async () => {
                                    await adminSetApplicationStatus(
                                      id,
                                      EJobApplicationStatus.ARCHIVED,
                                    );
                                  },
                                })
                              }
                            >
                              <Archive className="h-4 w-4" />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!items.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[var(--dash-muted)]">
                      No applications found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-[var(--dash-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--dash-muted)]">
              Page <span className="font-semibold text-[var(--dash-text)]">{meta?.page ?? 1}</span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--dash-text)]">{meta?.totalPages ?? 1}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={!meta?.hasPrev || busy || isPending}
                onClick={() => pushQuery({ page: String(Math.max(1, (meta.page ?? 1) - 1)) })}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                  "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                  "hover:bg-[var(--dash-surface-2)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                )}
              >
                Prev
              </button>
              <button
                disabled={!meta?.hasNext || busy || isPending}
                onClick={() => pushQuery({ page: String((meta.page ?? 1) + 1) })}
                className={cn(
                  "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                  "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
                  "hover:bg-[var(--dash-surface-2)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
