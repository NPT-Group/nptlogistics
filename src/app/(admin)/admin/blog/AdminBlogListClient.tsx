// src/app/(admin)/admin/blog/AdminBlogListClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  adminArchivePost,
  adminBulkDeletePosts,
  adminDeletePost,
  adminPublishPost,
  adminUnpublishPost,
} from "@/lib/utils/blog/adminBlogApi";
import { EBlogStatus } from "@/types/blogPost.types";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";

import { ConfirmModal, type ConfirmTone } from "@/app/(admin)/components/ui/ConfirmModal";
import { Checkbox } from "@/app/(admin)/components/ui/Checkbox";
import { Select } from "@/app/(admin)/components/ui/Select";
import { SoftButton, IconButton } from "@/app/(admin)/components/ui/Buttons";

import {
  MoreHorizontal,
  Pencil,
  Eye,
  Upload,
  Download,
  Archive,
  Trash2,
  Search,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

function statusPill(status: string, isDark: boolean) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide";

  if (status === "PUBLISHED")
    return cn(
      base,
      isDark
        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
        : "border-emerald-200 bg-emerald-50 text-emerald-700",
    );

  if (status === "DRAFT")
    return cn(
      base,
      isDark
        ? "border-amber-500/25 bg-amber-500/10 text-amber-100"
        : "border-amber-200 bg-amber-50 text-amber-700",
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
  onArchive,
  onDelete,
}: {
  busy: boolean;
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

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
              "text-red-600 hover:bg-red-500/10 disabled:opacity-50",
              "dark:text-red-300",
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

export default function AdminBlogListClient({
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
  const [selected, setSelected] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  // transitions for router actions (refresh/search/pagination) so we can animate refresh icon
  const [isPending, startTransition] = React.useTransition();

  // confirm modal state
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
    startTransition(() => {
      router.push(`/admin/blog?${qs.toString()}`);
    });
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function run(fn: () => Promise<void>) {
    setErr(null);
    setBusy(true);
    try {
      await fn();
      // refresh via transition so icon can spin + UI feels smoother
      startTransition(() => {
        router.refresh();
      });
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
    action: () => Promise<void>;
  }) {
    confirmActionRef.current = opts.action;
    setConfirmTone(opts.tone ?? "neutral");
    setConfirmTitle(opts.title);
    setConfirmDesc(opts.description ?? null);
    setConfirmLabel(opts.confirmLabel ?? "Confirm");
    setConfirmOpen(true);
  }

  function openPreview(slug: string) {
    window.open(`/blog/${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
  }

  const allChecked = items.length > 0 && selected.length === items.length;

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      {/* subtle backdrop */}
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
            // IMPORTANT: no overflow-hidden so select dropdown isn't clipped
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                  Blog posts
                </div>
                <div className="mt-1 text-sm text-[var(--dash-muted)]">
                  Manage drafts, publishing, archive, deletions.
                </div>
              </div>

              <SoftButton
                disabled={busy || isPending}
                onClick={() =>
                  startTransition(() => {
                    router.refresh();
                  })
                }
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
              {/* Search input */}
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
                  placeholder="Search title, slug…"
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
                  { value: "DRAFT", label: "Draft" },
                  { value: "PUBLISHED", label: "Published" },
                  { value: "ARCHIVED", label: "Archived" },
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

          {/* Bulk bar */}
          <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface)] px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[var(--dash-muted)]">
                Selected:{" "}
                <span className="font-semibold text-[var(--dash-text)]">{selected.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={busy || isPending || selected.length === 0}
                  onClick={() =>
                    confirm({
                      tone: "danger",
                      title: "Bulk delete posts?",
                      description: (
                        <>
                          You are about to delete{" "}
                          <span className="font-semibold text-[var(--dash-text)]">
                            {selected.length}
                          </span>{" "}
                          post(s). This cannot be undone.
                        </>
                      ),
                      confirmLabel: "Delete",
                      action: async () => {
                        await adminBulkDeletePosts(selected);
                      },
                    })
                  }
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    isDark
                      ? "border-red-500/25 bg-red-600/15 text-red-50 hover:bg-red-600/20"
                      : "border-red-200 bg-red-50 text-red-900 hover:bg-red-100",
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                  Bulk delete
                </button>

                {selected.length ? (
                  <SoftButton
                    icon={<X className="h-4 w-4" />}
                    label="Clear"
                    disabled={busy || isPending}
                    onClick={() => setSelected([])}
                  />
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
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Author</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Read</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Views</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--dash-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((p) => {
                  const id = String(p.id);
                  const isPublished = p.status === EBlogStatus.PUBLISHED;

                  const authorName = p?.author?.name || p?.author?.email || "—";
                  const reading = p?.readingTimeMinutes != null ? `${p.readingTimeMinutes}m` : "—";
                  const views = p?.viewCount != null ? String(p.viewCount) : "0";

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
                          label={`Select ${p.title}`}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--dash-text)]">{p.title}</div>
                        <div className="mt-0.5 text-xs text-[var(--dash-muted)]">{p.slug}</div>
                      </td>

                      <td className="px-4 py-3 text-[var(--dash-text)]/90">{authorName}</td>
                      <td className="px-4 py-3 text-[var(--dash-text)]/85">{reading}</td>
                      <td className="px-4 py-3 text-[var(--dash-text)]/85">{views}</td>

                      <td className="px-4 py-3">
                        <span className={statusPill(p.status, isDark)}>{p.status}</span>
                      </td>

                      <td className="px-4 py-3 text-[var(--dash-muted)]">
                        {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <SoftButton
                            disabled={busy || isPending}
                            onClick={() => {
                              if (isPublished) {
                                confirm({
                                  tone: "danger",
                                  title: "Unpublish this post?",
                                  description:
                                    "This will remove it from the public blog until published again.",
                                  confirmLabel: "Unpublish",
                                  action: async () => {
                                    await adminUnpublishPost(id);
                                  },
                                });
                              } else {
                                run(async () => {
                                  await adminPublishPost(id, null);
                                });
                              }
                            }}
                            icon={
                              isPublished ? (
                                <Download className="h-4 w-4" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )
                            }
                            label={isPublished ? "Unpublish" : "Publish"}
                          />

                          <IconButton
                            title="Edit"
                            disabled={busy || isPending}
                            onClick={() => router.push(`/admin/blog/${id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            title={
                              isPublished
                                ? "Preview public page"
                                : "Preview disabled (publish first)"
                            }
                            disabled={!isPublished || busy || isPending}
                            onClick={() => openPreview(String(p.slug))}
                          >
                            <Eye className="h-4 w-4" />
                          </IconButton>

                          <RowMenu
                            busy={busy || isPending}
                            onArchive={() =>
                              confirm({
                                tone: "danger",
                                title: "Archive this post?",
                                description:
                                  "Archived posts are hidden from the public blog. You can keep it for records.",
                                confirmLabel: "Archive",
                                action: async () => {
                                  await adminArchivePost(id);
                                },
                              })
                            }
                            onDelete={() =>
                              confirm({
                                tone: "danger",
                                title: "Delete this post?",
                                description: "This cannot be undone.",
                                confirmLabel: "Delete",
                                action: async () => {
                                  await adminDeletePost(id);
                                },
                              })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!items.length ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-[var(--dash-muted)]">
                      No posts found.
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
