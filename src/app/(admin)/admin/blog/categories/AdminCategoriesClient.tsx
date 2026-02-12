"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminUpdateCategory,
} from "@/lib/utils/blog/adminBlogApi";
import { cn } from "@/lib/utils/cn";
import { useAdminTheme } from "@/components/admin/theme/AdminThemeProvider";
import { ConfirmModal, type ConfirmTone } from "@/components/admin/ui/ConfirmModal";
import { Search, Plus, Pencil, Save, X, Trash2, MoreHorizontal, Hash } from "lucide-react";

function DashIconButton({
  title,
  disabled,
  onClick,
  children,
  variant = "neutral",
}: {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "neutral" | "danger";
}) {
  const base = cn(
    "inline-flex h-9 w-9 items-center justify-center rounded-2xl border transition",
    "shadow-[var(--dash-shadow)]/10",
    "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text)]",
    "hover:bg-[var(--dash-surface-2)]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  if (variant === "danger") {
    return (
      <button
        type="button"
        title={title}
        aria-label={title}
        disabled={disabled}
        onClick={onClick}
        className={cn(base, "text-red-500", "hover:bg-red-500/10", "focus-visible:ring-red-500/30")}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={base}
    >
      {children}
    </button>
  );
}

function PrimaryActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition",
        "bg-[var(--dash-red)] text-white hover:brightness-110",
        "shadow-[var(--dash-shadow)]/14",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function RowMenu({
  busy,
  onRename,
  onDelete,
}: {
  busy: boolean;
  onRename: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <DashIconButton title="More actions" disabled={busy} onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="h-4 w-4" />
      </DashIconButton>

      {open ? (
        <div
          className={cn(
            "absolute right-0 z-[60] mt-2 w-44 overflow-hidden rounded-3xl border",
            "border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--dash-shadow)]",
          )}
          role="menu"
        >
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onRename();
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
              "text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)] disabled:opacity-50",
            )}
            role="menuitem"
          >
            <Pencil className="h-4 w-4 text-[var(--dash-muted)]" />
            Rename
          </button>

          <div className="h-px bg-[var(--dash-border)]/80" />

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
              "text-red-500 hover:bg-red-500/10 disabled:opacity-50",
            )}
            role="menuitem"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border px-3 py-2 text-sm transition outline-none",
        "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)] placeholder:text-[var(--dash-muted)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
        props.className,
      )}
    />
  );
}

export default function AdminCategoriesClient({ initialItems }: { initialItems: any[] }) {
  const router = useRouter();
  const { resolvedTheme } = useAdminTheme();
  const isDark = resolvedTheme === "dark";

  const [items, setItems] = React.useState<any[]>(initialItems ?? []);
  const [q, setQ] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmTone, setConfirmTone] = React.useState<ConfirmTone>("danger");
  const [confirmTitle, setConfirmTitle] = React.useState("");
  const [confirmDesc, setConfirmDesc] = React.useState<React.ReactNode>(null);
  const [confirmLabel, setConfirmLabel] = React.useState("Confirm");
  const confirmActionRef = React.useRef<null | (() => Promise<void>)>(null);

  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((c) => `${c.name} ${c.slug}`.toLowerCase().includes(t));
  }, [items, q]);

  async function run(fn: () => Promise<void>) {
    setErr(null);
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  }

  function openConfirm(opts: {
    tone?: ConfirmTone;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    action: () => Promise<void>;
  }) {
    confirmActionRef.current = opts.action;
    setConfirmTone(opts.tone ?? "danger");
    setConfirmTitle(opts.title);
    setConfirmDesc(opts.description ?? null);
    setConfirmLabel(opts.confirmLabel ?? "Confirm");
    setConfirmOpen(true);
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)]">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 -z-10",
          isDark
            ? "bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(220,38,38,0.14),transparent_55%),radial-gradient(900px_500px_at_90%_10%,rgba(255,255,255,0.06),transparent_55%)]"
            : "bg-[radial-gradient(1100px_520px_at_10%_0%,rgba(220,38,38,0.08),transparent_55%),radial-gradient(900px_480px_at_90%_10%,rgba(15,23,42,0.06),transparent_55%)]",
        )}
      />

      <ConfirmModal
        open={confirmOpen}
        tone={confirmTone}
        title={confirmTitle}
        description={confirmDesc}
        confirmLabel={confirmLabel}
        busy={busy}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          const act = confirmActionRef.current;
          setConfirmOpen(false);
          if (!act) return;
          run(act);
        }}
      />

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header card */}
        <div
          className={cn(
            "mb-6 rounded-3xl border p-5 shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
                    "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
                  )}
                >
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-[var(--dash-text)]">
                    Categories
                  </div>
                  <div className="mt-1 text-sm text-[var(--dash-muted)]">
                    Create, rename, and delete categories.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {err ? (
            <div
              className={cn(
                "mt-4 rounded-2xl border px-4 py-3 text-sm",
                isDark
                  ? "border-red-500/25 bg-red-600/15 text-red-50"
                  : "border-red-200 bg-red-50 text-red-900",
              )}
            >
              {err}
            </div>
          ) : null}

          {/* Controls */}
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--dash-muted)]" />
              <TextInput
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search categories…"
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <TextInput
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New category name"
              />
              <PrimaryActionButton
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const name = newName.trim();
                    if (!name) throw new Error("Name required");
                    const created = await adminCreateCategory(name);
                    setItems((prev) => [{ ...created }, ...prev]);
                    setNewName("");
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add
              </PrimaryActionButton>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div
          className={cn(
            "overflow-hidden rounded-3xl border shadow-[var(--dash-shadow)]",
            "border-[var(--dash-border)] bg-[var(--dash-surface)]",
          )}
        >
          {/* subtle top bar */}
          <div
            className={cn(
              "flex items-center justify-between gap-3 border-b px-4 py-3",
              "border-[var(--dash-border)]",
            )}
          >
            <div className="text-sm text-[var(--dash-muted)]">
              Showing{" "}
              <span className="font-semibold text-[var(--dash-text)]">{filtered.length}</span> of{" "}
              <span className="font-semibold text-[var(--dash-text)]">{items.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={cn("border-b", "border-[var(--dash-border)]")}>
                <tr>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Name</th>
                  <th className="px-4 py-3 font-semibold text-[var(--dash-muted)]">Slug</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--dash-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c) => (
                  <Row
                    key={String(c.id)}
                    cat={c}
                    busy={busy}
                    onRename={async (id, name) =>
                      run(async () => {
                        const nm = name.trim();
                        if (!nm) throw new Error("Name required");
                        const updated = await adminUpdateCategory(id, { name: nm });
                        setItems((prev) => prev.map((x) => (String(x.id) === id ? updated : x)));
                      })
                    }
                    onDelete={(id) =>
                      openConfirm({
                        tone: "danger",
                        title: "Delete category?",
                        description: (
                          <span className="text-[var(--dash-muted)]">
                            This cannot be undone. Posts using this category may show without it.
                          </span>
                        ),
                        confirmLabel: "Delete",
                        action: async () => {
                          await adminDeleteCategory(id);
                          setItems((prev) => prev.filter((x) => String(x.id) !== id));
                        },
                      })
                    }
                  />
                ))}

                {!filtered.length ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="text-sm font-semibold text-[var(--dash-text)]">
                          No categories found
                        </div>
                        <div className="mt-1 text-sm text-[var(--dash-muted)]">
                          Try a different search or create a new category.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  cat,
  busy,
  onRename,
  onDelete,
}: {
  cat: any;
  busy: boolean;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(cat.name);

  React.useEffect(() => {
    if (!editing) setName(cat.name);
  }, [cat.name, editing]);

  const id = String(cat.id);

  if (editing) {
    return (
      <tr className={cn("border-b last:border-b-0", "border-[var(--dash-border)]")}>
        <td className="px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "w-full rounded-2xl border px-3 py-2 text-sm transition outline-none",
              "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
              "focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
            )}
            autoFocus
          />
          <div className="mt-1 text-xs text-[var(--dash-muted)]">Press Save to apply changes.</div>
        </td>

        <td className="px-4 py-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-1 text-xs",
              "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
            )}
          >
            {cat.slug}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            <button
              disabled={busy}
              onClick={async () => {
                await onRename(id, name);
                setEditing(false);
              }}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-sm font-semibold transition",
                "bg-[var(--dash-red)] text-white hover:brightness-110",
                "shadow-[var(--dash-shadow)]/12",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
                "disabled:opacity-50",
              )}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <DashIconButton
              title="Cancel"
              disabled={busy}
              onClick={() => {
                setName(cat.name);
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </DashIconButton>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={cn(
        "border-b last:border-b-0",
        "border-[var(--dash-border)] hover:bg-[var(--dash-surface-2)]/60",
      )}
    >
      <td className="px-4 py-3">
        <div className="font-semibold text-[var(--dash-text)]">{cat.name}</div>
      </td>

      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-1 text-xs",
            "border-[var(--dash-border)] bg-[var(--dash-bg)] text-[var(--dash-text)]",
          )}
        >
          {cat.slug}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <DashIconButton title="Rename" disabled={busy} onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
          </DashIconButton>

          <RowMenu busy={busy} onRename={() => setEditing(true)} onDelete={() => onDelete(id)} />
        </div>
      </td>
    </tr>
  );
}
