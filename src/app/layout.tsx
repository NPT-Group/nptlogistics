// src/app/layout.tsx
import SessionWrapper from "@/components/ui/SessionWrapper";
import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL("https://nptlogistics.com"),
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NPT Logistics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NPT Logistics",
    description:
      "Reliable freight solutions across North America. Built on compliance, visibility, and execution.",
    images: ["/og-image.png"],
  },
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
      <body className="min-h-dvh">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
