"use client";

import { Container } from "@/components/layout/Container";

export default function CookiePreferencesPage() {
  const openCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent("npt:open-cookie-preferences"));
  };

  return (
    <main className="bg-[color:var(--color-surface-0-light)] py-14 sm:py-16">
      <Container className="max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[color:var(--color-border-light)] bg-white p-6 shadow-[0_12px_32px_rgba(2,6,23,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--color-text-light)]">
            Cookie Preferences
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
            You can manage optional analytics cookies at any time. Strictly necessary cookies remain
            enabled to support secure and reliable operation of this website.
          </p>

          <div className="mt-6 rounded-xl border border-[color:var(--color-border-light)] bg-[color:var(--color-surface-0-light)]/50 p-4">
            <div className="text-sm font-semibold text-[color:var(--color-text-light)]">
              Current preference controls
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-muted-light)] sm:text-base">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize analytics preference</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={openCookiePreferences}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--color-brand-600)] px-5 text-sm font-semibold text-white hover:bg-[color:var(--color-brand-700)]"
          >
            Open Cookie Preferences
          </button>
        </div>
      </Container>
    </main>
  );
}
