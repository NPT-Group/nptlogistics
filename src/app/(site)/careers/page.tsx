// src/app/(site)/careers/page.tsx
import { nptMetadata } from "@/lib/utils/blog/metadata";
import { getPublicJobsListSSR } from "@/lib/utils/jobs/ssrJobsFetchers";
import CareersClient from "./CareersClient";
import { EEmploymentType, EWorkplaceType } from "@/types/jobPosting.types";

type SearchParams = Record<string, string | string[] | undefined>;

function spGet(sp: SearchParams, key: string) {
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

function toNum(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function enumOrUndefined<T extends string>(v: string | undefined, allowed: readonly T[]) {
  if (!v) return undefined;
  return (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

type SortBy = "publishedAt" | "title" | "createdAt";
type SortDir = "asc" | "desc";

export const metadata = nptMetadata({
  title: "Careers",
  description: "Explore open roles at NPT Logistics and apply online.",
});

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const page = toNum((spGet(sp, "page") ?? "1").toString(), 1);
  const pageSize = toNum((spGet(sp, "pageSize") ?? "12").toString(), 12);

  const q = (spGet(sp, "q") ?? "").toString();
  const department = (spGet(sp, "department") ?? "").toString();
  const location = (spGet(sp, "location") ?? "").toString();

  const workplaceType = enumOrUndefined(
    (spGet(sp, "workplaceType") ?? "").toString() || undefined,
    Object.values(EWorkplaceType) as readonly EWorkplaceType[],
  );

  const employmentType = enumOrUndefined(
    (spGet(sp, "employmentType") ?? "").toString() || undefined,
    Object.values(EEmploymentType) as readonly EEmploymentType[],
  );

  const sortBy: SortBy =
    enumOrUndefined((spGet(sp, "sortBy") ?? "").toString() || undefined, [
      "publishedAt",
      "title",
      "createdAt",
    ] as const) ?? "publishedAt";

  const sortDir: SortDir =
    enumOrUndefined((spGet(sp, "sortDir") ?? "").toString() || undefined, [
      "asc",
      "desc",
    ] as const) ?? "desc";

  const data = await getPublicJobsListSSR({
    page: String(page),
    pageSize: String(pageSize),
    q: q.trim() ? q.trim() : undefined,
    workplaceType,
    employmentType,
    department: department.trim() ? department.trim() : undefined,
    location: location.trim() ? location.trim() : undefined,
    sortBy,
    sortDir,
  });

  const initialQuery = {
    page,
    pageSize,
    q,
    department,
    location,
    workplaceType: workplaceType ?? "",
    employmentType: employmentType ?? "",
    sortBy,
    sortDir,
  };

  return (
    <CareersClient
      initialItems={data.items ?? []}
      initialMeta={data.meta ?? {}}
      initialQuery={initialQuery}
    />
  );
}
