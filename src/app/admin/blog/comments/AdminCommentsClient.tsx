// src/app/admin/blog/comments/AdminCommentsClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminDeleteComment } from "@/lib/utils/blog/adminBlogApi";
import { ArrowLeft, CalendarClock, ExternalLink, MessageSquareText, Trash2 } from "lucide-react";

export default function AdminCommentsClient({ initialItems, initialMeta }: { initialItems: any[]; initialMeta: any }) {
  const router = useRouter();
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function del(id: string) {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;

    setBusyId(id);
    setErr(null);
    try {
      await adminDeleteComment(id);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-900">
                <MessageSquareText className="h-6 w-6 text-gray-700" />
                Comments
              </div>
              <div className="mt-1 text-sm text-gray-500">Guest comments moderation (delete only).</div>
            </div>

            <button
              onClick={() => router.push("/admin/blog")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to posts
            </button>
          </div>

          {err ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div> : null}
        </div>

        {/* List */}
        <div className="space-y-4">
          {initialItems.map((c) => {
            const postTitle = c?.postTitle ?? null;
            const postUrl = c?.postAdminUrl ?? (c?.blogPostId ? `/admin/blog/${encodeURIComponent(String(c.blogPostId))}` : null);
            const created = c?.createdAt ? new Date(c.createdAt) : null;
            const isBusy = busyId === String(c.id);

            return (
              <div key={String(c.id)} className="group rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
                {/* Top row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      {c.name} {c.email ? <span className="font-normal text-gray-500">({c.email})</span> : null}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                      <div className="inline-flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5" />
                        <span>{created ? created.toLocaleString() : ""}</span>
                      </div>

                      {/* Post link */}
                      <div className="inline-flex items-center gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {postUrl ? (
                          <Link
                            href={postUrl}
                            className="max-w-[520px] truncate font-medium text-gray-700 underline decoration-gray-200 underline-offset-2 hover:text-gray-900 hover:decoration-gray-300"
                            title={postTitle ?? "Open post"}
                          >
                            {postTitle ?? "View post"}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Post unavailable</span>
                        )}
                        {!postTitle ? <span className="ml-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">deleted</span> : null}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!!busyId}
                    onClick={() => del(String(c.id))}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-50"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Comment body */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{c.comment}</div>
                </div>

                {/* Subtle footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="opacity-0 transition group-hover:opacity-100">{isBusy ? "Working…" : ""}</div>
                  {/* If you *really* need it for debugging, keep it hidden behind hover */}
                  <div className="opacity-0 transition group-hover:opacity-100">Comment ID: {String(c.id)}</div>
                </div>
              </div>
            );
          })}

          {!initialItems.length ? <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">No comments.</div> : null}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <div>
            Page <span className="font-semibold text-gray-900">{initialMeta?.page ?? 1}</span> of <span className="font-semibold text-gray-900">{initialMeta?.totalPages ?? 1}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={!initialMeta?.hasPrev || !!busyId}
              onClick={() => router.push(`/admin/blog/comments?page=${Math.max(1, (initialMeta.page ?? 1) - 1)}`)}
              className="rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={!initialMeta?.hasNext || !!busyId}
              onClick={() => router.push(`/admin/blog/comments?page=${(initialMeta.page ?? 1) + 1}`)}
              className="rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
