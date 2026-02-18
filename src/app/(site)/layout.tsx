// src/app/(site)/layout.tsx
import type { ReactNode } from "react";
import { Suspense } from "react";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SolutionsHashScroll } from "./components/layout/SolutionsHashScroll";
import { AnalyticsClient } from "./components/analytics/AnalyticsClient";
import ClientChatbot from "./components/ClientChatbot";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Site-only client helpers */}
      <SolutionsHashScroll />
      <Suspense fallback={null}>
        <AnalyticsClient />
      </Suspense>

      {/* Site chrome */}
      <SiteHeader />
      <main id="main-content" className="overflow-x-clip">
        {children}
      </main>

      {/* Lazy-loaded client-only widget */}
      <ClientChatbot />

      <SiteFooter />
    </>
  );
}
