import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getIndustrySlugs } from "@/config/industryPages";
import { IndustryPage } from "./_components/IndustryPage";

type RouteParams = { industry: string };

export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ industry: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}): Promise<Metadata> {
  const { industry } = await Promise.resolve(params);
  const model = getIndustryBySlug(industry);
  if (!model) return {};
  return {
    title: model.meta.title,
    description: model.meta.description,
    alternates: { canonical: `https://nptlogistics.com/industries/${model.slug}` },
    openGraph: {
      title: model.meta.title,
      description: model.meta.description,
      type: "website",
      url: `https://nptlogistics.com/industries/${model.slug}`,
      images: model.meta.ogImage ? [model.meta.ogImage] : ["/_optimized/brand/nptLogo-glow.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: model.meta.title,
      description: model.meta.description,
      images: model.meta.ogImage ? [model.meta.ogImage] : ["/_optimized/brand/nptLogo-glow.webp"],
    },
  };
}

export default async function IndustryRoutePage({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}) {
  const { industry } = await Promise.resolve(params);
  const model = getIndustryBySlug(industry);
  if (!model) notFound();
  return <IndustryPage model={model} />;
}
