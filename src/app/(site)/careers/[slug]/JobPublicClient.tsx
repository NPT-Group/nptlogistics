// src/app/(site)/careers/[slug]/JobPublicClient.tsx
"use client";

import * as React from "react";
// import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Mail,
  Phone,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  Tags,
  Image as ImageIcon,
} from "lucide-react";

import type { IJobPosting } from "@/types/jobPosting.types";
import type { IFileAsset } from "@/types/shared.types";
import { EFileMimeType, IMAGE_MIME_TYPES } from "@/types/shared.types";
import { ES3Namespace, ES3Folder } from "@/types/aws.types";

import TurnstileWidget from "@/components/TurnstileWidget";
import { uploadToS3PresignedPublic } from "@/lib/utils/s3Helper/client";
import { NEXT_PUBLIC_NPT_HR_EMAIL } from "@/config/env";
import { publicCountJobView } from "@/lib/utils/jobs/publicJobsApi";
import { trackCtaClick } from "@/lib/analytics/cta";
import { CheckBox } from "../../components/ui/CheckBox";
import dynamic from "next/dynamic";
import BlockNoteSkeleton from "@/components/blocknote/BlockNoteSkeleton";
import { Container } from "@/app/(site)/components/layout/Container";
import { CardImage } from "@/components/media/CardImage";

const BlockNote = dynamic(() => import("@/components/blocknote/BlockNote"), {
  ssr: false,
  loading: () => (
    <BlockNoteSkeleton
      variant="public"
      paddingClassName="p-4 sm:p-6"
      heightClassName="min-h-[320px]"
      lines={9}
      showToolbar={false} // public read-only: usually no toolbar
    />
  ),
});

function fmtMoney(n?: number) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

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

function getAssetUrl(asset: any): string {
  if (!asset) return "";
  return (
    asset?.url ||
    asset?.publicUrl ||
    asset?.cdnUrl ||
    asset?.s3Url ||
    asset?.location ||
    asset?.href ||
    ""
  );
}

function fmtComp(comp: any) {
  if (!comp?.isPublic) return "";
  const hasRange = !!(comp?.min || comp?.max);
  if (!hasRange && !comp?.note) return "";

  const range = hasRange
    ? `${comp.currency || ""} ${comp.min ? fmtMoney(comp.min) : ""}${
        comp.min && comp.max ? " – " : ""
      }${comp.max ? fmtMoney(comp.max) : ""}${
        comp.interval ? ` / ${String(comp.interval).toLowerCase()}` : ""
      }`.trim()
    : "";

  const note = comp?.note ? String(comp.note) : "";
  return [range, note].filter(Boolean).join(" • ");
}

export default function JobPublicClient({ job }: { job: IJobPosting }) {
  const router = useRouter();

  const slug = String(job?.slug || "unknown");

  const loc = Array.isArray(job.locations) ? job.locations : [];
  const locLabel = loc[0]?.label || loc[0]?.city || loc[0]?.region || loc[0]?.country || "—";
  const typeLabel = [job.workplaceType, job.employmentType].filter(Boolean).join(" • ") || "—";
  const compLabel = fmtComp(job.compensation);

  const coverUrl = getAssetUrl(job.coverImage);

  const publishedLabel = fmtDate(job.publishedAt || job.createdAt);
  const updatedLabel = fmtDate(job.updatedAt || job.createdAt);
  const closedLabel = fmtDate(job.closedAt);

  // Apply form state
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [turnstileInstanceKey, setTurnstileInstanceKey] = React.useState(0);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [currentLocation, setCurrentLocation] = React.useState("");
  const [addressLine, setAddressLine] = React.useState("");
  const [coverLetter, setCoverLetter] = React.useState("");

  const [linkedInUrl, setLinkedInUrl] = React.useState("");
  const [portfolioUrl, setPortfolioUrl] = React.useState("");

  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  const [resumeAsset, setResumeAsset] = React.useState<IFileAsset | null>(null);
  const [photoAsset, setPhotoAsset] = React.useState<IFileAsset | null>(null);

  // light screening (generic)
  const [commuteMode, setCommuteMode] = React.useState("");
  const [canWorkOnsite, setCanWorkOnsite] = React.useState(false);
  const [hasReferences, setHasReferences] = React.useState(false);

  // Refs: reset file inputs + scroll to messages
  const resumeInputRef = React.useRef<HTMLInputElement | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);
  const noticeRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToNotice = React.useCallback(() => {
    requestAnimationFrame(() => {
      if (!noticeRef.current) return;

      const NAVBAR_OFFSET = 170;
      const rect = noticeRef.current.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      window.scrollTo({
        top: absoluteTop - NAVBAR_OFFSET,
        behavior: "smooth",
      });
    });
  }, []);

  React.useEffect(() => {
    if (!err && !ok) return;
    scrollToNotice();
  }, [err, ok, scrollToNotice]);

  // Count views once per tab session
  React.useEffect(() => {
    if (!job?.slug) return;
    if (job?.status && String(job.status) !== "PUBLISHED") return;

    const key = `npt_job_viewed:${job.slug}`;
    try {
      if (typeof window === "undefined") return;

      const already = window.sessionStorage.getItem(key);
      if (already) return;

      window.sessionStorage.setItem(key, "1");
      publicCountJobView(job.slug);
    } catch {
      publicCountJobView(job.slug);
    }
  }, [job?.slug, job?.status]);

  const handleTurnstileToken = React.useCallback(
    (t: string) => {
      setTurnstileToken(t);

      trackCtaClick({
        ctaId: "job_apply_turnstile_verified",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Turnstile verified",
      });
    },
    [slug],
  );

  /**
   * NOTE: In CSS Grid, children default to min-width:auto, which can cause overflow
   * when any descendant has an intrinsic width (iframes, file inputs, long strings).
   * We aggressively apply min-w-0/max-w-full and add overflow-x-hidden at key wrappers.
   */
  const fieldBase =
    "site-input-light min-w-0 w-full max-w-full rounded-2xl " +
    "px-3 py-2 text-sm shadow-sm outline-none transition " +
    "sm:px-4 sm:py-2.5";

  const fileBase =
    "min-w-0 mt-1 block w-full max-w-full rounded-xl border border-slate-200/70 bg-white " +
    "px-3 py-2 text-sm text-slate-700 shadow-sm " +
    "file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white " +
    "hover:file:bg-slate-800";

  function resetFormAfterSuccess() {
    setErr(null);

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");

    setCurrentLocation("");
    setAddressLine("");
    setCoverLetter("");

    setLinkedInUrl("");
    setPortfolioUrl("");

    setCommuteMode("");
    setCanWorkOnsite(false);
    setHasReferences(false);

    setResumeFile(null);
    setPhotoFile(null);
    setResumeAsset(null);
    setPhotoAsset(null);

    if (resumeInputRef.current) resumeInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";

    setTurnstileToken("");
    setTurnstileInstanceKey((k) => k + 1);
  }

  async function uploadResumeIfNeeded() {
    if (!resumeFile) throw new Error("Please attach your resume.");
    if (resumeAsset?.s3Key) return resumeAsset;

    const asset = await uploadToS3PresignedPublic({
      file: resumeFile,
      namespace: ES3Namespace.JOBS,
      folder: ES3Folder.JOB_APPLICATION_RESUMES,
      docId: "public-apply",
      allowedMimeTypes: [EFileMimeType.PDF, EFileMimeType.DOC, EFileMimeType.DOCX],
      maxSizeMB: 10,
    });
    setResumeAsset(asset);
    return asset;
  }

  async function uploadPhotoIfNeeded() {
    if (!photoFile) return null;
    if (photoAsset?.s3Key) return photoAsset;

    const asset = await uploadToS3PresignedPublic({
      file: photoFile,
      namespace: ES3Namespace.JOBS,
      folder: ES3Folder.JOB_APPLICATION_PHOTOS,
      docId: "public-apply",
      allowedMimeTypes: IMAGE_MIME_TYPES as any,
      maxSizeMB: 10,
    });
    setPhotoAsset(asset);
    return asset;
  }

  async function submit() {
    trackCtaClick({
      ctaId: "job_apply_submit_attempt",
      location: "job_apply_form",
      destination: `/careers/${encodeURIComponent(slug)}`,
      label: "Submit application (attempt)",
    });

    setErr(null);
    setOk(false);

    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setErr("Turnstile is not configured (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      scrollToNotice();

      trackCtaClick({
        ctaId: "job_apply_submit_failed_turnstile_not_configured",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Submit failed: turnstile not configured",
      });

      return;
    }

    if (!turnstileToken) {
      setErr("Please complete the verification.");
      scrollToNotice();

      trackCtaClick({
        ctaId: "job_apply_submit_failed_missing_turnstile",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Submit failed: missing turnstile",
      });

      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErr("First name, last name, and email are required.");
      scrollToNotice();

      trackCtaClick({
        ctaId: "job_apply_submit_failed_missing_required",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Submit failed: missing required fields",
      });

      return;
    }

    setBusy(true);
    try {
      const resume = await uploadResumeIfNeeded();
      const photo = await uploadPhotoIfNeeded();

      const res = await fetch(`/api/v1/jobs/${encodeURIComponent(job.slug)}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,

          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,

          currentLocation: currentLocation.trim() || undefined,
          addressLine: addressLine.trim() || undefined,

          resume,
          photo: photo ?? undefined,

          commuteMode: commuteMode.trim() || undefined,
          canWorkOnsite,
          hasReferences,

          coverLetter: coverLetter.trim() || undefined,
          linkedInUrl: linkedInUrl.trim() || undefined,
          portfolioUrl: portfolioUrl.trim() || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to submit application");

      setOk(true);
      scrollToNotice();
      resetFormAfterSuccess();

      trackCtaClick({
        ctaId: "job_apply_submit_success",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Submit application (success)",
      });
    } catch (e: any) {
      const msg = e?.message || "Failed to submit application";
      setErr(msg);
      scrollToNotice();

      trackCtaClick({
        ctaId: "job_apply_submit_failed",
        location: "job_apply_form",
        destination: `/careers/${encodeURIComponent(slug)}`,
        label: "Submit application (failed)",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      <Container className="site-page-container py-6 sm:py-8">
        <button
          type="button"
          onClick={() => {
            trackCtaClick({
              ctaId: "job_back_to_jobs",
              location: "job_header",
              destination: "/careers#jobs",
              label: "Back to jobs",
            });
            router.push("/careers#jobs");
          }}
          className={[
            "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50",
            "focus-ring-light",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>

        <div className="mt-5 grid min-w-0 gap-6 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
          {/* Left: Job details */}
          <section className="min-w-0">
            <div className="site-card-surface overflow-hidden rounded-[28px]">
              {/* Cover image */}
              <div className="relative h-44 w-full bg-slate-50 sm:h-52 lg:h-64">
                {coverUrl ? (
                  <CardImage
                    src={coverUrl}
                    alt={job.title ? `${job.title} cover` : "Job cover"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/25 to-transparent"
                />
              </div>

              {/* Header content */}
              <div className="p-4 sm:p-6">
                <div className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {job.title}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {locLabel}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {typeLabel}
                  </span>

                  {job.department ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {job.department}
                    </span>
                  ) : null}

                  {typeof job.numberOfOpenings === "number" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {job.numberOfOpenings} opening{job.numberOfOpenings === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </div>

                {/* Dates */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                  {publishedLabel ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Published {publishedLabel}
                    </span>
                  ) : null}

                  {updatedLabel ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Updated {updatedLabel}
                    </span>
                  ) : null}

                  {closedLabel ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Closed {closedLabel}
                    </span>
                  ) : null}
                </div>

                {/* Tags */}
                {Array.isArray(job.tags) && job.tags.length ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      <Tags className="h-3.5 w-3.5" />
                      Tags
                    </span>
                    {job.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-2 py-1 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Compensation */}
                {compLabel ? (
                  <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Compensation: {compLabel}
                  </div>
                ) : null}

                {job.summary ? (
                  <div className="mt-5 text-sm leading-6 text-slate-700">{job.summary}</div>
                ) : null}
              </div>
            </div>

            <div className="site-card-surface mt-5 rounded-[28px] p-4 sm:mt-6 sm:p-6">
              <div className="text-sm font-semibold text-slate-900">Role description</div>{" "}
              <div className="mt-4">
                <BlockNote initialContent={job.description as any} editable={false} />{" "}
              </div>{" "}
            </div>

            {Array.isArray(job.benefitsPreview) && job.benefitsPreview.length ? (
              <div className="site-card-surface mt-5 rounded-[28px] p-4 sm:mt-6 sm:p-6">
                <div className="text-sm font-semibold text-slate-900">Benefits</div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {job.benefitsPreview.map((b, idx) => (
                    <li
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {/* Right: Apply */}
          <aside className="w-full max-w-full min-w-0 lg:sticky lg:top-6">
            <div className="site-card-surface max-w-full min-w-0 overflow-hidden rounded-[28px] p-4 sm:p-6">
              <div className="text-lg font-semibold tracking-tight text-slate-900">Apply</div>
              <div className="mt-1 text-sm text-slate-500">
                Submit your details and upload your resume. We’ll review and follow up.
              </div>

              {/* Anchor for scroll */}
              <div ref={noticeRef} />

              {err ? (
                <div className="mt-4 flex min-w-0 items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1 break-words">{err}</div>
                </div>
              ) : null}

              {ok ? (
                <div className="mt-4 flex min-w-0 items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1 break-words">
                    Application submitted successfully. Thank you!
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid min-w-0 gap-2.5 sm:mt-5 sm:gap-3">
                <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name *"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name *"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                </div>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  type="email"
                  className={[fieldBase, "focus-ring-light"].join(" ")}
                  disabled={busy}
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className={[fieldBase, "focus-ring-light"].join(" ")}
                  disabled={busy}
                />

                <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <input
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="Current location"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Address (optional)"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                </div>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Cover letter (optional)"
                  rows={4}
                  className={[
                    "w-full max-w-full min-w-0 rounded-2xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400",
                    "focus:border-[color:var(--color-brand-600)]/35",
                    "sm:px-4 sm:py-3",
                    "focus-ring-light",
                  ].join(" ")}
                  disabled={busy}
                />

                <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <input
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="LinkedIn URL"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="Portfolio URL"
                    className={[fieldBase, "focus-ring-light"].join(" ")}
                    disabled={busy}
                  />
                </div>

                {/* Light screening */}
                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="text-sm font-semibold text-slate-900">A few quick questions</div>
                  <div className="mt-3 grid min-w-0 gap-2.5 sm:gap-3">
                    <div className="grid min-w-0 gap-2">
                      <div className="text-xs font-semibold text-slate-700">
                        Commute mode (optional)
                      </div>
                      <input
                        value={commuteMode}
                        onChange={(e) => setCommuteMode(e.target.value)}
                        placeholder="e.g. Car, Transit, Bike"
                        className={[fieldBase, "focus-ring-light"].join(" ")}
                        disabled={busy}
                      />
                    </div>

                    <CheckBox
                      checked={canWorkOnsite}
                      onCheckedChange={(v) => setCanWorkOnsite(v)}
                      disabled={busy}
                      label="I can work onsite if required."
                      description="Some roles may require onsite work depending on location and schedule."
                      // Optional style overrides (example):
                      // variant="default"
                      // classes={{ root: "bg-white" }}
                    />

                    <CheckBox
                      checked={hasReferences}
                      onCheckedChange={(v) => setHasReferences(v)}
                      disabled={busy}
                      label="I can provide references upon request."
                      description="You won’t be asked to share references here—just confirming availability."
                    />
                  </div>
                </div>

                {/* Attach files */}
                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900">
                    <UploadCloud className="h-4 w-4 shrink-0" />
                    <span className="min-w-0">Attach files</span>
                  </div>

                  <div className="mt-3 grid min-w-0 gap-2.5 sm:gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-700">
                        Resume (PDF/DOC/DOCX) *
                      </div>
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setResumeFile(f);
                          setResumeAsset(null);

                          if (f) {
                            trackCtaClick({
                              ctaId: "job_apply_resume_selected",
                              location: "job_apply_form",
                              destination: `/careers/${encodeURIComponent(slug)}`,
                              label: "Resume selected",
                            });
                          }
                        }}
                        disabled={busy}
                        className={[fileBase, "focus-ring-light"].join(" ")}
                      />
                      {resumeFile ? (
                        <div className="mt-1 max-w-full min-w-0 truncate text-xs text-slate-500">
                          {resumeFile.name}
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-700">Photo (optional)</div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setPhotoFile(f);
                          setPhotoAsset(null);

                          if (f) {
                            trackCtaClick({
                              ctaId: "job_apply_photo_selected",
                              location: "job_apply_form",
                              destination: `/careers/${encodeURIComponent(slug)}`,
                              label: "Photo selected",
                            });
                          }
                        }}
                        disabled={busy}
                        className={[fileBase, "focus-ring-light"].join(" ")}
                      />
                      {photoFile ? (
                        <div className="mt-1 max-w-full min-w-0 truncate text-xs text-slate-500">
                          {photoFile.name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="site-card-surface min-w-0 rounded-2xl p-3 sm:p-4">
                  <div className="min-w-0 text-sm font-semibold text-slate-900">Verification</div>

                  {/* This wrapper is the key: if Turnstile injects an iframe with a hard width, we prevent it from widening the grid item */}
                  <div className="mt-2 max-w-full min-w-0 overflow-hidden">
                    <TurnstileWidget
                      key={turnstileInstanceKey}
                      action="job_apply"
                      onToken={handleTurnstileToken}
                      className="max-w-full"
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    This helps prevent spam submissions.
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy || !job.allowApplications}
                  onClick={submit}
                  className={[
                    "inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60",
                    "focus-ring-light",
                  ].join(" ")}
                >
                  Submit application
                </button>

                {!job.allowApplications ? (
                  <div className="min-w-0 text-xs break-words text-slate-500">
                    Applications are currently disabled for this posting.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="site-card-surface mt-4 max-w-full min-w-0 overflow-hidden rounded-[28px] p-4 text-sm text-slate-600 sm:p-5">
              <div className="flex min-w-0 items-center gap-2 font-semibold text-slate-900">
                <Mail className="h-4 w-4 shrink-0" />
                Questions?
              </div>
              <div className="mt-2 min-w-0 break-words">
                If you need help applying, contact{" "}
                <a
                  href={`mailto:${NEXT_PUBLIC_NPT_HR_EMAIL}?subject=${encodeURIComponent(
                    `Question about ${job.title}`,
                  )}`}
                  onClick={() =>
                    trackCtaClick({
                      ctaId: "job_contact_hr_email",
                      location: "job_contact_card",
                      destination: `mailto:${NEXT_PUBLIC_NPT_HR_EMAIL}`,
                      label: "Email HR (mailto)",
                    })
                  }
                  className="font-medium break-words text-[color:var(--color-brand-600)] hover:underline"
                >
                  {NEXT_PUBLIC_NPT_HR_EMAIL}
                </a>
                .
              </div>
              <div className="mt-3 flex min-w-0 items-center gap-2 text-xs text-slate-600">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 break-words">Include the job title in your message.</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
