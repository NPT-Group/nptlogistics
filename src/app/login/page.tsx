import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ errorMsg?: string; callbackUrl?: string; error?: string }>
    | { errorMsg?: string; callbackUrl?: string; error?: string };
}) {
  const sp = await Promise.resolve(searchParams);

  // Prefer explicit errorMsg, otherwise map next-auth ?error=...
  const msg =
    sp?.errorMsg ??
    (sp?.error
      ? sp.error === "OAuthSignin"
        ? "Could not start sign-in. Please try again."
        : sp.error === "OAuthCallback"
          ? "Sign-in callback failed. Please try again."
          : sp.error === "AccessDenied"
            ? "Access denied."
            : "Sign-in failed."
      : undefined);

  return <AdminLoginClient errorMsg={msg} callbackUrl={sp?.callbackUrl} />;
}
