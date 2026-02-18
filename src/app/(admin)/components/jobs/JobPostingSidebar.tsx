// src/components/admin/jobs/JobPostingSidebar.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/app/(admin)/components/theme/AdminThemeProvider";
import { Checkbox } from "@/app/(admin)/components/ui/Checkbox";
import {
  AlignLeft,
  Archive,
  Ban,
  Briefcase,
  Image as ImageIcon,
  Link2,
  MapPin,
  Plus,
  Rocket,
  Save,
  Settings2,
  Tags,
  Type,
  Upload,
  DollarSign,
  ListChecks,
  Info,
} from "lucide-react";

import type { IFileAsset } from "@/types/shared.types";
import { EWorkplaceType, EEmploymentType, EJobPostingStatus } from "@/types/jobPosting.types";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  slug: string;
  setSlug: (v: string) => void;

  department: string;
  setDepartment: (v: string) => void;

  workplaceType: string;
  setWorkplaceType: (v: string) => void;

  employmentType: string;
  setEmploymentType: (v: string) => void;

  numberOfOpenings: number;
  setNumberOfOpenings: (n: number) => void;

  locationsText: string;
  setLocationsText: (v: string) => void;

  summary: string;
  setSummary: (v: string) => void;

  tags: string;
  setTags: (v: string) => void;

  allowApplications: boolean;
  setAllowApplications: (v: boolean) => void;

  coverImage?: IFileAsset;
  onPickCover: (file: File) => Promise<void>;
  onRemoveCover: () => void;

  compCurrency: string;
  setCompCurrency: (v: string) => void;
  compMin: string;
  setCompMin: (v: string) => void;
  compMax: string;
  setCompMax: (v: string) => void;
  compInterval: string;
  setCompInterval: (v: string) => void;
  compNote: string;
  setCompNote: (v: string) => void;
  compPublic: boolean;
  setCompPublic: (v: boolean) => void;

  benefitsText: string;
  setBenefitsText: (v: string) => void;

  saving?: boolean;

  primaryLabel: string;
  secondaryLabel: string;

  /**
   * IMPORTANT:
   * In the updated UX, when secondaryDisabled is true,
   * we HIDE the secondary button entirely (instead of showing disabled).
   */
  secondaryDisabled?: boolean;

  onPrimary: () => Promise<void>;
  onSecondary: () => Promise<void>;

  dangerLabel?: string;
  dangerDisabled?: boolean;
  onDanger?: () => void;

  secondaryActionKind: "PUBLISH" | "CLOSE";
  status?: EJobPostingStatus;
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
  return <div className="my-3 h-px w-full bg-[var(--dash-border)]/80" />;
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--dash-muted)] uppercase">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function TinySelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, "appearance-none pr-10")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function JobPostingSidebar(props: Props) {
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const showDanger = !!props.dangerLabel && !!props.onDanger;

  const secondaryIcon =
    props.secondaryActionKind === "PUBLISH" ? (
      <Rocket className="h-4 w-4" />
    ) : (
      <Ban className="h-4 w-4" />
    );

  // If you want "disabled because saving" to still render but disabled,
  // keep this as-is. We hide only when secondaryDisabled is true.
  const hideSecondaryBecauseNotAllowed = !!props.secondaryDisabled;

  // Helpful little hint (optional)
  const secondaryUnavailableText =
    props.secondaryActionKind === "PUBLISH"
      ? props.status === EJobPostingStatus.ARCHIVED
        ? "This posting can’t be unarchived from its current state."
        : "This posting can’t be published from its current state."
      : "This posting can’t be closed from its current state.";

  return (
    <aside
      className={cn(
        "sticky top-6 h-[calc(100vh-3rem)] overflow-auto rounded-3xl border shadow-[var(--dash-shadow)]",
        "border-[var(--dash-border)] bg-[var(--dash-surface)]",
      )}
    >
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
            <div className="text-sm font-semibold text-[var(--dash-text)]">Job settings</div>
            <div className="mt-0.5 text-xs text-[var(--dash-muted)]">
              Basics, locations, compensation, actions.
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
                placeholder="Job title"
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                  <Briefcase className="h-3.5 w-3.5" /> Department
                </div>
                <input
                  value={props.department}
                  onChange={(e) => props.setDepartment(e.target.value)}
                  placeholder="Operations, Sales…"
                  className={inputBase}
                />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                  <Plus className="h-3.5 w-3.5" /> Openings
                </div>
                <input
                  type="number"
                  min={1}
                  value={props.numberOfOpenings}
                  onChange={(e) =>
                    props.setNumberOfOpenings(Math.max(1, Number(e.target.value || 1)))
                  }
                  className={inputBase}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Workplace</div>
                <TinySelect
                  value={props.workplaceType}
                  onChange={props.setWorkplaceType}
                  options={[
                    { value: EWorkplaceType.ONSITE, label: "On-site" },
                    { value: EWorkplaceType.HYBRID, label: "Hybrid" },
                    { value: EWorkplaceType.REMOTE, label: "Remote" },
                  ]}
                />
              </div>

              <div>
                <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Employment</div>
                <TinySelect
                  value={props.employmentType}
                  onChange={props.setEmploymentType}
                  options={[
                    { value: EEmploymentType.FULL_TIME, label: "Full-time" },
                    { value: EEmploymentType.PART_TIME, label: "Part-time" },
                    { value: EEmploymentType.CONTRACT, label: "Contract" },
                    { value: EEmploymentType.TEMPORARY, label: "Temporary" },
                    { value: EEmploymentType.INTERN, label: "Intern" },
                  ]}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                <AlignLeft className="h-3.5 w-3.5" /> Summary
              </div>
              <textarea
                value={props.summary}
                onChange={(e) => props.setSummary(e.target.value)}
                placeholder="Short summary (optional)"
                rows={4}
                className={cn(inputBase, "resize-none")}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--dash-muted)]">
                <Tags className="h-3.5 w-3.5" /> Tags
              </div>
              <input
                value={props.tags}
                onChange={(e) => props.setTags(e.target.value)}
                placeholder="comma separated (e.g. forklift, night shift)"
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<MapPin className="h-4 w-4" />} label="Locations" />
          <div className="mt-3">
            <textarea
              value={props.locationsText}
              onChange={(e) => props.setLocationsText(e.target.value)}
              placeholder={"One per line\nExample:\nMilton, ON\nToronto, ON"}
              rows={6}
              className={cn(inputBase, "resize-none")}
            />
            <div className="mt-2 text-[11px] text-[var(--dash-muted)]">
              One location label per line.
            </div>
          </div>

          <Divider />

          <div className="flex items-center gap-2">
            <Checkbox
              checked={props.allowApplications}
              onChange={props.setAllowApplications}
              label="Allow applications"
            />
            <div className="text-sm font-medium text-[var(--dash-text)]">Allow applications</div>
          </div>
          <div className="mt-1 text-[11px] text-[var(--dash-muted)]">
            If off, the public apply form should be disabled.
          </div>
        </section>

        {/* Cover */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<ImageIcon className="h-4 w-4" />} label="Cover image" />
          <div className="mt-3">
            {props.coverImage?.url ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-3xl border border-[var(--dash-border)]">
                  <img
                    src={props.coverImage.url}
                    alt="cover"
                    className="h-44 w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  disabled={props.saving}
                  onClick={props.onRemoveCover}
                  className={cn(
                    "inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                    "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]",
                    "disabled:opacity-50",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                  )}
                >
                  Remove cover
                </button>
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
                      Upload cover
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
                    await props.onPickCover(f);
                  }}
                />
              </label>
            )}
          </div>
        </section>

        {/* Compensation + Benefits */}
        <section className={cn(softCard, "p-4")}>
          <SectionHeader icon={<DollarSign className="h-4 w-4" />} label="Compensation" />
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Currency</div>
              <input
                value={props.compCurrency}
                onChange={(e) => props.setCompCurrency(e.target.value)}
                className={inputBase}
                placeholder="CAD"
              />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Interval</div>
              <TinySelect
                value={props.compInterval}
                onChange={props.setCompInterval}
                options={[
                  { value: "HOUR", label: "Per hour" },
                  { value: "MONTH", label: "Per month" },
                  { value: "YEAR", label: "Per year" },
                ]}
              />
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Min</div>
              <input
                value={props.compMin}
                onChange={(e) => props.setCompMin(e.target.value)}
                className={inputBase}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Max</div>
              <input
                value={props.compMax}
                onChange={(e) => props.setCompMax(e.target.value)}
                className={inputBase}
                placeholder="e.g. 32"
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 text-xs font-medium text-[var(--dash-muted)]">Note (optional)</div>
            <input
              value={props.compNote}
              onChange={(e) => props.setCompNote(e.target.value)}
              className={inputBase}
              placeholder="e.g. + overtime, benefits, bonus…"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Checkbox
              checked={props.compPublic}
              onChange={props.setCompPublic}
              label="Show compensation publicly"
            />
            <div className="text-sm font-medium text-[var(--dash-text)]">Show publicly</div>
          </div>

          <Divider />

          <SectionHeader icon={<ListChecks className="h-4 w-4" />} label="Benefits preview" />
          <div className="mt-3">
            <textarea
              value={props.benefitsText}
              onChange={(e) => props.setBenefitsText(e.target.value)}
              placeholder={"One per line\nExample:\nHealth benefits\nRRSP match\nPaid training"}
              rows={5}
              className={cn(inputBase, "resize-none")}
            />
            <div className="mt-2 text-[11px] text-[var(--dash-muted)]">
              Used for a quick “What you’ll get” preview.
            </div>
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

            {/* Secondary action: HIDE entirely when not allowed */}
            {!hideSecondaryBecauseNotAllowed ? (
              <button
                type="button"
                disabled={props.saving}
                onClick={props.onSecondary}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                  "bg-[var(--dash-red)] text-white hover:brightness-110",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                  "disabled:opacity-50",
                )}
              >
                {secondaryIcon}
                {props.secondaryLabel}
              </button>
            ) : (
              <div
                className={cn(
                  "rounded-2xl border px-3 py-2 text-xs",
                  "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-muted)]",
                )}
              >
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4" />
                  <div>
                    <div className="font-semibold text-[var(--dash-text)]">Action unavailable</div>
                    <div className="mt-0.5">{secondaryUnavailableText}</div>
                  </div>
                </div>
              </div>
            )}

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
                  Archived postings won’t show publicly.
                </div>
              </>
            ) : null}

            {props.status ? (
              <div className="mt-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-bg)] px-3 py-2 text-[12px] text-[var(--dash-muted)]">
                Current status:{" "}
                <span className="font-semibold text-[var(--dash-text)]">{props.status}</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </aside>
  );
}
