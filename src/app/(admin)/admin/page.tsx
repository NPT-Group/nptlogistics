// src/app/(admin)/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">Manage content and system settings.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow)]">
          <div className="text-sm font-semibold">Blog</div>
          <div className="mt-1 text-sm text-[var(--dash-muted)]">
            Create, publish, archive posts.
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow)]">
          <div className="text-sm font-semibold">Job postings</div>
          <div className="mt-1 text-sm text-[var(--dash-muted)]">Create and manage openings.</div>
        </div>

        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--dash-shadow)]">
          <div className="text-sm font-semibold">Settings</div>
          <div className="mt-1 text-sm text-[var(--dash-muted)]">Theme + preferences.</div>
        </div>
      </section>
    </div>
  );
}
