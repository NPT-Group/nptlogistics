// src/components/layout/footer/CookiePreferencesButton.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function CookiePreferencesButton({ className }: { className?: string }) {
  const openCookiePreferences = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent("npt:open-cookie-preferences"));
  }, []);

  return (
    <button type="button" onClick={openCookiePreferences} className={cn(className)}>
      Cookie Preferences
    </button>
  );
}
