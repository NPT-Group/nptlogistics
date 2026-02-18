// src/app/(admin)/components/jobs/JobEditor.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";

import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";
import { ConfirmModal, type ConfirmTone } from "@/app/(admin)/components/ui/ConfirmModal";
import { SoftButton } from "@/app/(admin)/components/ui/Buttons";

import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";
import type { IJobPosting, JobLocation, JobCompensation } from "@/types/jobPosting.types";
import { EWorkplaceType, EEmploymentType, EJobPostingStatus } from "@/types/jobPosting.types";

import { ES3Namespace, ES3Folder } from "@/types/aws.types";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "@/types/shared.types";
import { uploadToS3Presigned, type UploadResult } from "@/lib/utils/s3Helper";

import JobPostingSidebar from "./JobPostingSidebar";
import { AlertTriangle, Briefcase, CheckCircle2, ExternalLink } from "lucide-react";
import { getAllowedJobActions } from "@/lib/utils/jobs/jobStatusTransitions";

const BlockNote = dynamic(() => import("@/components/BlockNote"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        "rounded-3xl border p-5 text-sm shadow-[var(--dash-shadow)]",
        "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-muted)]",
      )}
    >
      Loading editor…
    </div>
  ),
});

type SubmitPayload = Partial<IJobPosting> & {
  description: BlockNoteDocJSON;
};

type SecondaryActionKind = "PUBLISH" | "CLOSE";

type Props = {
  mode: "create" | "edit";

  headerTitle: string;
  headerSubtitle?: string;
  backHref: string;
  onBack: () => void;

  initial?: Partial<IJobPosting>;

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

async function uploadJobsMediaToTemp(file: File): Promise<UploadResult> {
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
    namespace: ES3Namespace.JOBS,
    folder,
    allowedMimeTypes,
    maxSizeMB: folder === ES3Folder.MEDIA_VIDEOS ? 250 : 25,
  });
}

async function uploadCoverToTemp(file: File): Promise<IFileAsset> {
  if (!file.type.toLowerCase().startsWith("image/"))
    throw new Error("Cover image must be an image.");

  const up = await uploadToS3Presigned({
    file,
    namespace: ES3Namespace.JOBS,
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

export default function JobEditor(props: Props) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const currentStatus = (props.initial?.status as EJobPostingStatus | undefined) ?? undefined;
  const { canPublish, canClose, canArchive } = getAllowedJobActions(currentStatus);

  const isArchived = currentStatus === EJobPostingStatus.ARCHIVED;
  const isRepublish = currentStatus === EJobPostingStatus.CLOSED;

  // Allow secondary when archived (we map it to "Unarchive" UX-wise)
  const secondaryAllowed =
    props.secondaryActionKind === "PUBLISH"
      ? !!canPublish || isArchived
      : props.secondaryActionKind === "CLOSE"
        ? !!canClose
        : true;

  const effectiveSecondaryDisabled = !!props.secondaryDisabled || !secondaryAllowed;

  const effectiveSecondaryLabel =
    props.secondaryActionKind === "PUBLISH"
      ? isArchived
        ? "Unarchive"
        : isRepublish
          ? "Republish"
          : props.secondaryLabel
      : props.secondaryLabel;

  // Danger (archive) only when allowed
  const showArchiveDanger = !!props.onDanger && !!props.dangerLabel && !!canArchive;
  const effectiveDangerDisabled = !!props.dangerDisabled || !canArchive;

  const [doc, setDoc] = React.useState<PartialBlock[] | null>(
    (props.initial?.description as any) ?? null,
  );

  const [title, setTitle] = React.useState(props.initial?.title ?? "");
  const [slug, setSlug] = React.useState(props.initial?.slug ?? "");
  const [department, setDepartment] = React.useState(props.initial?.department ?? "");
  const [workplaceType, setWorkplaceType] = React.useState<string>(
    String(props.initial?.workplaceType ?? EWorkplaceType.ONSITE),
  );
  const [employmentType, setEmploymentType] = React.useState<string>(
    String(props.initial?.employmentType ?? EEmploymentType.FULL_TIME),
  );
  const [numberOfOpenings, setNumberOfOpenings] = React.useState<number>(
    Number(props.initial?.numberOfOpenings ?? 1),
  );

  const [summary, setSummary] = React.useState(props.initial?.summary ?? "");
  const [tags, setTags] = React.useState((props.initial?.tags ?? []).join(", "));

  const [allowApplications, setAllowApplications] = React.useState<boolean>(
    props.initial?.allowApplications ?? true,
  );

  const [locationsText, setLocationsText] = React.useState<string>(() => {
    const locs = Array.isArray(props.initial?.locations) ? props.initial!.locations : [];
    return locs.map((l) => l.label).join("\n");
  });

  const [coverImage, setCoverImage] = React.useState<IFileAsset | undefined>(
    props.initial?.coverImage as any,
  );

  const [compCurrency, setCompCurrency] = React.useState(
    props.initial?.compensation?.currency ?? "CAD",
  );
  const [compMin, setCompMin] = React.useState<string>(
    props.initial?.compensation?.min != null ? String(props.initial?.compensation?.min) : "",
  );
  const [compMax, setCompMax] = React.useState<string>(
    props.initial?.compensation?.max != null ? String(props.initial?.compensation?.max) : "",
  );
  const [compInterval, setCompInterval] = React.useState<string>(
    props.initial?.compensation?.interval ?? "YEAR",
  );
  const [compNote, setCompNote] = React.useState(props.initial?.compensation?.note ?? "");
  const [compPublic, setCompPublic] = React.useState<boolean>(
    props.initial?.compensation?.isPublic ?? false,
  );

  const [benefitsText, setBenefitsText] = React.useState<string>(() =>
    (props.initial?.benefitsPreview ?? []).join("\n"),
  );

  const [saving, setSaving] = React.useState(false);

  const [error, setError] = React.useState<{ message: string; nonce: number } | null>(null);
  const [success, setSuccess] = React.useState<{ message: string; nonce: number } | null>(null);

  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const errorRef = React.useRef<HTMLDivElement | null>(null);
  const successRef = React.useRef<HTMLDivElement | null>(null);

  // Confirm modal
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
      department,
      workplaceType,
      employmentType,
      numberOfOpenings,
      summary,
      tags,
      allowApplications,
      locationsText,
      coverImage: coverImage ? { url: coverImage.url, s3Key: coverImage.s3Key } : null,
      compensation: { compCurrency, compMin, compMax, compInterval, compNote, compPublic },
      benefitsText,
      doc: doc ?? null,
    });
  }, [
    title,
    slug,
    department,
    workplaceType,
    employmentType,
    numberOfOpenings,
    summary,
    tags,
    allowApplications,
    locationsText,
    coverImage,
    compCurrency,
    compMin,
    compMax,
    compInterval,
    compNote,
    compPublic,
    benefitsText,
    doc,
  ]);

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

  function scrollToTop() {
    // This is the key: always go to the very top, not "nearest header"
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      headerRef.current?.focus?.();
    });
  }

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

  async function onPickCover(file: File) {
    setError(null);
    setSuccess(null);
    const asset = await uploadCoverToTemp(file);
    setCoverImage(asset);
  }

  function onRemoveCover() {
    setSuccess(null);
    setCoverImage(undefined);
  }

  function coerceBody(): BlockNoteDocJSON {
    return (doc ?? []) as unknown as BlockNoteDocJSON;
  }

  function parseLocations(): JobLocation[] {
    const lines = locationsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) throw new Error("At least one location is required.");
    return lines.map((label) => ({ label }));
  }

  function parseTags(): string[] | undefined {
    const out = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return out.length ? out : undefined;
  }

  function buildCompensation(): JobCompensation | undefined {
    const min = compMin.trim() ? Number(compMin) : undefined;
    const max = compMax.trim() ? Number(compMax) : undefined;

    if (compCurrency.trim() || min != null || max != null || compNote.trim()) {
      return {
        currency: compCurrency.trim() || undefined,
        min: Number.isFinite(min as any) ? min : undefined,
        max: Number.isFinite(max as any) ? max : undefined,
        interval: (compInterval as any) || undefined,
        note: compNote.trim() || undefined,
        isPublic: !!compPublic,
      };
    }
    return undefined;
  }

  function parseBenefits(): string[] | undefined {
    const out = benefitsText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    return out.length ? out : undefined;
  }

  function buildPayload(): SubmitPayload {
    const t = title.trim();
    if (!t) throw new Error("Title is required.");
    if (!doc) throw new Error("Description is required.");
    if (!Number.isFinite(numberOfOpenings) || numberOfOpenings < 1)
      throw new Error("Openings must be at least 1.");

    return {
      title: t,
      slug: slug.trim() || undefined,
      department: department.trim() || undefined,
      workplaceType: workplaceType as any,
      employmentType: employmentType as any,
      numberOfOpenings,
      locations: parseLocations(),
      summary: summary.trim() || undefined,
      tags: parseTags(),
      description: coerceBody(),
      coverImage,
      compensation: buildCompensation(),
      benefitsPreview: parseBenefits(),
      allowApplications,
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

      // success signal + jump to top so user sees it
      setSuccess({ message: successMessage, nonce: Date.now() });
      requestAnimationFrame(() => {
        // ensure banner exists in DOM before focusing
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (e: any) {
      setError({ message: e?.message || "Failed to save.", nonce: Date.now() });
    } finally {
      setSaving(false);
    }
  }

  async function confirmSecondary(): Promise<void> {
    if (effectiveSecondaryDisabled) return;

    const kind = props.secondaryActionKind;
    const isClose = kind === "CLOSE";
    const isPublishLike = kind === "PUBLISH";

    const tone: ConfirmTone = isClose ? "danger" : "neutral";

    let title = "Confirm action";
    let body: React.ReactNode = "Are you sure you want to continue?";
    const label = effectiveSecondaryLabel;
    let successMsg = "Action completed.";

    if (isPublishLike) {
      if (isArchived) {
        title = "Unarchive this job?";
        body = "This will restore the posting and make it live again.";
        successMsg = "Job unarchived.";
      } else if (isRepublish) {
        title = "Republish this job?";
        body = "This will publish the posting again and make it visible publicly.";
        successMsg = "Job republished.";
      } else {
        title = "Publish this job?";
        body = "This will publish the posting and make it visible publicly.";
        successMsg = "Job published.";
      }
    } else if (isClose) {
      title = "Close this job?";
      body = "This will close the posting and remove it from public listings.";
      successMsg = "Job closed.";
    }

    confirmActionRef.current = async () => runAction(props.onSaveSecondary, successMsg);

    setConfirmTone(tone);
    setConfirmTitle(title);
    setConfirmDesc(body);
    setConfirmLabel(label);
    setConfirmOpen(true);
  }

  function confirmDanger() {
    if (!props.onDanger) return;
    if (!canArchive) return;

    const title = props.dangerConfirmTitle ?? "Archive this job?";
    const body =
      props.dangerConfirmBody ??
      "This will archive the posting and remove it from public listings.";

    confirmActionRef.current = async () => runAction(props.onDanger!, "Job archived.");

    setConfirmTone("danger");
    setConfirmTitle(title);
    setConfirmDesc(body);
    setConfirmLabel(props.dangerLabel ?? "Archive");
    setConfirmOpen(true);
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
                  <Briefcase className="h-5 w-5" />
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_410px]">
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
                <div className="text-sm font-semibold text-[var(--dash-text)]">Description</div>
                <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
                  Use “+” to add blocks. Paste images/videos to upload.
                </div>
              </div>
            </div>

            <div className="p-5">
              <div
                className={cn(
                  "rounded-3xl border shadow-[var(--dash-shadow)]/12",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)]",
                )}
              >
                <div className="p-4">
                  <BlockNote
                    onChange={(v: any) => {
                      setSuccess(null);
                      setError(null);
                      setDoc(v);
                    }}
                    uploadFile={uploadJobsMediaToTemp}
                    initialContent={doc ?? undefined}
                    chrome={{
                      borderColor: "var(--dash-border)",
                      background: isDark ? "rgba(255,255,255,0.04)" : "white",
                      className: "rounded-3xl border p-4 shadow-[var(--dash-shadow)]/12",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <JobPostingSidebar
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
            department={department}
            setDepartment={(v) => {
              setSuccess(null);
              setError(null);
              setDepartment(v);
            }}
            workplaceType={workplaceType}
            setWorkplaceType={(v) => {
              setSuccess(null);
              setError(null);
              setWorkplaceType(v);
            }}
            employmentType={employmentType}
            setEmploymentType={(v) => {
              setSuccess(null);
              setError(null);
              setEmploymentType(v);
            }}
            numberOfOpenings={numberOfOpenings}
            setNumberOfOpenings={(n) => {
              setSuccess(null);
              setError(null);
              setNumberOfOpenings(n);
            }}
            locationsText={locationsText}
            setLocationsText={(v) => {
              setSuccess(null);
              setError(null);
              setLocationsText(v);
            }}
            summary={summary}
            setSummary={(v) => {
              setSuccess(null);
              setError(null);
              setSummary(v);
            }}
            tags={tags}
            setTags={(v) => {
              setSuccess(null);
              setError(null);
              setTags(v);
            }}
            allowApplications={allowApplications}
            setAllowApplications={(v) => {
              setSuccess(null);
              setError(null);
              setAllowApplications(v);
            }}
            coverImage={coverImage}
            onPickCover={onPickCover}
            onRemoveCover={onRemoveCover}
            compCurrency={compCurrency}
            setCompCurrency={(v) => {
              setSuccess(null);
              setError(null);
              setCompCurrency(v);
            }}
            compMin={compMin}
            setCompMin={(v) => {
              setSuccess(null);
              setError(null);
              setCompMin(v);
            }}
            compMax={compMax}
            setCompMax={(v) => {
              setSuccess(null);
              setError(null);
              setCompMax(v);
            }}
            compInterval={compInterval}
            setCompInterval={(v) => {
              setSuccess(null);
              setError(null);
              setCompInterval(v);
            }}
            compNote={compNote}
            setCompNote={(v) => {
              setSuccess(null);
              setError(null);
              setCompNote(v);
            }}
            compPublic={compPublic}
            setCompPublic={(v) => {
              setSuccess(null);
              setError(null);
              setCompPublic(v);
            }}
            benefitsText={benefitsText}
            setBenefitsText={(v) => {
              setSuccess(null);
              setError(null);
              setBenefitsText(v);
            }}
            saving={saving}
            primaryLabel={props.primaryLabel}
            secondaryLabel={effectiveSecondaryLabel}
            secondaryDisabled={effectiveSecondaryDisabled}
            onPrimary={() => runAction(props.onSavePrimary, "Changes saved.")}
            onSecondary={confirmSecondary}
            dangerLabel={showArchiveDanger ? props.dangerLabel : undefined}
            dangerDisabled={effectiveDangerDisabled}
            onDanger={showArchiveDanger ? confirmDanger : undefined}
            secondaryActionKind={props.secondaryActionKind}
            status={currentStatus}
          />
        </div>
      </div>
    </div>
  );
}
