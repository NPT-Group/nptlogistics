import { nptMetadata } from "@/lib/utils/blog/metadata";
import { getPublicJobsListSSR } from "@/lib/utils/jobs/ssrJobsFetchers";
import JobsIndexClient from "./JobsIndexClient";

export const metadata = nptMetadata({
  title: "Jobs",
  description: "Explore open roles at NPT Logistics and apply online.",
});

export default async function JobsIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const page = typeof sp.page === "string" ? sp.page : "1";
  const pageSize = typeof sp.pageSize === "string" ? sp.pageSize : "12";
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const workplaceType = typeof sp.workplaceType === "string" ? sp.workplaceType : undefined;
  const employmentType = typeof sp.employmentType === "string" ? sp.employmentType : undefined;
  const department = typeof sp.department === "string" ? sp.department : undefined;
  const location = typeof sp.location === "string" ? sp.location : undefined;

  const data = await getPublicJobsListSSR({
    page,
    pageSize,
    q,
    workplaceType,
    employmentType,
    department,
    location,
  });

  return <JobsIndexClient initialItems={data.items ?? []} initialMeta={data.meta ?? {}} />;
}
