import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SolutionsHashScroll } from "@/components/layout/SolutionsHashScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://nptlogistics.com"), // change later if needed
  title: {
    default: "NPT Logistics|Flatbed, Dry Van, RGN & Shipmemt Trucking Solutions",
    template: "%s | NPT Logistics",
  },
  description:
    "NPT Logistics provides reliable freight transportation across North America, specializing in truckload, LTL, intermodal, and cross-border shipping.",
  applicationName: "NPT Logistics",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Logistics company",
    "Freight transportation",
    "Truckload shipping",
    "LTL freight",
    "Cross-border logistics",
    "North America freight",
  ],
  authors: [{ name: "NPT Logistics" }],
  creator: "NPT Logistics",
  publisher: "NPT Logistics",

  openGraph: {
    type: "website",
    siteName: "NPT Logistics",
    title: "NPT Logistics",
    description:
      "Reliable freight solutions across North America. Truckload, LTL, intermodal, and cross-border shipping built on compliance and execution.",
    url: "https://nptlogistics.com",
    images: [
      {
        url: "/og-image.png", // placeholder for now
        width: 1200,
        height: 630,
        alt: "NPT Logistics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NPT Logistics",
    description:
      "Reliable freight solutions across North America. Built on compliance, visibility, and execution.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[color:var(--color-surface-0)] text-[color:var(--color-text)]">
        <SolutionsHashScroll />
        <SiteHeader />
        <div className="overflow-x-clip">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
