"use client";

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { usePathname, useRouter } from "next/navigation";
import { NAV } from "@/config/navigation";
import { DesktopRichDropdown, SolutionsMegaMenu } from "@/components/layout/header/NavMenuParts";

export function DesktopNav() {
  const [value, setValue] = React.useState<string>("");
  const closeTimer = React.useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  const closeMenu = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setValue("");
  }, []);

  React.useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const navigateToSolutions = React.useCallback(() => {
    closeMenu();

    if (pathname === "/") {
      const section = document.getElementById("solutions");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#solutions") {
          window.history.replaceState(null, "", "#solutions");
        }
        return;
      }
    }

    router.push("/#solutions");
  }, [closeMenu, pathname, router]);

  const navigateToIndustries = React.useCallback(() => {
    closeMenu();

    if (pathname === "/") {
      const section = document.getElementById("industries");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#industries") {
          window.history.replaceState(null, "", "#industries");
        }
        return;
      }
    }

    router.push("/#industries");
  }, [closeMenu, pathname, router]);

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
        onValueChange={(nextValue) => {
          if (closeTimer.current) window.clearTimeout(closeTimer.current);
          setValue(nextValue);
        }}
        delayDuration={0}
        skipDelayDuration={0}
      >
        <NavigationMenu.List className="flex items-center gap-3">
          <SolutionsMegaMenu
            valueKey="solutions"
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
            closeMenu={closeMenu}
            onPrimaryAction={navigateToSolutions}
          />

          <DesktopRichDropdown
            valueKey="industries"
            section={NAV.industries}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
            closeMenu={closeMenu}
            onPrimaryAction={navigateToIndustries}
          />

          <DesktopRichDropdown
            valueKey="company"
            section={NAV.company}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
            closeMenu={closeMenu}
          />

          <DesktopRichDropdown
            valueKey="careers"
            section={NAV.careers}
            value={value}
            openMenu={openMenu}
            scheduleClose={scheduleClose}
            cancelClose={cancelClose}
            closeMenu={closeMenu}
          />
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
