"use client";

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { NAV, type NavLink } from "@/config/navigation";
import {
  Truck,
  Package,
  TrainFront,
  Zap,
  Shield,
  Snowflake,
  Globe,
  Warehouse,
  Briefcase,
  Building2,
  MapPinned,
  Phone,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import {
  focusRingNav,
  focusRingMenu,
  HEADER_HEIGHT_PX,
  GAP_BELOW_TRIGGER,
  VIEWPORT_PADDING,
} from "./constants";

const ICONS = {
  truck: Truck,
  package: Package,
  train: TrainFront,
  zap: Zap,
  shield: Shield,
  snowflake: Snowflake,
  globe: Globe,
  warehouse: Warehouse,
  briefcase: Briefcase,
  building: Building2,
  map: MapPinned,
  phone: Phone,
} as const;

function Icon({ name }: { name?: NavLink["icon"] }) {
  if (!name) return null;
  const Cmp = ICONS[name];
  if (!Cmp) return null;

  return (
    <span
      className={cn(
        "grid h-9 w-9 place-items-center rounded-xl",
        "border border-[color:var(--color-menu-border)]",
        "bg-[color:var(--color-menu-icon-bg)]",
      )}
      aria-hidden="true"
    >
      <Cmp className="h-[18px] w-[18px] text-[color:var(--color-menu-accent)]" />
    </span>
  );
}

function MenuLink({
  href,
  label,
  description,
  icon,
  children,
  onNavigate,
}: NavLink & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const handleLinkClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
      onNavigate?.();

      const [targetPath, targetHash = ""] = targetHref.split("#");
      const isCareersOverviewTarget =
        targetPath === "/careers" && (targetHash === "" || targetHash === "overview");

      if (!isCareersOverviewTarget || pathname !== "/careers") return;

      event.preventDefault();
      if (window.location.hash !== "#overview") {
        window.history.replaceState(null, "", "#overview");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onNavigate, pathname],
  );

  return (
    <div className="rounded-xl">
      <NavigationMenu.Link asChild>
        <Link
          href={href}
          onClick={(event) => handleLinkClick(event, href)}
          className={cn(
            "group block cursor-pointer rounded-2xl p-3 transition",
            "border border-transparent",
            "hover:border-[color:var(--color-menu-border)]",
            "hover:bg-[color:var(--color-menu-hover)]",
            "hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)]",
            "active:translate-y-[1px]",
            focusRingMenu,
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Icon name={icon} />
            </div>

            <div className="min-w-0">
              <div
                className={cn(
                  "text-sm leading-5 font-semibold",
                  "text-[color:var(--color-menu-title)]",
                )}
              >
                {label}
              </div>

              {description ? (
                <div className="mt-1 text-xs leading-[1.45] whitespace-normal text-[color:var(--color-menu-muted)]">
                  {description}
                </div>
              ) : null}
            </div>
          </div>
        </Link>
      </NavigationMenu.Link>

      {children?.length ? (
        <div className="mt-1 space-y-1 pl-[3.25rem]">
          {children.map((child) => (
            <NavigationMenu.Link key={child.href} asChild>
              <Link
                href={child.href}
                onClick={(event) => handleLinkClick(event, child.href)}
                className={cn(
                  "group block cursor-pointer rounded-xl px-3 py-2 text-sm transition",
                  "text-[color:var(--color-menu-muted)]",
                  "hover:text-[color:var(--color-menu-title)]",
                  "hover:bg-[color:var(--color-menu-hover)]",
                  focusRingMenu,
                )}
              >
                <span className="inline-flex items-start gap-2">
                  <span className="mt-[0.38rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-menu-accent)] opacity-40 group-hover:opacity-80" />
                  {child.label}
                </span>
              </Link>
            </NavigationMenu.Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AnimatedPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.992 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Base dropdown container (position set via inline style from trigger rect) */
const dropdownShellBase = cn(
  "fixed z-50",
  "rounded-[22px] border shadow-2xl",
  "border-[color:var(--color-menu-border)]",
  "bg-[color:var(--color-menu-bg)]",
  "ring-1 ring-black/5",
  "overflow-hidden",
);

function getDropdownStyle(
  triggerRect: { left: number; bottom: number } | null,
  desiredWidth: number,
): React.CSSProperties {
  if (!triggerRect) {
    return { left: 0, top: HEADER_HEIGHT_PX, width: desiredWidth };
  }
  const top = triggerRect.bottom + GAP_BELOW_TRIGGER;
  if (typeof window === "undefined") {
    return { left: triggerRect.left, top, width: desiredWidth };
  }
  const vw = window.innerWidth;
  const width = desiredWidth;
  const left = Math.max(
    VIEWPORT_PADDING,
    Math.min(triggerRect.left, vw - width - VIEWPORT_PADDING),
  );
  return { left, top, width };
}

const NavTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    label: string;
    onMouseEnter: () => void;
    onFocus: () => void;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }
>(function NavTrigger({ label, onMouseEnter, onFocus, onClick }, ref) {
  return (
    <NavigationMenu.Trigger
      ref={ref}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
        "text-[color:var(--color-nav-text)] hover:text-[color:var(--color-nav-text)]",
        "hover:bg-[color:var(--color-nav-hover)]",
        focusRingNav,
      )}
    >
      {label}
      <ChevronDownIcon className="h-4 w-4 text-[color:var(--color-nav-text)]" aria-hidden />
    </NavigationMenu.Trigger>
  );
});
NavTrigger.displayName = "NavTrigger";

type TriggerRect = { left: number; top: number; bottom: number; width: number } | null;

const SOLUTIONS_WIDTH = 1200;
const INDUSTRIES_WIDTH = 720;
const CAREERS_WIDTH = 600;

export function SolutionsMegaMenu({
  valueKey,
  value,
  openMenu,
  scheduleClose,
  cancelClose,
  closeMenu,
  onPrimaryAction,
}: {
  valueKey: string;
  value: string;
  openMenu: (v: string) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  closeMenu: () => void;
  onPrimaryAction: () => void;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = React.useState<TriggerRect>(null);

  React.useLayoutEffect(() => {
    if (value !== valueKey) {
      setTriggerRect(null);
      return;
    }
    const el = triggerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setTriggerRect({ left: r.left, top: r.top, bottom: r.bottom, width: r.width });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [value, valueKey]);

  const style = getDropdownStyle(triggerRect, SOLUTIONS_WIDTH);

  return (
    <NavigationMenu.Item value={valueKey}>
      <NavTrigger
        ref={triggerRef}
        label={NAV.solutions.label}
        onMouseEnter={() => openMenu(valueKey)}
        onFocus={() => openMenu(valueKey)}
        onClick={(event) => {
          // Trigger click should navigate, not toggle menu open/close.
          event.preventDefault();
          event.stopPropagation();
          onPrimaryAction();
        }}
      />

      <NavigationMenu.Content
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={dropdownShellBase}
        style={style}
      >
        <AnimatePresence mode="wait">
          <AnimatedPanel>
            <div className="grid max-w-[calc(100vw-2rem)] grid-cols-12">
              <div className="col-span-3 flex flex-col bg-[color:var(--color-menu-panel)] p-6">
                <div className="text-[15px] font-semibold text-[color:var(--color-menu-title)]">
                  {NAV.solutions.intro.title}
                </div>
                <p className="mt-2 text-sm leading-[1.5] text-[color:var(--color-menu-muted)]">
                  {NAV.solutions.intro.description}
                </p>

                <div className="mt-auto pt-6">
                  <Link
                    href={NAV.solutions.intro.ctaHref}
                    onClick={closeMenu}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 text-sm font-semibold",
                      "text-[color:var(--color-menu-accent)] hover:text-[color:var(--color-menu-accent-hover)]",
                      "underline-offset-4 hover:underline",
                      focusRingMenu,
                    )}
                  >
                    {NAV.solutions.intro.ctaLabel} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              <div className="col-span-9 p-6">
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  {NAV.solutions.categories.map((cat) => (
                    <div key={cat.title} className="min-w-0">
                      <div className="pb-2 text-xs font-semibold tracking-wide text-[color:var(--color-menu-subtle)]">
                        {cat.title}
                      </div>
                      <div className="grid gap-2">
                        {cat.links.map((l) => (
                          <div
                            key={l.href}
                            className={cn(l.href === "/services/ltl" && "mt-14")}
                          >
                            <MenuLink {...l} onNavigate={closeMenu} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedPanel>
        </AnimatePresence>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export function DesktopRichDropdown({
  valueKey,
  section,
  value,
  openMenu,
  scheduleClose,
  cancelClose,
  closeMenu,
  onPrimaryAction,
}: {
  valueKey: string;
  section: typeof NAV.industries | typeof NAV.company | typeof NAV.careers;
  value: string;
  openMenu: (v: string) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  closeMenu: () => void;
  onPrimaryAction?: () => void;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = React.useState<TriggerRect>(null);
  const isCareers = valueKey === "careers";
  const desiredWidth = isCareers ? CAREERS_WIDTH : INDUSTRIES_WIDTH;

  React.useLayoutEffect(() => {
    if (value !== valueKey) {
      setTriggerRect(null);
      return;
    }
    const el = triggerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setTriggerRect({ left: r.left, top: r.top, bottom: r.bottom, width: r.width });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [value, valueKey]);

  const style = getDropdownStyle(triggerRect, desiredWidth);

  return (
    <NavigationMenu.Item value={valueKey}>
      <NavTrigger
        ref={triggerRef}
        label={section.label}
        onMouseEnter={() => openMenu(valueKey)}
        onFocus={() => openMenu(valueKey)}
        onClick={(event) => {
          if (onPrimaryAction) {
            event.preventDefault();
            event.stopPropagation();
            onPrimaryAction();
            return;
          }
          openMenu(valueKey);
        }}
      />

      <NavigationMenu.Content
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={dropdownShellBase}
        style={style}
      >
        <AnimatePresence mode="wait">
          <AnimatedPanel>
            <div className="grid grid-cols-12">
              <div className="col-span-4 flex flex-col bg-[color:var(--color-menu-panel)] p-6">
                <div className="text-[15px] font-semibold text-[color:var(--color-menu-title)]">
                  {section.intro.title}
                </div>
                <p className="mt-2 text-sm leading-[1.5] text-[color:var(--color-menu-muted)]">
                  {section.intro.description}
                </p>

                <div className="mt-auto pt-6">
                  <Link
                    href={section.intro.ctaHref}
                    onClick={closeMenu}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 text-sm font-semibold",
                      "text-[color:var(--color-menu-accent)] hover:text-[color:var(--color-menu-accent-hover)]",
                      "underline-offset-4 hover:underline",
                      focusRingMenu,
                    )}
                  >
                    {section.intro.ctaLabel} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              <div className="col-span-8 min-w-0 p-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {section.links.map((l, i) => (
                    <div key={l.href} className={cn(isCareers && i === 2 && "col-span-2")}>
                      <MenuLink {...l} onNavigate={closeMenu} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedPanel>
        </AnimatePresence>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}
