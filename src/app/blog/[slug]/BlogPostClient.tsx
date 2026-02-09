// src/app/blog/[slug]/BlogPostClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";
import { ArrowLeft, Calendar, Clock, User2 } from "lucide-react";
import { publicCreateComment, publicFetchComments } from "@/lib/utils/blog/publicBlogApi";

const BlockNote = dynamic(() => import("@/components/BlockNote"), { ssr: false });

function fmtDate(d?: any) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function BlogPostClient({ slug, initialPost, initialComments, initialRelated = [] }: { slug: string; initialPost: any; initialComments: any[]; initialRelated?: any[] }) {
  const router = useRouter();
  const [comments, setComments] = React.useState<any[]>(initialComments ?? []);
  const [related, setRelated] = React.useState<any[]>(initialRelated ?? []);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const bannerUrl = initialPost?.bannerImage?.url ?? null;

  async function refresh() {
    const data = await publicFetchComments(slug);
    setComments(data.items);
  }

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      await publicCreateComment(slug, { name, email: email || null, comment });
      setName("");
      setEmail("");
      setComment("");
      await refresh();
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
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-950" />
          {bannerUrl ? <img src={bannerUrl} alt="Post banner" className="h-full w-full object-cover opacity-40" /> : null}
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

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{initialPost?.title}</h1>

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
              {initialPost?.excerpt ? <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{initialPost.excerpt}</div> : null}

              <div className="prose max-w-none">
                <BlockNote editable={false} initialContent={(initialPost.body as PartialBlock[]) ?? []} />
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">Comments</div>

              {err ? <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div> : null}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name *"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-900/5"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-900/5"
                />
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                rows={4}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-900/5"
              />

              <button
                disabled={busy || !name.trim() || !comment.trim()}
                onClick={submit}
                className="mt-3 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
              >
                Post comment
              </button>

              <div className="mt-6 space-y-3">
                {comments.map((c) => (
                  <div key={String(c.id)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                      <div className="shrink-0 text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{c.comment}</div>
                  </div>
                ))}
                {!comments.length ? <div className="text-sm text-slate-500">No comments yet.</div> : null}
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
                    <div className="text-sm font-semibold text-slate-900">{initialPost?.author?.name ?? "Author"}</div>
                    <div className="mt-1 text-xs text-slate-500">{initialPost?.author?.email ?? ""}</div>
                    <div className="mt-3 text-sm text-slate-600">Logistics professional sharing insights on transportation, cross-border supply chains, and operational excellence.</div>
                  </div>
                </div>
              </div>

              {/* Related */}
              <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Related Articles</div>

                <div className="mt-3 divide-y divide-slate-200">
                  {related.slice(0, 3).map((p: any) => (
                    <Link key={String(p.id)} href={`/blog/${encodeURIComponent(p.slug)}`} className="block py-3 transition hover:opacity-80">
                      <div className="text-sm font-semibold text-slate-900 line-clamp-2">{p.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{fmtDate(p.publishedAt)}</div>
                    </Link>
                  ))}
                  {!related.length ? <div className="py-3 text-sm text-slate-500">No related articles.</div> : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
