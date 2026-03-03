// src/app/(admin)/components/layout/AdminShell.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderTree,
  MessageSquareText,
  PlusCircle,
  Settings,
  Tags,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import ProfileDropdown from "@/app/(admin)/components/ProfileDropdown";
import { ThemeModeSwitcher } from "../theme/ThemeModeSwitcher";

type IconType = React.ComponentType<{ className?: string }>;

type NavLeaf = {
  href: string;
  label: string;
  Icon: IconType;
};

type NavNode = NavLeaf & {
  children?: NavLeaf[];
};

type NavGroup = {
  label: string;
  items: NavNode[];
};

function isPathActive(pathname: string, href: string) {
  // exact match for /admin
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function isExactPath(pathname: string, href: string) {
  return pathname === href;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const groups: NavGroup[] = [
    {
      label: "NAVIGATION",
      items: [
        {
          href: "/admin/blog",
          label: "Blog",
          Icon: FileText,
          children: [
            { href: "/admin/blog", label: "All posts", Icon: FolderTree },
            { href: "/admin/blog/new", label: "New post", Icon: PlusCircle },
            { href: "/admin/blog/comments", label: "Comments", Icon: MessageSquareText },
            { href: "/admin/blog/categories", label: "Categories", Icon: Tags },
          ],
        },
        {
          href: "/admin/jobs",
          label: "Jobs",
          Icon: Briefcase,
          children: [
            { href: "/admin/jobs", label: "All postings", Icon: FolderTree },
            { href: "/admin/jobs/new", label: "New posting", Icon: PlusCircle },
            { href: "/admin/jobs/applications", label: "Applications", Icon: MessageSquareText },
          ],
        },
      ],
    },
    {
      label: "SYSTEM",
      items: [{ href: "/admin/settings", label: "Settings", Icon: Settings }],
    },
  ];

  // Expand/collapse state for parents that have children
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // Auto-expand the Blog section whenever you're inside /admin/blog/*
  React.useEffect(() => {
    const blogNode = groups
      .flatMap((g) => g.items)
      .find((i) => i.href === "/admin/blog" && i.children?.length);

    if (!blogNode) return;

    const shouldExpand = isPathActive(pathname, "/admin/blog");
    setExpanded((prev) => {
      const cur = prev["/admin/blog"] ?? false;
      if (shouldExpand && !cur) return { ...prev, ["/admin/blog"]: true };
      return prev;
    });
  }, [pathname]);

  function toggleExpand(href: string) {
    setExpanded((prev) => ({ ...prev, [href]: !(prev[href] ?? false) }));
  }

  const sidebarNav = (
    <div className="px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="mb-6 last:mb-0">
          <div className="mb-3 px-2 text-[11px] font-semibold tracking-[0.26em] text-[var(--dash-muted)]">
            {group.label}
          </div>

          <nav className="space-y-1">
            {group.items.map((item) => {
              const active = isPathActive(pathname, item.href);
              const hasChildren = !!item.children?.length;
              const open = hasChildren ? (expanded[item.href] ?? active) : false;

              const Parent = (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[var(--dash-red-soft)]/55 text-[var(--dash-text)]"
                      : "text-[var(--dash-muted)] hover:bg-[var(--dash-surface-2)] hover:text-[var(--dash-text)]",
                  )}
                >
                  <item.Icon className="h-4 w-4 shrink-0 opacity-90" />
                  <span className="truncate">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "ml-auto h-4 w-4 opacity-70 transition-transform",
                        open ? "rotate-180" : "rotate-0",
                      )}
                    />
                  )}
                </div>
              );

              return (
                <div key={item.href}>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.href)}
                      className="w-full rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]"
                      aria-expanded={open}
                      title={item.label}
                    >
                      {Parent}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="block"
                      title={item.label}
                    >
                      {Parent}
                    </Link>
                  )}

                  {/* Minimal children */}
                  <AnimatePresence initial={false}>
                    {hasChildren && open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 space-y-0.5">
                          {item.children!.map((child) => {
                            const childActive =
                              child.href === "/admin/blog" || child.href === "/admin/jobs"
                                ? isExactPath(pathname, child.href)
                                : isPathActive(pathname, child.href);

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "group relative flex items-center gap-3 rounded-xl py-2 pr-3 pl-11 text-[13px] font-medium transition",
                                  childActive
                                    ? "text-[var(--dash-text)]"
                                    : "text-[var(--dash-muted)] hover:text-[var(--dash-text)]",
                                )}
                                title={child.label}
                              >
                                {/* tiny active indicator only when active */}
                                <span
                                  className={cn(
                                    "absolute top-1/2 left-6 h-5 w-[2px] -translate-y-1/2 rounded-full transition-opacity",
                                    childActive
                                      ? "bg-[var(--dash-red)] opacity-100"
                                      : "bg-transparent opacity-0",
                                  )}
                                />
                                <child.Icon
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    childActive
                                      ? "opacity-90"
                                      : "opacity-60 group-hover:opacity-80",
                                  )}
                                />
                                <span className="truncate">{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="mt-6 border-b border-[var(--dash-border)] last:hidden" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--dash-bg,#f6f8fc)] text-[var(--dash-text,rgba(15,23,42,0.95))]">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-[var(--dash-border)] bg-[var(--dash-surface)]/90 backdrop-blur xl:pl-72">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            {/* Collapsible sidebar trigger (below xl only) */}
            <motion.button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className={cn(
                "inline-flex items-center justify-center rounded-full border shadow-sm xl:hidden",
                "h-9 w-9",
                "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-muted)]",
                "hover:bg-[var(--dash-surface-2)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-red-soft)]",
              )}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </motion.button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/brand/NPTlogo2.png"
                alt="NPT Logistics"
                width={220}
                height={80}
                className="h-auto w-[50px] object-contain sm:w-[50px] md:w-[50px]"
                priority
              />
              <span className="hidden text-xs font-semibold tracking-[0.22em] text-[var(--dash-muted)] sm:block">
                ADMIN
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <ThemeModeSwitcher />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop sidebar (xl+) */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 hidden w-72 xl:block",
          "border-r border-[var(--dash-border)] bg-[var(--dash-surface)]",
        )}
      >
        {/* subtle inner glow */}
        <div className="h-full">
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_40%_at_20%_0%,black,transparent)] opacity-60" />
          {sidebarNav}
        </div>
      </aside>

      {/* Main */}
      <div className="w-full xl:pl-72">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
          <main>{children}</main>
        </div>
      </div>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-60 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <motion.div
              className="absolute inset-y-0 left-0 w-80 max-w-[85vw] border-r border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-2xl"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex h-16 items-center justify-between border-b border-[var(--dash-border)] px-4">
                <div className="text-[11px] font-semibold tracking-[0.26em] text-[var(--dash-muted)]">
                  NAVIGATION
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-[var(--dash-muted)] hover:bg-[var(--dash-surface-2)]"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="h-[calc(100%-4rem)] overflow-auto">{sidebarNav}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
