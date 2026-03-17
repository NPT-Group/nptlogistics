// src/lib/chatbot/widgets/_shared.tsx
"use client";

import type { PropsWithChildren } from "react";

type ChatButtonProps = PropsWithChildren<{
  onClick: () => void;
  type?: "button" | "submit" | "reset";
}>;

const baseClassName =
  "inline-flex items-center rounded-xl p-2 text-sm font-medium transition-colors";

export function ResponseButton({ onClick, children, type = "button" }: ChatButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        baseClassName,
        "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function LinkButton({ onClick, children, type = "button" }: ChatButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        baseClassName,
        "border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
