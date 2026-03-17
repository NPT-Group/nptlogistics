"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { trackCtaClick } from "@/lib/analytics/cta";

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

type TrackedLinkProps = LinkProps &
  AnchorProps & {
    ctaId: string;
    location: string;
    label?: string;
  };

export function TrackedLink({
  ctaId,
  location,
  label,
  onClick,
  href,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        trackCtaClick({
          ctaId,
          location,
          destination: typeof href === "string" ? href : href.pathname ?? "",
          label,
        });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
