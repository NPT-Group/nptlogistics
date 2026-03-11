"use client";

import * as React from "react";
import { SearchBubbleBase } from "./SearchBubbleBase";

export function DesktopSearchBubble({
  open,
  onOpenChange,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SearchBubbleBase
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      variant="desktop"
    />
  );
}

