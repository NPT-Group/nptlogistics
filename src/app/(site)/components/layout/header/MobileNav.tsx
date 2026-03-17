"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogoImage } from "@/components/media/LogoImage";
import { trackCtaClick } from "@/lib/analytics/cta";
import { cn } from "@/lib/cn";
import { NAV, type NavLink } from "@/config/navigation";
import { focusRingNav, focusRingMenu, NAV_DESKTOP_MEDIA_QUERY } from "./constants";
import {
  X,
  Menu,
  ChevronDown as ChevronDownIcon,
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
} from "lucide-react";

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

function SmallIcon({ name }: { name?: NavLink["icon"] }) {
  if (!name) return null;
  const Cmp = ICONS[name];
  if (!Cmp) return null;

  return (
    <span
      className={cn(
        "grid h-8 w-8 place-items-center rounded-xl",
        "border border-[color:var(--color-menu-border)]",
        "bg-[color:var(--color-menu-icon-bg)]",
      )}
      aria-hidden="true"
    >
      <Cmp className="h-4 w-4 text-[color:var(--color-menu-accent)]" />
    </span>
  );
}

function MobileRowLink({
  href,
  label,
  icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon?: NavLink["icon"];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onNavigate();
      trackCtaClick({
        ctaId: `nav_mobile_menu_${label}`,
        location: "nav_mobile:menu",
        destination: href,
        label,
      });

      const [targetPath, targetHash = ""] = href.split("#");
      const isCareersOverviewTarget =
        targetPath === "/careers" && (targetHash === "" || targetHash === "overview");

      if (!isCareersOverviewTarget || pathname !== "/careers") return;

      event.preventDefault();
      if (window.location.hash !== "#overview") {
        window.history.replaceState(null, "", "#overview");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [href, label, onNavigate, pathname],
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
        "border border-transparent",
        "hover:border-[color:var(--color-menu-border)] hover:bg-[color:var(--color-menu-hover)]",
        "active:translate-y-[1px]",
        focusRingMenu,
      )}
    >
      <SmallIcon name={icon} />
      <span className="text-sm font-medium text-[color:var(--color-menu-title)]">{label}</span>
      <span className="ml-auto text-[color:var(--color-menu-subtle)]" aria-hidden>
        →
      </span>
    </Link>
  );
}

function SectionTrigger({
  label,
  value,
  icon,
  openValue,
}: {
  label: string;
  value: string;
  icon?: NavLink["icon"];
  openValue: string | undefined;
}) {
  const isOpen = openValue === value;

  return (
    <Accordion.Trigger
      className={cn(
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
        // ✅ White card on navy sheet
        "bg-[color:var(--color-menu-bg)]",
        "text-[color:var(--color-menu-title)]",
        "border border-[color:var(--color-menu-border)]",
        "hover:bg-[color:var(--color-menu-hover)]",
        focusRingMenu,
      )}
    >
      <span className="flex items-center gap-3">
        <SmallIcon name={icon} />
        {label}
      </span>

      <ChevronDownIcon
        className={cn(
          "h-4 w-4 transition-transform",
          "text-[color:var(--color-menu-subtle)]",
          isOpen && "rotate-180",
        )}
        aria-hidden
      />
    </Accordion.Trigger>
  );
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  // single-open accordion
  const [active, setActive] = React.useState<string>("");

  // Close mobile dialog when viewport reaches desktop breakpoint (matches Tailwind lg)
  React.useEffect(() => {
    const mq = window.matchMedia(NAV_DESKTOP_MEDIA_QUERY);
    const handle = () => {
      if (mq.matches) {
        setOpen(false);
        setActive("");
      }
    };

    handle();
    mq.addEventListener?.("change", handle);
    return () => mq.removeEventListener?.("change", handle);
  }, []);

  const closeAll = React.useCallback(() => {
    setOpen(false);
    setActive("");
  }, []);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setActive("");
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            // ✅ remove “square outline” feel: no border, cleaner icon button
            "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
            "text-[color:var(--color-nav-text)]",
            "hover:bg-white/10",
            focusRingNav,
          )}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay forceMount asChild>
          <motion.div
            className={cn(
              "fixed inset-0 z-[70] bg-black/55",
              open ? "pointer-events-auto" : "pointer-events-none",
            )}
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{
              duration: 0.50,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </Dialog.Overlay>

        <Dialog.Content forceMount asChild>
          <div
            className={cn(
              "fixed inset-x-0 top-0 z-[70] w-full outline-none",
              open ? "pointer-events-auto" : "pointer-events-none",
            )}
            aria-hidden={!open}
          >
            <VisuallyHidden>
              <Dialog.Title>Navigation</Dialog.Title>
              <Dialog.Description>Mobile navigation menu</Dialog.Description>
            </VisuallyHidden>

            <motion.div
              className={cn(
                "max-h-[100svh] overflow-hidden",
                "bg-[color:var(--color-nav-bg)]",
                "shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
              )}
              initial={false}
              animate={{
                scaleY: open ? 1 : 0,
                opacity: open ? 1 : 0,
              }}
              transition={{
                duration: 0.50,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "top", willChange: "transform, opacity" }}
            >
              <div className="h-16 border-b border-[color:var(--color-nav-border)] px-5">
                <div className="flex h-16 items-center justify-between">
                  <Link
                    href="/"
                    className={cn("inline-flex items-center rounded-md px-1 py-1", focusRingMenu)}
                    aria-label="Home"
                    onClick={closeAll}
                  >
                    <LogoImage
                      src="/_optimized/brand/NPTlogo2.webp"
                      alt="NPT Logistics"
                      width={220}
                      height={80}
                      className="h-auto w-[50px] object-contain sm:w-[50px] md:w-[50px]"
                    />
                  </Link>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-full",
                        "text-[color:var(--color-nav-text)]",
                        "hover:bg-white/10",
                        focusRingNav,
                      )}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              <div className="mt-4 px-5 pb-6">
                {/* CTAs */}
                <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/tracking"
                        onClick={() => {
                          closeAll();
                          trackCtaClick({
                            ctaId: "nav_mobile_track_shipment",
                            location: "nav_mobile:actions",
                            destination: "/tracking",
                            label: "Track Shipment",
                          });
                        }}
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold",
                          "border border-[color:var(--color-nav-border)]",
                          "text-white hover:bg-white/10",
                          focusRingNav,
                        )}
                      >
                        Track Shipment
                      </Link>

                      <Link
                        href="/employee-portal"
                        onClick={() => {
                          closeAll();
                          trackCtaClick({
                            ctaId: "nav_mobile_employee_portal",
                            location: "nav_mobile:actions",
                            destination: "/employee-portal",
                            label: "Employee Portal",
                          });
                        }}
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold",
                          "border border-[color:var(--color-nav-border)]",
                          "text-white hover:bg-white/10",
                          focusRingNav,
                        )}
                      >
                        Employee Portal
                      </Link>
                    </div>

                    <Link
                      href="/quote"
                      onClick={() => {
                        closeAll();
                        trackCtaClick({
                          ctaId: "nav_mobile_request_quote",
                          location: "nav_mobile:actions",
                          destination: "/quote",
                          label: "Request a Quote",
                        });
                      }}
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold",
                        "bg-[color:var(--color-brand-600)] text-white hover:bg-[color:var(--color-brand-700)]",
                        focusRingNav,
                      )}
                    >
                      Request a Quote
                    </Link>
                  </div>

                  {/* Scrollable accordion list */}
                  <div className="mt-4 max-h-[calc(100svh-220px)] overflow-y-auto pb-2">
                    <Accordion.Root
                      type="single"
                      collapsible
                      value={active}
                      onValueChange={setActive}
                      className="space-y-3"
                    >
                      <Accordion.Item value="solutions" className="rounded-xl">
                        <Accordion.Header>
                          <SectionTrigger
                            label={NAV.solutions.label}
                            value="solutions"
                            icon="truck"
                            openValue={active}
                          />
                        </Accordion.Header>

                        <Accordion.Content className="pt-3" asChild>
                          <motion.div
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: "top" }}
                          >
                            {/* ✅ WHITE dropdown panel on navy */}
                            <div className="rounded-2xl border border-[color:var(--color-menu-border)] bg-[color:var(--color-menu-bg)] p-4">
                              <div className="text-xs leading-5 text-[color:var(--color-menu-muted)]">
                                {NAV.solutions.intro.description}
                              </div>

                              <div className="mt-4 space-y-4">
                                {NAV.solutions.categories.map((cat) => (
                                  <div key={cat.title}>
                                    <div className="text-xs font-semibold tracking-wide text-[color:var(--color-menu-subtle)]">
                                      {cat.title}
                                    </div>

                                    <div className="mt-2 space-y-1">
                                      {cat.links.map((l) => (
                                        <MobileRowLink
                                          key={l.href}
                                          href={l.href}
                                          label={l.label}
                                          icon={l.icon}
                                          onNavigate={closeAll}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <Link
                                href={NAV.solutions.intro.ctaHref}
                                onClick={() => {
                                  closeAll();
                                  trackCtaClick({
                                    ctaId: `nav_mobile_intro_${NAV.solutions.intro.ctaLabel}`,
                                    location: "nav_mobile:intro",
                                    destination: NAV.solutions.intro.ctaHref,
                                    label: NAV.solutions.intro.ctaLabel,
                                  });
                                }}
                                className={cn(
                                  "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                                  "text-[color:var(--color-menu-accent)] hover:text-[color:var(--color-menu-accent-hover)]",
                                  "underline-offset-4 hover:underline",
                                  focusRingMenu,
                                )}
                              >
                                {NAV.solutions.intro.ctaLabel} <span aria-hidden>→</span>
                              </Link>
                            </div>
                          </motion.div>
                        </Accordion.Content>
                      </Accordion.Item>

                      {(["industries", "company", "careers"] as const).map((key) => {
                        const section = NAV[key];

                        const sectionIcon: NavLink["icon"] =
                          key === "industries"
                            ? "warehouse"
                            : key === "company"
                              ? "building"
                              : "briefcase";

                        return (
                          <Accordion.Item key={key} value={key} className="rounded-xl">
                            <Accordion.Header>
                              <SectionTrigger
                                label={section.label}
                                value={key}
                                icon={sectionIcon}
                                openValue={active}
                              />
                            </Accordion.Header>

                            <Accordion.Content className="pt-3" asChild>
                              <motion.div
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                exit={{ scaleY: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                style={{ transformOrigin: "top" }}
                              >
                                <div className="rounded-2xl border border-[color:var(--color-menu-border)] bg-[color:var(--color-menu-bg)] p-4">
                                  <div className="text-xs leading-5 text-[color:var(--color-menu-muted)]">
                                    {section.intro.description}
                                  </div>

                                  <div className="mt-4 space-y-1">
                                    {section.links.map((l) => (
                                      <MobileRowLink
                                        key={l.href}
                                        href={l.href}
                                        label={l.label}
                                        icon={l.icon}
                                        onNavigate={closeAll}
                                      />
                                    ))}
                                  </div>

                                  <Link
                                    href={section.intro.ctaHref}
                                    onClick={() => {
                                      closeAll();
                                      trackCtaClick({
                                        ctaId: `nav_mobile_intro_${section.intro.ctaLabel}`,
                                        location: "nav_mobile:intro",
                                        destination: section.intro.ctaHref,
                                        label: section.intro.ctaLabel,
                                      });
                                    }}
                                    className={cn(
                                      "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                                      "text-[color:var(--color-menu-accent)] hover:text-[color:var(--color-menu-accent-hover)]",
                                      "underline-offset-4 hover:underline",
                                      focusRingMenu,
                                    )}
                                  >
                                    {section.intro.ctaLabel} <span aria-hidden>→</span>
                                  </Link>
                                </div>
                              </motion.div>
                            </Accordion.Content>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion.Root>

                    {/* Footer note */}
                    <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/60">
                      For full site navigation and advanced options, please visit the desktop
                      version.
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
