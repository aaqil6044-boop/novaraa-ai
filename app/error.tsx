"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--ink-950)] p-6 text-center">
      <h1 className="font-display text-2xl text-[var(--paper)]">Something went wrong</h1>
      <p className="max-w-md text-[13.5px] text-[var(--paper-dim)]">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-[var(--signal)] px-4 py-2 text-[13px] font-semibold text-[var(--ink-950)] hover:brightness-110"
        >
          <RotateCcw size={14} /> Try again
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full border border-[var(--ink-600)] px-4 py-2 text-[13px] text-[var(--paper)] hover:border-[var(--signal-line)]"
        >
          <Home size={14} /> Go to dashboard
        </Link>
      </div>
    </main>
  );
}
