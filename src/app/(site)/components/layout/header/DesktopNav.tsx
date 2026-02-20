"use client";

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { usePathname, useRouter } from "next/navigation";
import { trackCtaClick } from "@/lib/analytics/cta";
import { NAV } from "@/config/navigation";
import { DesktopRichDropdown, SolutionsMegaMenu } from "./NavMenuParts";

const NAV_OPEN_DELAY_MS = 360;
const NAV_CLOSE_DELAY_MS = 560;

export function DesktopNav() {
  const [value, setValue] = React.useState<string>("");
  const closeTimer = React.useRef<number | null>(null);
  const openTimer = React.useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const openMenu = React.useCallback((v: string) => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => {
      setValue(v);
      openTimer.current = null;
    }, NAV_OPEN_DELAY_MS);
  }, []);

  const scheduleClose = React.useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setValue("");
      closeTimer.current = null;
    }, NAV_CLOSE_DELAY_MS);
  }, []);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const closeMenu = React.useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
    setValue("");
  }, []);

  React.useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const navigateToSolutions = React.useCallback(() => {
    closeMenu();
    trackCtaClick({
      ctaId: "nav_desktop_solutions_overview",
      location: "nav_desktop:solutions_trigger",
      destination: "/#solutions",
      label: "Solutions",
    });

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
    trackCtaClick({
      ctaId: "nav_desktop_industries_overview",
      location: "nav_desktop:industries_trigger",
      destination: "/#industries",
      label: "Industries",
    });

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

  const navigateToCareers = React.useCallback(() => {
    closeMenu();
    trackCtaClick({
      ctaId: "nav_desktop_careers_overview",
      location: "nav_desktop:careers_trigger",
      destination: "/careers#overview",
      label: "Careers",
    });

    if (pathname === "/careers") {
      const section = document.getElementById("overview");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#overview") {
          window.history.replaceState(null, "", "#overview");
        }
        return;
      }
    }

    router.push("/careers#overview");
  }, [closeMenu, pathname, router]);

  React.useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
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
          if (!nextValue) {
            scheduleClose();
            return;
          }
          openMenu(nextValue);
        }}
        delayDuration={NAV_OPEN_DELAY_MS}
        skipDelayDuration={NAV_CLOSE_DELAY_MS}
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
            onPrimaryAction={navigateToCareers}
          />
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
