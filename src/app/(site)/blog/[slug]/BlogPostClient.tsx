// src/app/blog/[slug]/BlogPostClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";
import { ArrowLeft, Calendar, Clock, User2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  publicCountView,
  publicCreateComment,
  publicFetchComments,
} from "@/lib/utils/blog/publicBlogApi";

const BlockNote = dynamic(() => import("@/components/blocknote/BlockNote"), { ssr: false });

function fmtDate(d?: any) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function safeInt(v: any, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default function BlogPostClient({
  slug,
  initialPost,
  initialComments,
  initialRelated = [],
  initialCommentsMeta,
}: {
  slug: string;
  initialPost: any;
  initialComments: any[];
  initialRelated?: any[];
  // If your SSR page isn’t passing this yet, we still work (we’ll fetch meta on mount).
  initialCommentsMeta?: any;
}) {
  const router = useRouter();

  // ----- COMMENTS PAGINATION STATE -----
  const DEFAULT_PAGE_SIZE = 10;

  const [comments, setComments] = React.useState<any[]>(initialComments ?? []);
  const [commentsMeta, setCommentsMeta] = React.useState<any>(initialCommentsMeta ?? null);

  const [commentsPage, setCommentsPage] = React.useState<number>(
    safeInt(initialCommentsMeta?.page, 1),
  );
  const [pageSize, setPageSize] = React.useState<number>(
    safeInt(initialCommentsMeta?.pageSize, DEFAULT_PAGE_SIZE),
  );

  const [commentsBusy, setCommentsBusy] = React.useState(false);

  // ----- RELATED -----
  const [related, setRelated] = React.useState<any[]>(initialRelated ?? []);

  // ----- COMMENT FORM -----
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const bannerUrl = initialPost?.bannerImage?.url ?? null;

  // Helpers derived from meta (supports both “totalPages/hasPrev/hasNext” or “total”)
  const totalPages = React.useMemo(() => {
    const m = commentsMeta ?? {};
    if (typeof m.totalPages === "number") return m.totalPages;
    const total = typeof m.total === "number" ? m.total : undefined;
    const ps = typeof m.pageSize === "number" ? m.pageSize : pageSize;
    if (typeof total === "number" && ps > 0) return Math.max(1, Math.ceil(total / ps));
    return 1;
  }, [commentsMeta, pageSize]);

  const hasPrev = React.useMemo(() => {
    const m = commentsMeta ?? {};
    if (typeof m.hasPrev === "boolean") return m.hasPrev;
    return commentsPage > 1;
  }, [commentsMeta, commentsPage]);

  const hasNext = React.useMemo(() => {
    const m = commentsMeta ?? {};
    if (typeof m.hasNext === "boolean") return m.hasNext;
    return commentsPage < totalPages;
  }, [commentsMeta, commentsPage, totalPages]);

  async function fetchComments(page: number, nextPageSize = pageSize) {
    setCommentsBusy(true);
    try {
      const data = await publicFetchComments(slug, {
        page,
        pageSize: nextPageSize,
        sortBy: "createdAt",
        sortDir: "desc",
      });
      setComments(data.items ?? []);
      setCommentsMeta(data.meta ?? null);
      setCommentsPage(page);
      setPageSize(nextPageSize);
    } finally {
      setCommentsBusy(false);
    }
  }

  // Ensure we have meta even if SSR didn’t provide it (and avoid 200-size fetch)
  React.useEffect(() => {
    if (commentsMeta) return;
    fetchComments(1, DEFAULT_PAGE_SIZE).catch(() => {});
  }, [slug]);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      await publicCreateComment(slug, { name, email: email || null, comment });
      setName("");
      setEmail("");
      setComment("");

      // After posting, jump to page 1 to show newest comment (since sort desc)
      await fetchComments(1, pageSize);

      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to post comment");
    } finally {
      setBusy(false);
    }
  }

  // Fallback: if SSR didn’t pass related, fetch by category (first category)
  React.useEffect(() => {
    async function run() {
      if (related?.length) return;
      const catId = (initialPost?.categoryIds ?? [])?.[0];
      if (!catId) return;

      const qs = new URLSearchParams({
        page: "1",
        pageSize: "6",
        sortBy: "publishedAt",
        sortDir: "desc",
        categoryId: String(catId),
      });

      const res = await fetch(`/api/v1/blog?${qs.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      const items = (json?.data?.items ?? []).filter((p: any) => p?.slug && p.slug !== slug);
      setRelated(items.slice(0, 3));
    }
    run();
  }, [slug]); // keep as you had

  // Count views once per tab session
  React.useEffect(() => {
    // only count if the post is present + published
    if (!slug) return;
    if (initialPost?.status && String(initialPost.status) !== "PUBLISHED") return;

    const key = `npt_blog_viewed:${slug}`;
    try {
      if (typeof window === "undefined") return;

      // sessionStorage = once per tab session (good UX, avoids inflating on back/forward)
      const already = window.sessionStorage.getItem(key);
      if (already) return;

      window.sessionStorage.setItem(key, "1");
      publicCountView(slug);
    } catch {
      // if storage blocked, fall back to counting (rare)
      publicCountView(slug);
    }
  }, [slug]); // intentionally only on slug change

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-950" />
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Post banner"
              className="h-full w-full object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/25" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {initialPost?.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
            {initialPost?.author?.name ? <span>By {initialPost.author.name}</span> : null}
            {initialPost?.publishedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {fmtDate(initialPost.publishedAt)}
              </span>
            ) : null}
            {initialPost?.readingTimeMinutes ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {initialPost.readingTimeMinutes} min read
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div>
            <div className="rounded-[28px] border border-slate-200/70 bg-white p-7 shadow-sm">
              {initialPost?.excerpt ? (
                <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {initialPost.excerpt}
                </div>
              ) : null}

              <div className="prose max-w-none">
                <BlockNote
                  editable={false}
                  initialContent={(initialPost.body as PartialBlock[]) ?? []}
                />
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-900">Comments</div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {commentsMeta?.total ? <span>{commentsMeta.total} total</span> : null}
                  {commentsBusy ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      Loading…
                    </span>
                  ) : null}
                </div>
              </div>

              {err ? (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

              {/* Form */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Email (optional)
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment…"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-slate-900/5"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Be respectful. Your comment appears immediately.
                  </div>

                  <button
                    disabled={busy || !name.trim() || !comment.trim()}
                    onClick={submit}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {busy ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>

              {/* Thread */}
              <div className="mt-6">
                {comments.length ? (
                  <>
                    <div className="divide-y divide-slate-200">
                      {comments.map((c) => {
                        const initial = (c?.name?.trim?.()?.[0] || "U").toUpperCase();
                        return (
                          <div key={String(c.id)} className="py-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                {initial}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <div className="text-sm font-semibold text-slate-900">
                                    {c.name}
                                  </div>
                                  <div className="text-xs text-slate-500">•</div>
                                  <div className="text-xs text-slate-500">
                                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                  </div>
                                </div>

                                <div className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                                  {c.comment}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                        <button
                          type="button"
                          disabled={commentsBusy || !hasPrev}
                          onClick={() => fetchComments(Math.max(1, commentsPage - 1))}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="px-2 text-xs text-slate-600">
                          Page <span className="font-semibold text-slate-900">{commentsPage}</span>{" "}
                          of <span className="font-semibold text-slate-900">{totalPages}</span>
                        </div>

                        <button
                          type="button"
                          disabled={commentsBusy || !hasNext}
                          onClick={() => fetchComments(commentsPage + 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                    No comments yet. Be the first to share your thoughts.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT (sticky) */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-5">
              {/* About author */}
              <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">About the Author</div>

                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-8 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
                    <User2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {initialPost?.author?.name ?? "Author"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {initialPost?.author?.email ?? ""}
                    </div>
                    <div className="mt-3 text-sm text-slate-600">
                      Logistics professional sharing insights on transportation, cross-border supply
                      chains, and operational excellence.
                    </div>
                  </div>
                </div>
              </div>

              {/* Related */}
              <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Related Articles</div>

                <div className="mt-3 divide-y divide-slate-200">
                  {related.slice(0, 3).map((p: any) => (
                    <Link
                      key={String(p.id)}
                      href={`/blog/${encodeURIComponent(p.slug)}`}
                      className="block py-3 transition hover:opacity-80"
                    >
                      <div className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {p.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{fmtDate(p.publishedAt)}</div>
                    </Link>
                  ))}
                  {!related.length ? (
                    <div className="py-3 text-sm text-slate-500">No related articles.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
