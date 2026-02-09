"use client";

import * as React from "react";
import type { IBlogCategory } from "@/types/blogPost.types";
import type { IFileAsset } from "@/types/shared.types";
import { cn } from "@/lib/utils/cn";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  slug: string;
  setSlug: (v: string) => void;

  excerpt: string;
  setExcerpt: (v: string) => void;

  publishedAt: string;
  setPublishedAt: (v: string) => void;

  publishAtEnabled: boolean;

  bannerImage?: IFileAsset;
  onPickBanner: (file: File) => Promise<void>;
  onRemoveBanner: () => void;

  categories: IBlogCategory[];
  categoryIds: string[];
  setCategoryIds: (ids: string[]) => void;

  categorySearch: string;
  setCategorySearch: (v: string) => void;

  onCreateCategory: (name: string) => Promise<void>;

  saving?: boolean;

  // actions
  primaryLabel: string;
  secondaryLabel: string;
  secondaryDisabled?: boolean;
  onPrimary: () => Promise<void>;
  onSecondary: () => Promise<void>;

  // optional danger action (archive)
  dangerLabel?: string;
  dangerDisabled?: boolean;
  onDanger?: () => Promise<void>;
};

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition " +
  "focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-900/5";

const softCard = "rounded-2xl border border-gray-200/70 bg-white shadow-sm";

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;
}

export default function BlogPostSidebar(props: Props) {
  const [newCatName, setNewCatName] = React.useState("");

  const filteredCats = React.useMemo(() => {
    const q = props.categorySearch.trim().toLowerCase();
    if (!q) return props.categories;
    return props.categories.filter((c) => `${c.name} ${c.slug}`.toLowerCase().includes(q));
  }, [props.categories, props.categorySearch]);

  function toggleCategory(id: string) {
    if (props.categoryIds.includes(id)) props.setCategoryIds(props.categoryIds.filter((x) => x !== id));
    else props.setCategoryIds([...props.categoryIds, id]);
  }

  async function createCategory() {
    const name = newCatName.trim();
    if (!name) return;
    await props.onCreateCategory(name);
    setNewCatName("");
  }

  const showDanger = !!props.dangerLabel && !!props.onDanger;

  return (
    <aside className="sticky top-6 h-[calc(100vh-3rem)] overflow-auto rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 border-b border-gray-200/70 bg-white/75 px-5 py-4 backdrop-blur">
        <div>
          <div className="text-sm font-semibold text-gray-900">Post settings</div>
          <div className="mt-0.5 text-xs text-gray-500">Details, banner, categories.</div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Basics */}
        <section className={cn(softCard, "p-4")}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Basics</div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 text-xs font-medium text-gray-500">Title</div>
              <input value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="Post title" className={inputBase} />
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-gray-500">Slug</div>
              <input value={props.slug} onChange={(e) => props.setSlug(e.target.value)} placeholder="auto-generated if empty" className={inputBase} />
              <div className="mt-1 text-[11px] text-gray-400">Leave blank to generate from title.</div>
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-gray-500">Excerpt</div>
              <textarea value={props.excerpt} onChange={(e) => props.setExcerpt(e.target.value)} placeholder="Short summary (optional)" rows={4} className={cn(inputBase, "resize-none")} />
            </div>
          </div>
        </section>

        {/* Publish */}
        <section className={cn(softCard, "p-4")}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Publishing</div>

          <div>
            <div className="mb-1 text-xs font-medium text-gray-500">Publish at (optional)</div>
            <input
              type="datetime-local"
              value={props.publishedAt}
              onChange={(e) => props.setPublishedAt(e.target.value)}
              className={cn(inputBase, !props.publishAtEnabled ? "opacity-60" : "")}
              disabled={!props.publishAtEnabled}
            />
            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] text-gray-600">
              {props.publishAtEnabled ? (
                <>
                  Used only when you click <span className="font-medium text-gray-800">{props.secondaryLabel}</span>.
                </>
              ) : (
                <>
                  Disabled because <span className="font-medium text-gray-800">{props.secondaryLabel}</span> does not use a publish date.
                </>
              )}
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className={cn(softCard, "p-4")}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Banner</div>

          {props.bannerImage?.url ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <img src={props.bannerImage.url} alt="banner" className="h-40 w-full object-cover" />
              </div>

              <button
                type="button"
                onClick={props.onRemoveBanner}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
              >
                Remove banner
              </button>
            </div>
          ) : (
            <label className="group block cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white px-4 py-4 text-sm text-gray-600 transition hover:border-gray-400">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">Upload banner</div>
                  <div className="mt-0.5 text-xs text-gray-500">PNG/JPG/WebP. Recommended wide image.</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm transition group-hover:shadow">Choose</div>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (!f) return;
                  await props.onPickBanner(f);
                }}
              />
            </label>
          )}
        </section>

        {/* Categories */}
        <section className={cn(softCard, "p-4")}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Categories</div>

          <input value={props.categorySearch} onChange={(e) => props.setCategorySearch(e.target.value)} placeholder="Search categories…" className={cn(inputBase, "mb-3")} />

          <div className="max-h-44 overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-2">
            {filteredCats.length ? (
              <div className="space-y-1">
                {filteredCats.map((c) => {
                  const checked = props.categoryIds.includes(String(c.id));
                  return (
                    <label key={String(c.id)} className={cn("flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition", checked ? "bg-white shadow-sm" : "hover:bg-white/70")}>
                      <input type="checkbox" checked={checked} onChange={() => toggleCategory(String(c.id))} />
                      <span className="text-gray-800">{c.name}</span>
                      <span className="ml-auto text-[11px] text-gray-400">{c.slug}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500">No categories found.</div>
            )}
          </div>

          <Divider />

          <div className="mt-3 flex gap-2">
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="New category name" className={inputBase} />
            <button type="button" onClick={createCategory} className="shrink-0 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 hover:shadow">
              Add
            </button>
          </div>
        </section>

        {/* Actions */}
        <section className={cn(softCard, "p-4")}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={props.saving}
              onClick={props.onPrimary}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:opacity-50"
            >
              {props.primaryLabel}
            </button>

            <button
              type="button"
              disabled={props.saving || props.secondaryDisabled}
              onClick={props.onSecondary}
              className="w-full rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
            >
              {props.secondaryLabel}
            </button>

            {showDanger ? (
              <>
                <Divider />
                <button
                  type="button"
                  disabled={props.saving || props.dangerDisabled}
                  onClick={() => props.onDanger?.()}
                  className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100 hover:shadow disabled:opacity-50"
                >
                  {props.dangerLabel}
                </button>
                <div className="pt-1 text-center text-[11px] text-gray-400">Archived posts won’t show publicly.</div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </aside>
  );
}
