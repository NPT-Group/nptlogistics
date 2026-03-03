"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LogoImage } from "@/components/media/LogoImage";

export default function AdminLoginClient({
  errorMsg,
  callbackUrl,
}: {
  errorMsg?: string;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/blog");
    }
  }, [status, router]);

  const nextUrl = callbackUrl?.trim() ? callbackUrl : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <LogoImage
            src="/brand/NPTlogo2.png"
            alt="NPT Logistics"
            width={220}
            height={80}
            className="h-auto w-[50px] object-contain sm:w-[50px] md:w-[50px]"
          />
          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-1 text-center text-sm text-gray-600">
            Sign in with your company account
          </p>
        </div>

        {errorMsg ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            onClick={() => signIn("azure-ad", { callbackUrl: nextUrl })}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Sign in with Microsoft</span>
            <ArrowRight className="h-5 w-5 opacity-70 transition group-hover:translate-x-0.5" />
          </button>

          <div className="mt-4 text-xs text-gray-500">
            You must be an authorized admin to access <span className="font-medium">/admin</span>.
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          © NPT Group {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
