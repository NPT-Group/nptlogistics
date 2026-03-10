import { SITE_NAME, SITE_URL, toAbsoluteUrl } from "@/lib/seo/site";

type Props = {
  post: any;
  slug: string;
};

export function BlogPostJsonLd({ post, slug }: Props) {
  const canonical = toAbsoluteUrl(`/blog/${slug}`);
  const image = post?.bannerImage?.url
    ? String(post.bannerImage.url).startsWith("http")
      ? String(post.bannerImage.url)
      : new URL(String(post.bannerImage.url), SITE_URL).toString()
    : toAbsoluteUrl("/_optimized/brand/nptLogo-glow.webp");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title ?? "NPT Logistics Blog",
    description: post?.excerpt ?? "Insights and updates from NPT Logistics.",
    image: [image],
    datePublished: post?.publishedAt ?? post?.createdAt ?? undefined,
    dateModified: post?.updatedAt ?? post?.publishedAt ?? post?.createdAt ?? undefined,
    author: {
      "@type": "Person",
      name: post?.author?.name ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/_optimized/brand/NPTlogo2.webp"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

