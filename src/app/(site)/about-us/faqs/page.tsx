import type { Metadata } from "next";
import { FAQ_FINAL_CTA } from "@/config/faqs";
import { AboutFinalCta } from "../_components/AboutFinalCta";
import { FaqJsonLd } from "./_components/FaqJsonLd";
import { FaqPageContent } from "./_components/FaqPageContent";

export const metadata: Metadata = {
  title: "FAQs & Shipping Guides",
  description:
    "Find answers to common questions about our freight services, safety, tracking, and operations. Plus shipping guides for shippers and supply chain teams.",
  alternates: {
    canonical: "/about-us/faqs",
  },
  openGraph: {
    title: "FAQs & Shipping Guides | NPT Logistics",
    description:
      "Common questions about NPT Logistics services, compliance, and operations. Enterprise shipping guides and best practices.",
    type: "website",
    url: "/about-us/faqs",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs & Shipping Guides | NPT Logistics",
    description:
      "Common questions about NPT Logistics services, compliance, and operations. Enterprise shipping guides and best practices.",
    images: ["/og-image.png"],
  },
};

export default function FaqsPage() {
  return (
    <>
      <FaqJsonLd />
      <FaqPageContent />
      <AboutFinalCta data={FAQ_FINAL_CTA} variant="faq" />
    </>
  );
}
