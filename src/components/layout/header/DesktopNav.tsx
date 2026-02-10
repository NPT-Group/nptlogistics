"use client";

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/cn";
import { NAV } from "@/config/navigation";
import { DesktopRichDropdown, SolutionsMegaMenu } from "@/components/layout/header/NavMenuParts";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-panel-ring)] focus-visible:ring-offset-0";

export function DesktopNav() {
  const [value, setValue] = React.useState<string>("");
  const closeTimer = React.useRef<number | null>(null);

  const openMenu = React.useCallback((v: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setValue(v);
  }, []);

  const scheduleClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setValue(""), 150);
  }, []);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  React.useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      className="relative hidden lg:block"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <NavigationMenu.Root
        value={value}
        onValueChange={setValue}
        delayDuration={0}
        skipDelayDuration={0}
      >
        <NavigationMenu.List className="flex items-center gap-1">
          <SolutionsMegaMenu
            valueKey="solutions"
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
          />

          <DesktopRichDropdown
            valueKey="industries"
            section={NAV.industries}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
          />

          <DesktopRichDropdown
            valueKey="company"
            section={NAV.company}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
          />

          <DesktopRichDropdown
            valueKey="careers"
            section={NAV.careers}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
          />
        </NavigationMenu.List>

        <NavigationMenu.Viewport
          className={cn(
            "fixed top-16 right-0 left-0 z-50",
            "origin-top-center perspective",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out data-[state=open]:fade-in",
          )}
        />

        <span className={cn("sr-only", focusRing)} />
      </NavigationMenu.Root>
    </div>
  );
}
