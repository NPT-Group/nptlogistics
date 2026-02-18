"use client";

import * as React from "react";
import { HEADER_HEIGHT_PX } from "@/app/(site)/components/layout/header/constants";
import { SERVICE_ANCHOR_GAP_PX } from "@/app/(site)/services/_constants";

type Props = {
  children: React.ReactNode;
};

/**
 * Provides CSS variables used for:
 * - sticky subnav top offset
 * - section scroll-margin-top offsets
 *
 * NOTE:
 * - --service-subnav-h is set initially to a safe default and then measured
 *   and overridden by ServiceSubnav via ResizeObserver.
 */
export function ServicePageShell({ children }: Props) {
  return (
    <div
      data-service-shell
      style={
        {
          "--service-header-h": `${HEADER_HEIGHT_PX}px`,
          "--service-subnav-h": "56px", // safe initial default; overwritten after measurement
          "--service-anchor-gap": `${SERVICE_ANCHOR_GAP_PX}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
