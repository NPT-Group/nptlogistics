"use client";

import * as React from "react";
import { HeroImage } from "@/components/media/HeroImage";
import { LogoImage } from "@/components/media/LogoImage";

export default function EmployeePortalLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setError("Invalid credentials.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061127]">
      <HeroImage
        src="/brand/loginPgBg.png"
        alt="Employee portal background"
        fill
        priority
        wrapperClassName="absolute inset-0"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.58),rgba(2,8,23,0.82))]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-20">
        <div className="w-full max-w-[390px] rounded-2xl border border-white/15 bg-[rgba(7,20,46,0.65)] p-6 shadow-[0_18px_48px_rgba(2,8,23,0.45)] backdrop-blur-md sm:p-7">
          <div className="mb-5 flex items-center justify-center">
            <LogoImage
              src="/brand/NPTlogo2.png"
              alt="NPT Logistics"
              width={120}
              height={44}
              className="h-auto w-[96px] object-contain"
            />
          </div>

          <h1 className="text-center text-2xl font-semibold text-white">Employee Portal</h1>
          <p className="mt-1 text-center text-xs text-white/70">Secure staff access</p>

          <form className="mt-5 space-y-3" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@email.com"
              className="focus-ring-light w-full rounded-md border border-white/12 bg-[#061b3d]/90 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password"
              className="focus-ring-light w-full rounded-md border border-white/12 bg-[#061b3d]/90 px-3 py-2.5 text-sm text-white placeholder:text-white/45 outline-none"
            />

            {error ? (
              <p className="rounded-md border border-red-300/35 bg-red-500/12 px-3 py-2 text-xs text-red-100">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="focus-ring-light mt-1 inline-flex h-11 w-full items-center justify-center rounded-md bg-[linear-gradient(90deg,#2c67ff,#4a38d8)] text-sm font-semibold text-white transition hover:opacity-95"
            >
              LOG IN
            </button>
          </form>
        </div>
      </section>

      <footer className="absolute inset-x-0 bottom-0 z-20 border-t border-white/20 bg-[linear-gradient(90deg,rgba(5,18,45,0.92),rgba(11,35,80,0.86),rgba(5,18,45,0.92))] py-4 backdrop-blur-sm">
        <p className="text-center text-[13px] font-semibold text-white/90">
          © {currentYear} NPT Logistics Inc. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
