// src/app/admin/blog/AdminBlogListClient.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { adminArchivePost, adminBulkDeletePosts, adminDeletePost, adminPublishPost, adminUnpublishPost } from "@/lib/utils/blog/adminBlogApi";
import { EBlogStatus } from "@/types/blogPost.types";

import { MoreHorizontal, Pencil, Eye, Upload, Download, Archive, Trash2 } from "lucide-react";

function statusPill(status: string) {
  const base = "rounded-full border px-2.5 py-1 text-xs font-medium";
  if (status === "PUBLISHED") return cn(base, "border-emerald-200 bg-emerald-50 text-emerald-700");
  if (status === "DRAFT") return cn(base, "border-amber-200 bg-amber-50 text-amber-700");
  return cn(base, "border-gray-200 bg-gray-50 text-gray-700");
}

function IconButton({ title, disabled, onClick, children }: { title: string; disabled?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white shadow-sm transition",
        "border-gray-200 text-gray-700 hover:bg-gray-50",
        "focus:outline-none focus:ring-4 focus:ring-gray-900/5",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function PrimaryActionButton({ label, disabled, onClick, icon }: { label: string; disabled?: boolean; onClick?: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold shadow-sm transition",
        "bg-gray-900 text-white hover:bg-gray-800",
        "focus:outline-none focus:ring-4 focus:ring-gray-900/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function RowMenu({ busy, onArchive, onDelete }: { busy: boolean; onArchive: () => void; onDelete: () => void }) {
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

  return (
    <div ref={ref} className="relative">
      <IconButton title="More actions" disabled={busy} onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>

      {open ? (
        <div className={cn("absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border bg-white shadow-lg", "border-gray-200")} role="menu">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onArchive();
            }}
            className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition", "hover:bg-gray-50 disabled:opacity-50")}
            role="menuitem"
          >
            <Archive className="h-4 w-4 text-amber-600" />
            Archive
          </button>

          <div className="h-px bg-gray-100" />

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition", "text-red-700 hover:bg-red-50 disabled:opacity-50")}
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

export default function AdminBlogListClient({ initialItems, initialMeta }: { initialItems: any[]; initialMeta: any }) {
  const router = useRouter();
  const sp = useSearchParams();

  const items = initialItems ?? [];
  const meta = initialMeta ?? {};

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [status, setStatus] = React.useState(sp.get("status") ?? "");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  function pushQuery(next: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) qs.delete(k);
      else qs.set(k, v);
    }
    router.push(`/admin/blog?${qs.toString()}`);
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function run(fn: () => Promise<void>) {
    setErr(null);
    setBusy(true);
    try {
      await fn();
      router.refresh();
      setSelected([]);
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  }

  function openPreview(slug: string) {
    window.open(`/blog/${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-gray-900">Blog posts</div>
              <div className="mt-1 text-sm text-gray-500">Manage drafts, publishing, archive, deletions.</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => router.push("/admin/blog/new")} className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow">
                New post
              </button>
              <button
                onClick={() => router.push("/admin/blog/categories")}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Categories
              </button>
              <button onClick={() => router.push("/admin/blog/comments")} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Comments
              </button>
            </div>
          </div>

          {err ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div> : null}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_160px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, slug…"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-gray-900/5"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <button
              onClick={() => pushQuery({ q: q.trim() || null, status: status || null, page: "1" })}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-gray-900">{selected.length}</span>
          </div>
          <button
            disabled={busy || selected.length === 0}
            onClick={() =>
              run(async () => {
                const ok = window.confirm(`Delete ${selected.length} posts? This cannot be undone.`);
                if (!ok) return;
                await adminBulkDeletePosts(selected);
              })
            }
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-50"
          >
            Bulk delete
          </button>
        </div>

        <div className="rounded-3xl border border-gray-200/70 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200/70 bg-gray-50/60">
                <tr>
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={selected.length > 0 && selected.length === items.length} onChange={(e) => setSelected(e.target.checked ? items.map((x) => String(x.id)) : [])} />
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Author</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Read</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Views</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Updated</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
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
                    <tr key={id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{p.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500">{p.slug}</div>
                      </td>

                      <td className="px-4 py-3 text-gray-700">{authorName}</td>
                      <td className="px-4 py-3 text-gray-700">{reading}</td>
                      <td className="px-4 py-3 text-gray-700">{views}</td>

                      <td className="px-4 py-3">
                        <span className={statusPill(p.status)}>{p.status}</span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Primary publish/unpublish */}
                          <PrimaryActionButton
                            disabled={busy}
                            label={isPublished ? "Unpublish" : "Publish"}
                            icon={isPublished ? <Download className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                            onClick={() =>
                              run(async () => {
                                if (isPublished) await adminUnpublishPost(id);
                                else await adminPublishPost(id, null);
                              })
                            }
                          />

                          {/* Minimal icon actions */}
                          <IconButton title="Edit" disabled={busy} onClick={() => router.push(`/admin/blog/${id}`)}>
                            <Pencil className="h-4 w-4" />
                          </IconButton>

                          <IconButton title={isPublished ? "Preview public page" : "Preview disabled (publish first)"} disabled={!isPublished || busy} onClick={() => openPreview(String(p.slug))}>
                            <Eye className="h-4 w-4" />
                          </IconButton>

                          {/* Kebab menu for destructive/secondary */}
                          <RowMenu
                            busy={busy}
                            onArchive={() =>
                              run(async () => {
                                const ok = window.confirm("Archive this post?");
                                if (!ok) return;
                                await adminArchivePost(id);
                              })
                            }
                            onDelete={() =>
                              run(async () => {
                                const ok = window.confirm("Delete this post? This cannot be undone.");
                                if (!ok) return;
                                await adminDeletePost(id);
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
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No posts found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200/70 px-4 py-3 text-sm text-gray-600">
            <div>
              Page <span className="font-semibold text-gray-900">{meta?.page ?? 1}</span> of <span className="font-semibold text-gray-900">{meta?.totalPages ?? 1}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={!meta?.hasPrev}
                onClick={() => pushQuery({ page: String(Math.max(1, (meta.page ?? 1) - 1)) })}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={!meta?.hasNext}
                onClick={() => pushQuery({ page: String((meta.page ?? 1) + 1) })}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
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
