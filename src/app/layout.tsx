// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "NPT Logistics",
  description: "Modern logistics built on reliability, compliance, and clear communication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[color:var(--color-surface-0)] text-[color:var(--color-text)]">
        <SiteHeader />

        {/* Clip ONLY the scrolling content, not the header */}
        <div className="overflow-x-clip">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
