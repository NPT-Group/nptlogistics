// src/app/layout.tsx
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { AnalyticsClient } from "@/app/(site)/components/analytics/AnalyticsClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://nptlogistics.com"),
  title: {
    default: "NPT Logistics | Reliable Freight Solutions Across North America",
    template: "%s | NPT Logistics",
  },
  description:
    "NPT Logistics provides reliable freight transportation across North America, specializing in truckload, LTL, intermodal, and cross-border shipping.",
  applicationName: "NPT Logistics",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/_optimized/brand/NPTlogo2.webp", type: "image/png" },
      { url: "/_optimized/brand/nptLogo-glow.webp", type: "image/png" },
    ],
    shortcut: ["/_optimized/brand/NPTlogo2.webp"],
    apple: [{ url: "/_optimized/brand/NPTlogo2.webp", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  category: "business",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Logistics company",
    "Freight transportation",
    "Truckload shipping",
    "LTL freight",
    "Intermodal freight",
    "Cross-border logistics",
    "North America freight",
    "Flatbed trucking",
    "Dry van trucking",
    "RGN trucking",
    "Freight shipping solutions",
  ],
  authors: [{ name: "NPT Logistics" }],
  creator: "NPT Logistics",
  publisher: "NPT Logistics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "NPT Logistics",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "NPT Logistics",
    title: "NPT Logistics",
    description:
      "Reliable freight solutions across North America. Truckload, LTL, intermodal, and cross-border shipping built on compliance and execution.",
    url: "https://nptlogistics.com",
    locale: "en_US",
    images: [{ url: "/_optimized/brand/nptLogo-glow.webp", width: 1200, height: 630, alt: "NPT Logistics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NPT Logistics",
    description:
      "Reliable freight solutions across North America. Built on compliance, visibility, and execution.",
    images: ["/_optimized/brand/nptLogo-glow.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070a12" },
  ],
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const mode = cookieStore.get("npt.admin.theme.mode")?.value; // light | dark | system

  // Only force a theme when user explicitly chose light/dark.
  const adminTheme = mode === "dark" ? "dark" : mode === "light" ? "light" : undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      {...(adminTheme ? { "data-admin-theme": adminTheme } : {})}
    >
      <body className="min-h-dvh bg-[color:var(--color-surface-0)] text-[color:var(--color-text)]">
        <SessionWrapper>
          <Suspense fallback={null}>
            <AnalyticsClient />
          </Suspense>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
