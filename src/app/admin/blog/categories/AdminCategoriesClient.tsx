// src/app/admin/blog/categories/AdminCategoriesClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { adminCreateCategory, adminDeleteCategory, adminUpdateCategory } from "@/lib/utils/blog/adminBlogApi";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, Search, Plus, Pencil, Save, X, Trash2, MoreHorizontal, Hash } from "lucide-react";

function IconButton({
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
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-gray-900/5 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = variant === "danger" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-gray-200 text-gray-700 hover:bg-gray-50";
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled} onClick={onClick} className={cn(base, styles)}>
      {children}
    </button>
  );
}

function PrimaryButton({ disabled, onClick, children }: { disabled?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition",
        "bg-gray-900 text-white hover:bg-gray-800",
        "focus:outline-none focus:ring-4 focus:ring-gray-900/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function RowMenu({ busy, onRename, onDelete }: { busy: boolean; onRename: () => void; onDelete: () => void }) {
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
      <IconButton title="More actions" disabled={busy} onClick={() => setOpen((v) => !v)}>
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg" role="menu">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onRename();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            role="menuitem"
          >
            <Pencil className="h-4 w-4" />
            Rename
          </button>

          <div className="h-px bg-gray-100" />

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
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

export default function AdminCategoriesClient({ initialItems }: { initialItems: any[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState<any[]>(initialItems ?? []);
  const [q, setQ] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header card */}
        <div className="mb-6 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-gray-900">Categories</div>
                  <div className="mt-1 text-sm text-gray-500">Create, rename, and delete categories.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/admin/blog")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-900/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to posts
            </button>
          </div>

          {err ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div> : null}

          {/* Controls */}
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search categories…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-4 focus:ring-gray-900/5"
              />
            </div>

            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New category name"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-gray-900/5"
              />
              <PrimaryButton
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
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-sm">
          {/* subtle top bar */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-200/70 bg-gray-50/50 px-4 py-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of <span className="font-semibold text-gray-900">{items.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200/70 bg-gray-50/60">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Slug</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
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
                        const updated = await adminUpdateCategory(id, { name });
                        setItems((prev) => prev.map((x) => (String(x.id) === id ? updated : x)));
                      })
                    }
                    onDelete={async (id) =>
                      run(async () => {
                        const ok = window.confirm("Delete category?");
                        if (!ok) return;
                        await adminDeleteCategory(id);
                        setItems((prev) => prev.filter((x) => String(x.id) !== id));
                      })
                    }
                  />
                ))}

                {!filtered.length ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="text-sm font-semibold text-gray-900">No categories found</div>
                        <div className="mt-1 text-sm text-gray-500">Try a different search or create a new category.</div>
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

function Row({ cat, busy, onRename, onDelete }: { cat: any; busy: boolean; onRename: (id: string, name: string) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(cat.name);

  // keep input in sync if list refreshes underneath us
  React.useEffect(() => {
    if (!editing) setName(cat.name);
  }, [cat.name, editing]);

  const id = String(cat.id);

  if (editing) {
    return (
      <tr className="border-b border-gray-100 last:border-b-0">
        <td className="px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-gray-900/5"
            autoFocus
          />
          <div className="mt-1 text-xs text-gray-500">Press Save to apply changes.</div>
        </td>

        <td className="px-4 py-3 text-gray-600">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">{cat.slug}</span>
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            <button
              disabled={busy}
              onClick={async () => {
                await onRename(id, name.trim());
                setEditing(false);
              }}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold shadow-sm transition",
                "bg-gray-900 text-white hover:bg-gray-800",
                "focus:outline-none focus:ring-4 focus:ring-gray-900/10",
                "disabled:opacity-50",
              )}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <IconButton
              title="Cancel"
              disabled={busy}
              onClick={() => {
                setName(cat.name);
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-gray-900">{cat.name}</div>
        </div>
      </td>

      <td className="px-4 py-3 text-gray-600">
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">{cat.slug}</span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {/* quick rename icon */}
          <IconButton title="Rename" disabled={busy} onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
          </IconButton>

          {/* kebab for destructive */}
          <RowMenu busy={busy} onRename={() => setEditing(true)} onDelete={() => onDelete(id)} />
        </div>
      </td>
    </tr>
  );
}
