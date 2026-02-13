// src/app/(admin)/admin/jobs/AdminJobsListClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/components/admin/theme/AdminThemeProvider";
import { ConfirmModal, type ConfirmTone } from "@/components/admin/ui/ConfirmModal";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { Select } from "@/components/admin/ui/Select";
import { SoftButton, IconButton } from "@/components/admin/ui/Buttons";

import {
  Archive,
  Briefcase,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
  AlertTriangle,
  Ban,
  Users,
} from "lucide-react";

import { EJobPostingStatus } from "@/types/jobPosting.types";
import {
  adminArchiveJob,
  adminCloseJob,
  adminDeleteJob,
  adminPublishJob,
} from "@/lib/utils/jobs/adminJobsApi";
import { getAllowedJobActions } from "@/lib/utils/jobs/jobStatusTransitions";

function statusPill(status: string, isDark: boolean) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide";

  if (status === EJobPostingStatus.PUBLISHED)
    return cn(
      base,
      isDark
        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
        : "border-emerald-200 bg-emerald-50 text-emerald-700",
    );
  if (status === EJobPostingStatus.DRAFT)
    return cn(
      base,
      isDark
        ? "border-amber-500/25 bg-amber-500/10 text-amber-100"
        : "border-amber-200 bg-amber-50 text-amber-700",
    );
  if (status === EJobPostingStatus.CLOSED)
    return cn(
      base,
      isDark
        ? "border-sky-500/25 bg-sky-500/10 text-sky-100"
        : "border-sky-200 bg-sky-50 text-sky-700",
    );

  return cn(
    base,
    isDark
      ? "border-white/10 bg-white/5 text-[var(--dash-muted)]"
      : "border-gray-200 bg-gray-50 text-gray-700",
  );
}

function RowMenu({
  busy,
  canArchive,
  onArchive,
  onDelete,
}: {
  busy: boolean;
  canArchive: boolean;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <IconButton title="More actions" disabled={busy} onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>

      {open ? (
        <div
          className={cn(
            "absolute right-0 z-[95] mt-2 w-52 overflow-hidden rounded-3xl border",
            "border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--dash-shadow)]",
          )}
          role="menu"
        >
          {canArchive ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onArchive();
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
                  "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)] disabled:opacity-50",
                )}
                role="menuitem"
              >
                <Archive className="h-4 w-4 text-amber-500" />
                Archive
              </button>
              <div className="h-px bg-[var(--dash-border)]" />
            </>
          ) : null}

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
              "text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-300",
            )}
            role="menuitem"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminJobsListClient({
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
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isPending, startTransition] = React.useTransition();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmActionRef = React.useRef<null | (() => Promise<unknown>)>(null);
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
    startTransition(() => router.push(`/admin/jobs?${qs.toString()}`));
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function run<T>(fn: () => Promise<T>) {
    setErr(null);
    setBusy(true);
    try {
      await fn();
      startTransition(() => router.refresh());
      setSelected([]);
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
    action: () => Promise<unknown>; // <-- was Promise<void>
  }) {
    confirmActionRef.current = opts.action as any;
    setConfirmTone(opts.tone ?? "neutral");
    setConfirmTitle(opts.title);
    setConfirmDesc(opts.description ?? null);
    setConfirmLabel(opts.confirmLabel ?? "Confirm");
    setConfirmOpen(true);
  }

  function openPublic(slug: string) {
    window.open(`/jobs/${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
  }

  const allChecked = items.length > 0 && selected.length === items.length;

  // Bulk delete helpers
  const selectedItems = React.useMemo(() => {
    const set = new Set(selected);
    return items.filter((x) => set.has(String(x.id)));
  }, [items, selected]);

  const bulkDeletableIds = React.useMemo(() => {
    // Allow deleting any selected job (regardless of status) since you already have per-row delete.
    // If you want to block deleting published jobs, filter here.
    return selectedItems.map((x) => String(x.id));
  }, [selectedItems]);

  const bulkDeleteDisabled = busy || isPending || bulkDeletableIds.length === 0;

  async function bulkDelete() {
    const ids = bulkDeletableIds.slice();
    if (!ids.length) return;

    // Sequential to avoid overloading + keep behavior predictable.
    // If you prefer parallel, replace with Promise.allSettled.
    for (const id of ids) {
      await adminDeleteJob(id);
    }
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header / Filters */}
        <div
          className={cn(
            "mb-6 rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
                      "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                    )}
                  >
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                      Job postings
                    </div>
                    <div className="mt-1 text-sm text-[var(--dash-muted)]">
                      Create, publish, close, archive, and review applicants.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SoftButton
                  disabled={busy || isPending}
                  onClick={() => startTransition(() => router.refresh())}
                  icon={
                    <RefreshCw className={cn("h-4 w-4", (busy || isPending) && "animate-spin")} />
                  }
                  label="Refresh"
                />
                <SoftButton
                  disabled={busy || isPending}
                  onClick={() => router.push("/admin/jobs/new")}
                  icon={<Upload className="h-4 w-4" />}
                  label="New posting"
                />
              </div>
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
                  placeholder="Search title, department, tags…"
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
                  { value: EJobPostingStatus.DRAFT, label: "Draft" },
                  { value: EJobPostingStatus.PUBLISHED, label: "Published" },
                  { value: EJobPostingStatus.CLOSED, label: "Closed" },
                  { value: EJobPostingStatus.ARCHIVED, label: "Archived" },
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

          <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface)] px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[var(--dash-muted)]">
                Selected:{" "}
                <span className="font-semibold text-[var(--dash-text)]">{selected.length}</span>
              </div>

              <div className="flex items-center gap-2">
                {selected.length ? (
                  <>
                    <SoftButton
                      icon={<X className="h-4 w-4" />}
                      label="Clear"
                      disabled={busy || isPending}
                      onClick={() => setSelected([])}
                    />
                    <SoftButton
                      icon={<Trash2 className="h-4 w-4" />}
                      label={`Delete selected (${bulkDeletableIds.length})`}
                      disabled={bulkDeleteDisabled}
                      onClick={() =>
                        confirm({
                          tone: "danger",
                          title: `Delete ${bulkDeletableIds.length} job${bulkDeletableIds.length === 1 ? "" : "s"}?`,
                          description: (
                            <div className="space-y-2">
                              <div>This cannot be undone.</div>
                              <div className="text-xs opacity-80">
                                Tip: If you want to keep a record, use Archive instead of Delete.
                              </div>
                            </div>
                          ),
                          confirmLabel: "Delete",
                          action: bulkDelete,
                        })
                      }
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
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
                  <th className="px-4 py-3">
                    <Checkbox
                      checked={allChecked}
                      disabled={busy || isPending || items.length === 0}
                      onChange={(next) => setSelected(next ? items.map((x) => String(x.id)) : [])}
                      label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Title</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Department</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Type</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--dash-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((j) => {
                  const id = String(j.id);
                  const isPublished = j.status === EJobPostingStatus.PUBLISHED;
                  const isClosed = j.status === EJobPostingStatus.CLOSED;

                  const canPublicPreview = isPublished;

                  const { canPublish, canClose, canArchive } = getAllowedJobActions(j.status);

                  const typeLabel =
                    [j.workplaceType, j.employmentType].filter(Boolean).join(" • ") || "—";

                  const showPublish = canPublish;
                  const showClose = canClose;

                  return (
                    <tr
                      key={id}
                      className={cn(
                        "border-b border-[var(--dash-border)]/70 last:border-b-0",
                        "transition hover:bg-[var(--dash-surface-2)]/45",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.includes(id)}
                          disabled={busy || isPending}
                          onChange={() => toggle(id)}
                          label={`Select ${j.title}`}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--dash-text)]">{j.title}</div>
                        <div className="mt-0.5 text-xs text-[var(--dash-muted)]">{j.slug}</div>
                      </td>

                      <td className="px-4 py-3 text-[var(--dash-text)]/90">
                        {j.department || "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--dash-text)]/85">{typeLabel}</td>

                      <td className="px-4 py-3">
                        <span className={statusPill(j.status, isDark)}>{j.status}</span>
                      </td>

                      <td className="px-4 py-3 text-[var(--dash-muted)]">
                        {j.updatedAt ? new Date(j.updatedAt).toLocaleString() : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Publish / Close (only show what makes sense) */}
                          {showPublish ? (
                            <SoftButton
                              disabled={busy || isPending}
                              onClick={() => run(async () => adminPublishJob(id, null))}
                              icon={<Upload className="h-4 w-4" />}
                              label="Publish"
                            />
                          ) : null}

                          {showClose ? (
                            <SoftButton
                              disabled={busy || isPending}
                              onClick={() =>
                                confirm({
                                  tone: "danger",
                                  title: "Close this job posting?",
                                  description:
                                    "This will mark the posting as closed to new applicants.",
                                  confirmLabel: "Close",
                                  action: async () => adminCloseJob(id),
                                })
                              }
                              icon={<Ban className="h-4 w-4" />}
                              label="Close"
                            />
                          ) : null}

                          {/* Applications */}
                          <SoftButton
                            disabled={busy || isPending}
                            onClick={() => router.push(`/admin/jobs/${id}/applications`)}
                            icon={<Users className="h-4 w-4" />}
                            label="Applications"
                          />

                          {/* Edit */}
                          <IconButton
                            title="Edit"
                            disabled={busy || isPending}
                            onClick={() => router.push(`/admin/jobs/${id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </IconButton>

                          {/* Public preview */}
                          <IconButton
                            title={
                              canPublicPreview
                                ? "Preview public page"
                                : "Preview disabled (publish first)"
                            }
                            disabled={!canPublicPreview || busy || isPending}
                            onClick={() => openPublic(String(j.slug))}
                          >
                            {canPublicPreview ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <ExternalLink className="h-4 w-4 opacity-60" />
                            )}
                          </IconButton>

                          <RowMenu
                            busy={busy || isPending}
                            canArchive={canArchive}
                            onArchive={() =>
                              confirm({
                                tone: "danger",
                                title: "Archive this job?",
                                description: "Archived postings are hidden from public listings.",
                                confirmLabel: "Archive",
                                action: async () => adminArchiveJob(id),
                              })
                            }
                            onDelete={() =>
                              confirm({
                                tone: "danger",
                                title: "Delete this job?",
                                description: "This cannot be undone.",
                                confirmLabel: "Delete",
                                action: async () => adminDeleteJob(id),
                              })
                            }
                          />
                        </div>

                        {isClosed ? (
                          <div className="mt-2 text-right text-[11px] text-[var(--dash-muted)]">
                            Closed postings remain visible in admin.
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}

                {!items.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[var(--dash-muted)]">
                      No job postings found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
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
