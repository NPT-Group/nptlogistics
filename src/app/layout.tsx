// src/app/layout.tsx
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { AnalyticsClient } from "@/app/(site)/components/analytics/AnalyticsClient";
import {
  COMPANY_CONTACT,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  toAbsoluteUrl,
} from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NPT Logistics | Reliable Freight Solutions Across North America",
    template: "%s | NPT Logistics",
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: "NPT Logistics",
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
    // "Intermodal freight", // COMMENTED OUT - uncomment to restore
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
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: SITE_DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_DEFAULT_OG_IMAGE],
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "@id": `${SITE_URL}#website`,
                  name: SITE_NAME,
                  url: SITE_URL,
                },
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "@id": `${SITE_URL}#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: toAbsoluteUrl("/_optimized/brand/NPTlogo2.webp"),
                  email: COMPANY_CONTACT.email,
                  telephone: COMPANY_CONTACT.phoneE164,
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "sales",
                      email: COMPANY_CONTACT.email,
                      telephone: COMPANY_CONTACT.phoneE164,
                      areaServed: ["Canada", "United States", "Mexico"],
                      availableLanguage: ["en"],
                    },
                  ],
                  areaServed: ["Canada", "United States", "Mexico"],
                },
              ]),
            }}
          />
          <Suspense fallback={null}>
            <AnalyticsClient />
          </Suspense>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
