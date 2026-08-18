import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Server misconfiguration — check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET and DATABASE_URL are all set.",
  AccessDenied: "Access was denied for that account.",
  Verification: "The sign-in link is no longer valid.",
  OAuthAccountNotLinked: "That email is already linked with a different sign-in method.",
  Default: "Something went wrong while signing in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { error } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.Default : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ink-950)] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-10 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--signal-line)] bg-[var(--signal-soft)]">
          <span className="pulse-dot" />
        </div>

        <h1 className="font-display text-3xl text-[var(--paper)]">Welcome to Novaraa</h1>
        <p className="mt-2.5 text-[13.5px] text-[var(--paper-dim)]">Sign in to continue</p>

        {message && (
          <p className="mt-6 rounded-xl border border-[var(--danger-soft)] bg-[var(--danger-soft)] p-3 text-[13px] text-[var(--paper)]">
            {message}
          </p>
        )}

        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
