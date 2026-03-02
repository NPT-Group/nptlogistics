// src/app/(site)/layout.tsx
import type { ReactNode } from "react";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SolutionsHashScroll } from "./components/layout/SolutionsHashScroll";
import ClientChatbot from "./components/ClientChatbot";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Site-only client helpers */}
      <SolutionsHashScroll />

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
