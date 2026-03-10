// src/app/(admin)/components/blog/BlogPostSidebar.tsx
"use client";

import * as React from "react";
import type { IBlogCategory } from "@/types/blogPost.types";
import type { IFileAsset } from "@/types/shared.types";
import { cn } from "@/lib/cn";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";
import { Checkbox } from "@/app/(admin)/components/ui/Checkbox";
import { SoftButton } from "@/app/(admin)/components/ui/Buttons";
import {
  Settings2,
  Type,
  Link2,
  AlignLeft,
  CalendarClock,
  Image as ImageIcon,
  Tags,
  Plus,
  Trash2,
  Upload,
  Save,
  Rocket,
  Archive,
  Search,
} from "lucide-react";

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

  primaryLabel: string;
  secondaryLabel: string;
  secondaryDisabled?: boolean;
  onPrimary: () => Promise<void>;
  onSecondary: () => Promise<void>;

  dangerLabel?: string;
  dangerDisabled?: boolean;
  onDanger?: () => void;
};

const inputBase = cn(
  "w-full rounded-2xl border px-3 py-2 text-sm outline-none transition",
  "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)] placeholder:text-[var(--dash-muted)]",
  "focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
);

const softCard = cn(
  "rounded-3xl border shadow-[var(--dash-shadow)]/14",
  "border-[var(--dash-border)] bg-[var(--dash-surface)]",
);

function Divider() {
  return <div className="h-px w-full bg-[var(--dash-border)]/80" />;
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--dash-muted)] uppercase">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function BlogPostSidebar(props: Props) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const [newCatName, setNewCatName] = React.useState("");

  const filteredCats = React.useMemo(() => {
    const q = props.categorySearch.trim().toLowerCase();
    if (!q) return props.categories;
    return props.categories.filter((c) => `${c.name} ${c.slug}`.toLowerCase().includes(q));
  }, [props.categories, props.categorySearch]);

  function toggleCategory(id: string) {
    if (props.categoryIds.includes(id))
      props.setCategoryIds(props.categoryIds.filter((x) => x !== id));
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
    <aside
      className={cn(
        "sticky top-6 h-[calc(100vh-3rem)] overflow-auto rounded-3xl border shadow-[var(--dash-shadow)]",
        "border-[var(--dash-border)] bg-[var(--dash-surface)]",
      )}
    >
      {/* top bar */}
      <div
        className={cn(
          "sticky top-0 z-10 border-b px-5 py-4 backdrop-blur",
          "border-[var(--dash-border)] bg-[var(--dash-surface)]/80",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
              "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
            )}
          >
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--dash-text)]">Post settings</div>
            <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
              Details, banner, categories.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Basics */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<Type className="h-4 w-4" />} label="Basics" />
          <div className="mt-3 space-y-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                <Type className="h-3.5 w-3.5" /> Title
              </div>
              <input
                value={props.title}
                onChange={(e) => props.setTitle(e.target.value)}
                placeholder="Post title"
                className={inputBase}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                <Link2 className="h-3.5 w-3.5" /> Slug
              </div>
              <input
                value={props.slug}
                onChange={(e) => props.setSlug(e.target.value)}
                placeholder="auto-generated if empty"
                className={inputBase}
              />
              <div className="mt-1 text-[11px] text-[var(--dash-muted)]">
                Leave blank to generate from title.
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                <AlignLeft className="h-3.5 w-3.5" /> Excerpt
              </div>
              <textarea
                value={props.excerpt}
                onChange={(e) => props.setExcerpt(e.target.value)}
                placeholder="Short summary (optional)"
                rows={4}
                className={cn(inputBase, "resize-none")}
              />
            </div>
          </div>
        </section>

        {/* Publishing */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<CalendarClock className="h-4 w-4" />} label="Publishing" />
          <div className="mt-3">
            <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">
              Publish at (optional)
            </div>
            <input
              type="datetime-local"
              value={props.publishedAt}
              onChange={(e) => props.setPublishedAt(e.target.value)}
              className={cn(inputBase, !props.publishAtEnabled ? "opacity-60" : "")}
              disabled={!props.publishAtEnabled}
            />
            <div
              className={cn(
                "mt-2 rounded-2xl border px-3 py-2 text-[12px]",
                "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-muted)]",
              )}
            >
              {props.publishAtEnabled ? (
                <>
                  Used only when you click{" "}
                  <span className="font-semibold text-[var(--dash-text)]">
                    {props.secondaryLabel}
                  </span>
                  .
                </>
              ) : (
                <>
                  Disabled because{" "}
                  <span className="font-semibold text-[var(--dash-text)]">
                    {props.secondaryLabel}
                  </span>{" "}
                  does not use a publish date.
                </>
              )}
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<ImageIcon className="h-4 w-4" />} label="Banner" />

          <div className="mt-3">
            {props.bannerImage?.url ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-3xl border border-[var(--dash-border)]">
                  <img
                    src={props.bannerImage.url}
                    alt="banner"
                    className="h-44 w-full object-cover"
                  />
                </div>

                <SoftButton
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Remove banner"
                  disabled={props.saving}
                  onClick={props.onRemoveBanner}
                />
              </div>
            ) : (
              <label
                className={cn(
                  "group block cursor-pointer rounded-3xl border border-dashed p-4 text-sm transition",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-muted)] hover:bg-[var(--dash-surface-2)]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-semibold text-[var(--dash-text)]">
                      <Upload className="h-4 w-4" />
                      Upload banner
                    </div>
                    <div className="mt-1 text-xs text-[var(--dash-muted)]">
                      PNG/JPG/WebP. Recommended wide image.
                    </div>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 rounded-2xl border px-3 py-1.5 text-xs shadow-[var(--dash-shadow)]/12 transition",
                      "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)] group-hover:bg-[var(--dash-surface-2)]",
                    )}
                  >
                    Choose
                  </div>
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
          </div>
        </section>

        {/* Categories */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<Tags className="h-4 w-4" />} label="Categories" />

          <div className="relative mt-3">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--dash-muted)]" />
            <input
              value={props.categorySearch}
              onChange={(e) => props.setCategorySearch(e.target.value)}
              placeholder="Search categories…"
              className={cn(inputBase, "pl-9")}
            />
          </div>

          <div
            className={cn(
              "mt-3 max-h-48 overflow-auto rounded-3xl border p-2",
              "border-[var(--dash-border)] bg-[var(--dash-bg)]",
            )}
          >
            {filteredCats.length ? (
              <div className="space-y-1">
                {filteredCats.map((c) => {
                  const id = String(c.id);
                  const checked = props.categoryIds.includes(id);

                  return (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl px-2.5 py-2 transition",
                        checked ? "bg-[var(--dash-surface)]" : "hover:bg-[var(--dash-surface-2)]",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleCategory(id)}
                        label={`Category ${c.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleCategory(id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <span className="truncate text-sm font-medium text-[var(--dash-text)]">
                          {c.name}
                        </span>
                        <span className="ml-auto shrink-0 text-[11px] text-[var(--dash-muted)]">
                          {c.slug}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-sm text-[var(--dash-muted)]">No categories found.</div>
            )}
          </div>

          <Divider />

          <div className="mt-3 flex gap-2">
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name"
              className={inputBase}
            />
            <button
              type="button"
              onClick={createCategory}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                "bg-[var(--dash-red)] text-white hover:brightness-110",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
              )}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </section>

        {/* Actions */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<Rocket className="h-4 w-4" />} label="Actions" />

          <div className="mt-3 space-y-2">
            <button
              type="button"
              disabled={props.saving}
              onClick={props.onPrimary}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                "disabled:opacity-50",
              )}
            >
              <Save className="h-4 w-4 text-[var(--dash-muted)]" />
              {props.primaryLabel}
            </button>

            <button
              type="button"
              disabled={props.saving || props.secondaryDisabled}
              onClick={props.onSecondary}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                "bg-[var(--dash-red)] text-white hover:brightness-110",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                "disabled:opacity-50",
              )}
            >
              <Rocket className="h-4 w-4" />
              {props.secondaryLabel}
            </button>

            {showDanger ? (
              <>
                <Divider />
                <button
                  type="button"
                  disabled={props.saving || props.dangerDisabled}
                  onClick={() => props.onDanger?.()}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                    isDark
                      ? "border border-red-500/25 bg-red-600/15 text-red-50 hover:bg-red-600/20"
                      : "border border-red-200 bg-red-50 text-red-900 hover:bg-red-100",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30",
                    "disabled:opacity-50",
                  )}
                >
                  <Archive className="h-4 w-4" />
                  {props.dangerLabel}
                </button>
                <div className="pt-1 text-center text-[11px] text-[var(--dash-muted)]">
                  Archived posts won’t show publicly.
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </aside>
  );
}
