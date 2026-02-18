// src/app/(admin)/components/theme/AdminThemeProvider.tsx
"use client";

import React, { createContext, useEffect, useMemo, useRef, useState } from "react";

export type AdminThemeMode = "light" | "dark" | "system";

type AdminThemeContextValue = {
  mode: AdminThemeMode;
  resolvedTheme: "light" | "dark";
  setMode: (mode: AdminThemeMode) => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

const STORAGE_KEY = "npt.admin.theme.mode";
const COOKIE_KEY = "npt.admin.theme.mode";

function setThemeCookie(mode: AdminThemeMode) {
  try {
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(mode)}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // ignore
  }
}

function resolveTheme(mode: AdminThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

export function useAdminTheme() {
  const ctx = React.useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}

export function AdminThemeProvider({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode?: AdminThemeMode;
}) {
  const didInitRef = useRef(false);
  const [mode, setModeState] = useState<AdminThemeMode>(initialMode ?? "system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    // Deterministic on server + first client render (prevents hydration mismatch)
    if (initialMode === "dark") return "dark";
    if (initialMode === "light") return "light";
    return "light";
  });

  // Load persisted mode once
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") setModeState(raw);
    } catch {
      // ignore
    }
  }, []);

  // Keep resolved theme in sync (including system changes)
  useEffect(() => {
    const apply = () => setResolvedTheme(resolveTheme(mode));
    apply();

    if (mode !== "system") return;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;

    const handler = () => apply();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    (mql as any).addListener?.(handler);
    return () => (mql as any).removeListener?.(handler);
  }, [mode]);

  // Apply theme to <html> for CSS vars (do NOT override the init script)
  useEffect(() => {
    try {
      const html = document.documentElement;

      // On first mount, if the init script already set a theme, adopt it.
      if (!didInitRef.current) {
        const existing = html.dataset.adminTheme;
        if (existing === "light" || existing === "dark") {
          if (existing !== resolvedTheme) setResolvedTheme(existing);
        } else {
          html.dataset.adminTheme = resolvedTheme;
        }
        didInitRef.current = true;
        return;
      }

      // After first mount, react to theme changes normally.
      html.dataset.adminTheme = resolvedTheme;
    } catch {
      // ignore
    }
  }, [resolvedTheme]);

  const value = useMemo<AdminThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode: (next) => {
        setModeState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // ignore
        }
        setThemeCookie(next);
      },
    }),
    [mode, resolvedTheme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      <div className="admin-root min-h-screen">{children}</div>
    </AdminThemeContext.Provider>
  );
}
