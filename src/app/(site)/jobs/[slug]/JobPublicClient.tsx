// src/app/(site)/jobs/[slug]/JobPublicClient.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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

import TurnstileWidget from "@/components/shared/TurnstileWidget";
import { uploadToS3PresignedPublic } from "@/lib/utils/s3ClientUpload";

const BlockNote = dynamic(() => import("@/components/BlockNote"), { ssr: false });

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
    ? `${comp.currency || ""} ${comp.min ? fmtMoney(comp.min) : ""}${comp.min && comp.max ? " – " : ""}${
        comp.max ? fmtMoney(comp.max) : ""
      }${comp.interval ? ` / ${String(comp.interval).toLowerCase()}` : ""}`.trim()
    : "";

  const note = comp?.note ? String(comp.note) : "";
  return [range, note].filter(Boolean).join(" • ");
}

export default function JobPublicClient({ job }: { job: IJobPosting }) {
  const router = useRouter();

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

  const focusRing =
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const fieldBase =
    "w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 " +
    "placeholder:text-slate-400 shadow-sm outline-none transition " +
    "focus:border-[color:var(--color-brand-600)]/35";

  const fileBase =
    "mt-1 block w-full rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm " +
    "file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white " +
    "hover:file:bg-slate-800";

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
    setErr(null);

    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setErr("Turnstile is not configured (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).");
      return;
    }

    if (!turnstileToken) {
      setErr("Please complete the verification.");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErr("First name, last name, and email are required.");
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

          coverLetter: coverLetter.trim() || undefined,
          linkedInUrl: linkedInUrl.trim() || undefined,
          portfolioUrl: portfolioUrl.trim() || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to submit application");

      setOk(true);
      setTurnstileToken("");
    } catch (e: any) {
      setErr(e?.message || "Failed to submit application");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <button
          type="button"
          onClick={() => router.push("/jobs")}
          className={[
            "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50",
            focusRing,
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left: Job details */}
          <section className="min-w-0">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm">
              {/* Cover image */}
              <div className="relative h-52 w-full bg-slate-50 sm:h-64">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={job.title ? `${job.title} cover` : "Job cover"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={false}
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
              <div className="p-6">
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

            <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Role description</div>
              <div className="mt-4">
                <BlockNote initialContent={job.description as any} editable={false} />
              </div>
            </div>

            {Array.isArray(job.benefitsPreview) && job.benefitsPreview.length ? (
              <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
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
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold tracking-tight text-slate-900">Apply</div>
              <div className="mt-1 text-sm text-slate-500">
                Submit your details and upload your resume. We’ll review and follow up.
              </div>

              {err ? (
                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div className="flex-1">{err}</div>
                </div>
              ) : null}

              {ok ? (
                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <div className="flex-1">Application submitted successfully. Thank you!</div>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name *"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name *"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                </div>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  type="email"
                  className={[fieldBase, focusRing].join(" ")}
                  disabled={busy}
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className={[fieldBase, focusRing].join(" ")}
                  disabled={busy}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="Current location"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Address (optional)"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                </div>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Cover letter (optional)"
                  rows={4}
                  className={[
                    "w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400",
                    "focus:border-[color:var(--color-brand-600)]/35",
                    focusRing,
                  ].join(" ")}
                  disabled={busy}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="LinkedIn URL"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                  <input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="Portfolio URL"
                    className={[fieldBase, focusRing].join(" ")}
                    disabled={busy}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <UploadCloud className="h-4 w-4" />
                    Attach files
                  </div>

                  <div className="mt-3 grid gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Resume (PDF/DOC/DOCX) *
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setResumeFile(f);
                          setResumeAsset(null);
                        }}
                        disabled={busy}
                        className={[fileBase, focusRing].join(" ")}
                      />
                      {resumeFile ? (
                        <div className="mt-1 text-xs text-slate-500">{resumeFile.name}</div>
                      ) : null}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-700">Photo (optional)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setPhotoFile(f);
                          setPhotoAsset(null);
                        }}
                        disabled={busy}
                        className={[fileBase, focusRing].join(" ")}
                      />
                      {photoFile ? (
                        <div className="mt-1 text-xs text-slate-500">{photoFile.name}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-700">Verification</div>
                  <TurnstileWidget
                    action="job_apply"
                    onToken={(t) => setTurnstileToken(t)}
                    className="mt-2"
                  />
                  <div className="mt-2 text-[11px] text-slate-500">
                    This helps prevent spam submissions.
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy || !job.allowApplications}
                  onClick={submit}
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60",
                    focusRing,
                  ].join(" ")}
                >
                  Submit application
                </button>

                {!job.allowApplications ? (
                  <div className="text-xs text-slate-500">
                    Applications are currently disabled for this posting.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-slate-200/70 bg-white p-5 text-sm text-slate-600 shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Mail className="h-4 w-4" />
                Questions?
              </div>
              <div className="mt-2">If you need help applying, contact HR.</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <Phone className="h-3.5 w-3.5" />
                Include the job title in your message.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
