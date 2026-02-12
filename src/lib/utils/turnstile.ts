// src/lib/utils/turnstile.ts
import { TURNSTILE_SECRET_KEY } from "@/config/env";

type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  "error-codes"?: string[];
};

function pickIpFromHeaders(headers: Headers): string | undefined {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;

  const xff = headers.get("x-forwarded-for");
  if (!xff) return undefined;

  // x-forwarded-for can be "client, proxy1, proxy2"
  const first = xff.split(",")[0]?.trim();
  return first || undefined;
}

export async function verifyTurnstileToken(opts: {
  token: string;
  ip?: string;
  expectedAction?: string; // optional if you set action on frontend
}): Promise<{ ok: true } | { ok: false; reason: string; codes?: string[] }> {
  const token = (opts.token || "").trim();
  if (!token) return { ok: false, reason: "Missing Turnstile token" };

  const secret = (TURNSTILE_SECRET_KEY || "").trim();
  if (!secret) return { ok: false, reason: "Turnstile secret key is not configured" };

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (opts.ip) form.set("remoteip", opts.ip);

  let data: TurnstileVerifyResponse | null = null;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });

    data = (await res.json().catch(() => null)) as TurnstileVerifyResponse | null;

    if (!res.ok || !data) {
      return { ok: false, reason: "Turnstile verification request failed" };
    }
  } catch {
    return { ok: false, reason: "Turnstile verification network error" };
  }

  if (!data.success) {
    return { ok: false, reason: "Turnstile verification failed", codes: data["error-codes"] };
  }

  // Optional: enforce action match if your widget sets `action`
  if (opts.expectedAction && data.action && data.action !== opts.expectedAction) {
    return { ok: false, reason: "Turnstile action mismatch" };
  }

  return { ok: true };
}

export function getRequestIp(headers: Headers): string | undefined {
  return pickIpFromHeaders(headers);
}
