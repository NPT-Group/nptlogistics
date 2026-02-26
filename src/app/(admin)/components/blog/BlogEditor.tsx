// src/app/(admin)/components/blog/BlogEditor.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";

import type { IBlogCategory, IBlogPost } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";

import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "@/types/shared.types";
import { uploadToS3Presigned, type UploadResult } from "@/lib/utils/s3Helper";

import BlogPostSidebar from "@/app/(admin)/components/blog/BlogPostSidebar";
import { adminCreateCategory, adminFetchCategories } from "@/lib/utils/blog/adminBlogApi";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";

import { ConfirmModal, type ConfirmTone } from "@/app/(admin)/components/ui/ConfirmModal";
import { SoftButton } from "@/app/(admin)/components/ui/Buttons";
import { ExternalLink, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import BlockNoteSkeleton from "@/components/blocknote/BlockNoteSkeleton";

const BlockNote = dynamic(() => import("@/components/blocknote/BlockNote"), {
  ssr: false,
  loading: () => (
    <BlockNoteSkeleton
      variant="admin"
      paddingClassName="p-5"
      heightClassName="min-h-[520px]"
      lines={12}
      showToolbar={true}
      showTitleLine={false}
      className="rounded-3xl"
    />
  ),
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

  initial?: Partial<
    Pick<
      IBlogPost,
      | "title"
      | "slug"
      | "excerpt"
      | "body"
      | "bannerImage"
      | "categoryIds"
      | "publishedAt"
      | "status"
    >
  >;

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
  const folder = mt.startsWith("image/")
    ? ES3Folder.MEDIA_IMAGES
    : mt.startsWith("video/")
      ? ES3Folder.MEDIA_VIDEOS
      : null;

  if (!folder) throw new Error(`Unsupported upload type: ${file.type || "(missing mime type)"}`);

  const allowedMimeTypes = folder === ES3Folder.MEDIA_IMAGES ? IMAGE_MIME_TYPES : VIDEO_MIME_TYPES;

  return uploadToS3Presigned({
    file,
    namespace: ES3Namespace.BLOG_POSTS,
    folder,
    allowedMimeTypes,
    maxSizeMB: folder === ES3Folder.MEDIA_VIDEOS ? 250 : 25,
  });
}

async function uploadBannerToTemp(file: File): Promise<IFileAsset> {
  if (!file.type.toLowerCase().startsWith("image/")) throw new Error("Banner must be an image.");

  const up = await uploadToS3Presigned({
    file,
    namespace: ES3Namespace.BLOG_POSTS,
    folder: ES3Folder.MEDIA_IMAGES,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeMB: 10,
  });

  return fileToAsset(up);
}

function ChangePill({ saving, isDirty }: { saving: boolean; isDirty: boolean }) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const base = "rounded-full border px-3 py-1 text-xs font-medium shadow-[var(--dash-shadow)]/10";

  if (saving) {
    return (
      <div
        className={cn(
          base,
          isDark
            ? "border-white/10 bg-white/5 text-white/70"
            : "border-gray-200 bg-gray-100 text-gray-700",
        )}
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-70" />
        Saving…
      </div>
    );
  }

  if (isDirty) {
    return (
      <div
        className={cn(
          base,
          isDark
            ? "border-amber-400/25 bg-amber-400/15 text-amber-100"
            : "border-amber-300 bg-amber-100 text-amber-800",
        )}
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
        Unsaved changes
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        isDark
          ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-100"
          : "border-emerald-300 bg-emerald-100 text-emerald-800",
      )}
    >
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      All changes saved
    </div>
  );
}

export default function BlogEditor(props: Props) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

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
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes(),
    )}`;
  });

  const [bannerImage, setBannerImage] = React.useState<IFileAsset | undefined>(
    props.initial?.bannerImage as any,
  );

  const [categories, setCategories] = React.useState<IBlogCategory[]>([]);
  const [categoryIds, setCategoryIds] = React.useState<string[]>(
    Array.isArray(props.initial?.categoryIds)
      ? (props.initial!.categoryIds as any).map(String)
      : [],
  );
  const [categorySearch, setCategorySearch] = React.useState("");

  const [saving, setSaving] = React.useState(false);

  const [error, setError] = React.useState<{ message: string; nonce: number } | null>(null);
  const [success, setSuccess] = React.useState<{ message: string; nonce: number } | null>(null);

  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const errorRef = React.useRef<HTMLDivElement | null>(null);
  const successRef = React.useRef<HTMLDivElement | null>(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      headerRef.current?.focus?.();
    });
  }

  // Confirm modal (used for secondary + danger)
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmActionRef = React.useRef<null | (() => Promise<void>)>(null);
  const [confirmTone, setConfirmTone] = React.useState<ConfirmTone>("danger");
  const [confirmTitle, setConfirmTitle] = React.useState("");
  const [confirmDesc, setConfirmDesc] = React.useState<React.ReactNode>(null);
  const [confirmLabel, setConfirmLabel] = React.useState("Confirm");

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
    refreshCategories().catch((e) =>
      setError({ message: e?.message || "Failed to load categories", nonce: Date.now() }),
    );
  }, []);

  React.useEffect(() => {
    if (!error) return;
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      (errorRef.current as any)?.focus?.();
    });
  }, [error?.nonce]);

  React.useEffect(() => {
    if (!success) return;
    scrollToTop();
  }, [success?.nonce]);

  React.useEffect(() => {
    if (!success) return;
    if (isDirty) setSuccess(null);
  }, [isDirty]);

  async function onCreateCategory(name: string) {
    setError(null);
    setSuccess(null);
    const created = await adminCreateCategory(name);
    await refreshCategories();
    setCategoryIds((prev) =>
      prev.includes(String(created.id)) ? prev : [...prev, String(created.id)],
    );
  }

  async function onPickBanner(file: File) {
    setError(null);
    setSuccess(null);
    const asset = await uploadBannerToTemp(file);
    setBannerImage(asset);
  }

  function onRemoveBanner() {
    setSuccess(null);
    setError(null);
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

  async function runAction(fn: (p: SubmitPayload) => Promise<void>, successMessage: string) {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const payload = buildPayload();
      await fn(payload);
      markSavedNow();

      setSuccess({ message: successMessage, nonce: Date.now() });
      requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (e: any) {
      setError({ message: e?.message || "Failed to save.", nonce: Date.now() });
    } finally {
      setSaving(false);
    }
  }

  async function confirmSecondary(): Promise<void> {
    if (props.secondaryDisabled) return;

    const isPublish = props.secondaryActionKind === "PUBLISH";
    const tone: ConfirmTone = isPublish ? "neutral" : "danger";

    const title = isPublish ? "Publish this post?" : "Unpublish this post?";
    const body = isPublish
      ? "This will make the post publicly visible."
      : "This will remove the post from public listings.";

    const successMsg = isPublish ? "Post published." : "Post unpublished.";

    confirmActionRef.current = async () => runAction(props.onSaveSecondary, successMsg);

    setConfirmTone(tone);
    setConfirmTitle(title);
    setConfirmDesc(body);
    setConfirmLabel(props.secondaryLabel);
    setConfirmOpen(true);
  }

  function confirmDanger() {
    if (!props.onDanger) return;

    const title = props.dangerConfirmTitle ?? "Archive this post?";
    const body =
      props.dangerConfirmBody ??
      "This will archive the post and remove it from public listings. You can publish again later to restore it.";

    confirmActionRef.current = async () => runAction(props.onDanger!, "Post archived.");

    setConfirmTone("danger");
    setConfirmTitle(title);
    setConfirmDesc(body);
    setConfirmLabel(props.dangerLabel ?? "Archive");
    setConfirmOpen(true);
  }

  const publishAtEnabled = props.secondaryActionKind === "PUBLISH";

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      {/* subtle admin backdrop */}
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
        busy={saving}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          const act = confirmActionRef.current;
          setConfirmOpen(false);
          if (!act) return;
          act().catch((e: any) =>
            setError({ message: e?.message || "Failed.", nonce: Date.now() }),
          );
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div
          ref={headerRef}
          tabIndex={-1}
          className={cn(
            "mb-6 rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                    "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                  )}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                    {props.headerTitle}
                  </div>
                  {props.headerSubtitle ? (
                    <div className="mt-1 truncate text-sm text-[var(--dash-muted)]">
                      {props.headerSubtitle}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden lg:block">
                  <ChangePill saving={saving} isDirty={isDirty} />
                </div>

                {props.previewUrl ? (
                  <SoftButton
                    icon={<ExternalLink className="h-4 w-4" />}
                    label="Preview"
                    disabled={saving}
                    onClick={() => window.open(props.previewUrl!, "_blank", "noopener,noreferrer")}
                  />
                ) : null}
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              <ChangePill saving={saving} isDirty={isDirty} />
            </div>

            {success ? (
              <div
                ref={successRef}
                className={cn(
                  "mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm",
                  isDark
                    ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-50"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900",
                )}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <div className="flex-1">{success.message}</div>
              </div>
            ) : null}

            {error ? (
              <div
                ref={errorRef}
                tabIndex={-1}
                className={cn(
                  "mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm",
                  isDark
                    ? "border-red-500/25 bg-red-600/15 text-red-50"
                    : "border-red-200 bg-red-50 text-red-900",
                )}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div className="flex-1">{error.message}</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
          {/* Editor */}
          <section
            className={cn(
              "overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
              "border-[var(--dash-border)] bg-[var(--dash-surface)]",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between border-b px-5 py-4",
                "border-[var(--dash-border)] bg-[var(--dash-surface)]",
              )}
            >
              <div>
                <div className="text-sm font-semibold text-[var(--dash-text)]">Content</div>
                <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
                  Use “+” in the editor to add blocks.
                </div>
              </div>
            </div>

            <div className="p-5">
              <BlockNote
                onChange={(v: any) => {
                  setSuccess(null);
                  setError(null);
                  setDoc(v);
                }}
                uploadFile={uploadBlogMediaToTemp}
                initialContent={doc ?? undefined}
                chrome={{
                  borderColor: "var(--dash-border)",
                  background: isDark ? "rgba(255,255,255,0.04)" : "white",
                  className: "rounded-3xl border p-2 sm:p-4 shadow-[var(--dash-shadow)]/12",
                }}
              />

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--dash-muted)]">
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-bg)] px-2.5 py-1">
                  Tip: ⌘/Ctrl + K for links
                </span>
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-bg)] px-2.5 py-1">
                  Paste images/videos to upload
                </span>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <BlogPostSidebar
            title={title}
            setTitle={(v) => {
              setSuccess(null);
              setError(null);
              setTitle(v);
            }}
            slug={slug}
            setSlug={(v) => {
              setSuccess(null);
              setError(null);
              setSlug(v);
            }}
            excerpt={excerpt}
            setExcerpt={(v) => {
              setSuccess(null);
              setError(null);
              setExcerpt(v);
            }}
            publishedAt={publishedAt}
            setPublishedAt={(v) => {
              setSuccess(null);
              setError(null);
              setPublishedAt(v);
            }}
            publishAtEnabled={publishAtEnabled}
            bannerImage={bannerImage}
            onPickBanner={onPickBanner}
            onRemoveBanner={onRemoveBanner}
            categories={categories}
            categoryIds={categoryIds}
            setCategoryIds={(ids) => {
              setSuccess(null);
              setError(null);
              setCategoryIds(ids);
            }}
            categorySearch={categorySearch}
            setCategorySearch={(v) => {
              setSuccess(null);
              setError(null);
              setCategorySearch(v);
            }}
            onCreateCategory={onCreateCategory}
            saving={saving}
            primaryLabel={props.primaryLabel}
            secondaryLabel={props.secondaryLabel}
            secondaryDisabled={props.secondaryDisabled}
            onPrimary={() => runAction(props.onSavePrimary, "Changes saved.")}
            onSecondary={confirmSecondary}
            dangerLabel={props.dangerLabel}
            dangerDisabled={props.dangerDisabled}
            onDanger={props.onDanger ? confirmDanger : undefined}
          />
        </div>
      </div>
    </div>
  );
}
