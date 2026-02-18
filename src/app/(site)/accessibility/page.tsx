import { Container } from "@/app/(site)/components/layout/Container";
import Link from "next/link";

const LAST_UPDATED = "February 17, 2026";

export default function AccessibilityPage() {
  return (
    <main className="bg-[color:var(--color-surface-0-light)] py-14 sm:py-16">
      <Container className="max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_12px_32px_rgba(2,6,23,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--color-text-light)]">
            Accessibility Statement
          </h1>
          <p className="mt-2 text-xs text-[color:var(--color-muted-light)]">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            NPT Logistics is committed to making our digital experiences accessible to all users,
            including people using assistive technologies.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Our accessibility approach
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            <li>Clear heading structure and readable text contrast.</li>
            <li>Keyboard-accessible navigation and interactive controls.</li>
            <li>Focus indicators for actionable elements.</li>
            <li>Responsive layouts across desktop and mobile devices.</li>
            <li>Ongoing monitoring and incremental accessibility improvements.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[color:var(--color-text-light)]">
            Feedback and support
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            If you experience accessibility barriers or need support accessing content, please
            contact us and include the page URL and a short description of the issue so we can
            address it promptly.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            Contact us via the{" "}
            <Link href="/contact" className="font-semibold text-[color:var(--color-brand-600)]">
              contact page
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
