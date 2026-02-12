// src/app/(site)/layout.tsx
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SolutionsHashScroll } from "@/components/layout/SolutionsHashScroll";
import GuidedChatbot from "@/lib/chatbot/GuidedChatbot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[color:var(--color-surface-0)] text-[color:var(--color-text)]">
      <SolutionsHashScroll />
      <SiteHeader />
      <div className="overflow-x-clip">
        {children}
        <SiteFooter />
      </div>
      <GuidedChatbot />
    </div>
  );
}
