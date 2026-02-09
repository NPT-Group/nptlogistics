"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";

import type { BlockNoteDocJSON, IBlogCategory, IBlogPost } from "@/types/blogPost.types";
import type { IFileAsset } from "@/types/shared.types";

import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "@/types/shared.types";
import { uploadToS3Presigned, type UploadResult } from "@/lib/utils/s3Helper";

import BlogPostSidebar from "@/components/admin/blog/BlogPostSidebar";
import { adminCreateCategory, adminFetchCategories } from "@/lib/utils/blog/adminBlogApi";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

const BlockNote = dynamic(() => import("@/components/BlockNote"), {
  ssr: false,
  loading: () => <div className="rounded-3xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm">Loading editor…</div>,
});

type SubmitPayload = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  body: BlockNoteDocJSON;
  bannerImage?: IFileAsset;
  categoryIds?: string[];
  publishedAt?: string | Date | null;
};

type SecondaryActionKind = "PUBLISH" | "UNPUBLISH";

type Props = {
  mode: "create" | "edit";

  headerTitle: string;
  headerSubtitle?: string;
  backHref: string;
  onBack: () => void;

  initial?: Partial<Pick<IBlogPost, "title" | "slug" | "excerpt" | "body" | "bannerImage" | "categoryIds" | "publishedAt" | "status">>;

  onSavePrimary: (payload: SubmitPayload) => Promise<void>;
  onSaveSecondary: (payload: SubmitPayload) => Promise<void>;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryActionKind: SecondaryActionKind;
  secondaryDisabled?: boolean;

  dangerLabel?: string;
  dangerDisabled?: boolean;
  dangerConfirmTitle?: string;
  dangerConfirmBody?: string;
  onDanger?: (payload: SubmitPayload) => Promise<void>;

  previewUrl?: string | null;
};

function fileToAsset(r: UploadResult): IFileAsset {
  return {
    url: r.url,
    s3Key: r.s3Key,
    mimeType: r.mimeType,
    sizeBytes: r.sizeBytes,
    originalName: r.originalName,
  };
}

async function uploadBlogMediaToTemp(file: File): Promise<UploadResult> {
  const mt = (file.type || "").toLowerCase();
  const folder = mt.startsWith("image/") ? ES3Folder.BLOG_MEDIA_IMAGES : mt.startsWith("video/") ? ES3Folder.BLOG_MEDIA_VIDEOS : null;

  if (!folder) throw new Error(`Unsupported upload type: ${file.type || "(missing mime type)"}`);

  const allowedMimeTypes = folder === ES3Folder.BLOG_MEDIA_IMAGES ? IMAGE_MIME_TYPES : VIDEO_MIME_TYPES;

  return uploadToS3Presigned({
    file,
    namespace: ES3Namespace.BLOG_POSTS,
    folder,
    allowedMimeTypes,
    maxSizeMB: folder === ES3Folder.BLOG_MEDIA_VIDEOS ? 250 : 25,
  });
}

async function uploadBannerToTemp(file: File): Promise<IFileAsset> {
  if (!file.type.toLowerCase().startsWith("image/")) throw new Error("Banner must be an image.");

  const up = await uploadToS3Presigned({
    file,
    namespace: ES3Namespace.BLOG_POSTS,
    folder: ES3Folder.BLOG_MEDIA_IMAGES,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeMB: 10,
  });

  return fileToAsset(up);
}

function ChangePill({ saving, isDirty }: { saving: boolean; isDirty: boolean }) {
  const base = "rounded-full border px-3 py-1 text-xs shadow-sm";
  if (saving) {
    return (
      <div className={cn(base, "border-gray-200 bg-white text-gray-600")}>
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
        Saving…
      </div>
    );
  }
  if (isDirty) {
    return (
      <div className={cn(base, "border-amber-200 bg-amber-50 text-amber-700")}>
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
        Unsaved changes
      </div>
    );
  }
  return (
    <div className={cn(base, "border-emerald-200 bg-emerald-50 text-emerald-700")}>
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
      All changes saved
    </div>
  );
}

export default function BlogEditor(props: Props) {
  const [doc, setDoc] = React.useState<PartialBlock[] | null>((props.initial?.body as any) ?? null);

  const [title, setTitle] = React.useState(props.initial?.title ?? "");
  const [slug, setSlug] = React.useState(props.initial?.slug ?? "");
  const [excerpt, setExcerpt] = React.useState((props.initial?.excerpt as any) ?? "");

  const [publishedAt, setPublishedAt] = React.useState(() => {
    const v = props.initial?.publishedAt as any;
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [bannerImage, setBannerImage] = React.useState<IFileAsset | undefined>(props.initial?.bannerImage as any);

  const [categories, setCategories] = React.useState<IBlogCategory[]>([]);
  const [categoryIds, setCategoryIds] = React.useState<string[]>(Array.isArray(props.initial?.categoryIds) ? (props.initial!.categoryIds as any).map(String) : []);
  const [categorySearch, setCategorySearch] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const baselineRef = React.useRef<string>("");

  const currentSnapshot = React.useMemo(() => {
    return JSON.stringify({
      title,
      slug,
      excerpt,
      publishedAt,
      bannerImage: bannerImage
        ? {
            url: bannerImage.url,
            s3Key: bannerImage.s3Key,
            mimeType: bannerImage.mimeType,
            sizeBytes: bannerImage.sizeBytes,
            originalName: bannerImage.originalName,
          }
        : null,
      categoryIds: [...categoryIds].sort(),
      doc: doc ?? null,
    });
  }, [title, slug, excerpt, publishedAt, bannerImage, categoryIds, doc]);

  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    if (!baselineRef.current) baselineRef.current = currentSnapshot;
  }, [currentSnapshot]);

  React.useEffect(() => {
    if (!baselineRef.current) return;
    setIsDirty(currentSnapshot !== baselineRef.current);
  }, [currentSnapshot]);

  function markSavedNow() {
    baselineRef.current = currentSnapshot;
    setIsDirty(false);
  }

  async function refreshCategories() {
    const items = await adminFetchCategories();
    setCategories(items);
  }

  React.useEffect(() => {
    refreshCategories().catch((e) => setError(e?.message || "Failed to load categories"));
  }, []);

  async function onCreateCategory(name: string) {
    const created = await adminCreateCategory(name);
    await refreshCategories();
    setCategoryIds((prev) => (prev.includes(String(created.id)) ? prev : [...prev, String(created.id)]));
  }

  async function onPickBanner(file: File) {
    setError(null);
    const asset = await uploadBannerToTemp(file);
    setBannerImage(asset);
  }

  function onRemoveBanner() {
    setBannerImage(undefined);
  }

  function coerceBody(): BlockNoteDocJSON {
    return (doc ?? []) as unknown as BlockNoteDocJSON;
  }

  function publishedAtToApiValue(): string | null {
    const v = publishedAt?.trim();
    if (!v) return null;
    return v;
  }

  function buildPayload(): SubmitPayload {
    const t = title.trim();
    if (!t) throw new Error("Title is required.");
    if (!doc) throw new Error("Body is required.");

    return {
      title: t,
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      body: coerceBody(),
      bannerImage,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      publishedAt: publishedAtToApiValue(),
    };
  }

  async function runAction(fn: (p: SubmitPayload) => Promise<void>) {
    setError(null);
    setSaving(true);
    try {
      const payload = buildPayload();
      await fn(payload);
      markSavedNow();
    } catch (e: any) {
      setError(e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function runDanger() {
    if (!props.onDanger) return;

    const title = props.dangerConfirmTitle ?? "Archive this post?";
    const body = props.dangerConfirmBody ?? "This will archive the post and remove it from public listings. You can publish again later to restore it.";

    const ok = window.confirm(`${title}\n\n${body}`);
    if (!ok) return;

    await runAction(props.onDanger);
  }

  const publishAtEnabled = props.secondaryActionKind === "PUBLISH";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-gray-200/70 bg-white/75 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-2xl font-semibold tracking-tight text-gray-900">{props.headerTitle}</div>
                {props.headerSubtitle ? <div className="mt-1 truncate text-sm text-gray-500">{props.headerSubtitle}</div> : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden lg:block">
                <ChangePill saving={saving} isDirty={isDirty} />
              </div>

              {props.previewUrl ? (
                <button
                  type="button"
                  onClick={() => window.open(props.previewUrl!, "_blank", "noopener,noreferrer")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition",
                    "hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-4 focus:ring-gray-900/5",
                  )}
                  title="Preview public page"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </button>
              ) : null}

              <button
                type="button"
                onClick={props.onBack}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition",
                  "hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-4 focus:ring-gray-900/5",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </button>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <ChangePill saving={saving} isDirty={isDirty} />
          </div>

          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Editor */}
          <section className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200/70 bg-gradient-to-b from-gray-50/80 to-white px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-gray-900">Content</div>
                <div className="mt-0.5 text-xs text-gray-500">Use “+” in the editor to add blocks.</div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="p-4">
                  <BlockNote onChange={setDoc} uploadFile={uploadBlogMediaToTemp} initialContent={doc ?? undefined} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">Tip: ⌘/Ctrl + K for links</span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">Paste images/videos to upload</span>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <BlogPostSidebar
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
            publishedAt={publishedAt}
            setPublishedAt={setPublishedAt}
            publishAtEnabled={publishAtEnabled}
            bannerImage={bannerImage}
            onPickBanner={onPickBanner}
            onRemoveBanner={onRemoveBanner}
            categories={categories}
            categoryIds={categoryIds}
            setCategoryIds={setCategoryIds}
            categorySearch={categorySearch}
            setCategorySearch={setCategorySearch}
            onCreateCategory={onCreateCategory}
            saving={saving}
            primaryLabel={props.primaryLabel}
            secondaryLabel={props.secondaryLabel}
            secondaryDisabled={props.secondaryDisabled}
            onPrimary={() => runAction(props.onSavePrimary)}
            onSecondary={() => runAction(props.onSaveSecondary)}
            dangerLabel={props.dangerLabel}
            dangerDisabled={props.dangerDisabled}
            onDanger={props.onDanger ? runDanger : undefined}
          />
        </div>
      </div>
    </div>
  );
}
