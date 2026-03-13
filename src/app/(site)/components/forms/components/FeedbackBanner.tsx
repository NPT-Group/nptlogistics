// src/app/(site)/components/forms/components/FeedbackBanner.tsx
"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type FeedbackTone = "success" | "error" | "info";

export interface FeedbackBannerMetaItem {
  label: string;
  value: React.ReactNode;
  emphasis?: "default" | "code";
}

export interface FeedbackBannerData {
  tone: FeedbackTone;
  title: string;
  message: string;
  meta?: FeedbackBannerMetaItem[];
}

interface FeedbackBannerProps {
  feedback: FeedbackBannerData | null;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function FeedbackBanner({ feedback, innerRef, className }: FeedbackBannerProps) {
  if (!feedback) return null;

  const isSuccess = feedback.tone === "success";
  const isError = feedback.tone === "error";

  return (
    <div
      ref={innerRef}
      tabIndex={-1}
      aria-live="polite"
      className={cn(
        "rounded-2xl border px-4 py-4 sm:px-5",
        isSuccess && "border-emerald-200 bg-emerald-50 text-emerald-950",
        isError && "border-red-200 bg-red-50 text-red-950",
        feedback.tone === "info" && "border-sky-200 bg-sky-50 text-sky-950",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
            isSuccess && "border-emerald-200 bg-white text-emerald-700",
            isError && "border-red-200 bg-white text-red-700",
            feedback.tone === "info" && "border-sky-200 bg-white text-sky-700",
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : isError ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{feedback.title}</p>
          <p className="mt-1 text-sm leading-relaxed">{feedback.message}</p>

          {feedback.meta?.length ? (
            <div className="mt-3 space-y-2 text-sm">
              {feedback.meta.map((item, index) => (
                <div key={`${item.label}-${index}`}>
                  <span className="font-medium">{item.label}: </span>
                  {item.emphasis === "code" ? (
                    <span
                      className={cn(
                        "rounded-md bg-white px-2 py-1 font-mono font-semibold tracking-wide ring-1",
                        isSuccess && "text-emerald-900 ring-emerald-200",
                        isError && "text-red-900 ring-red-200",
                        feedback.tone === "info" && "text-sky-900 ring-sky-200",
                      )}
                    >
                      {item.value}
                    </span>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
