"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AppTopbar() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-[var(--ink-700)] bg-[var(--ink-950)]/90 px-6 py-3.5 backdrop-blur">
      <div />
      <div className="flex items-center gap-4">
        <Link
          href="/chat"
          className="flex items-center gap-1.5 rounded-full bg-[var(--signal)] px-4 py-2 text-[13px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
        >
          <Plus size={14} strokeWidth={2.5} /> New Chat
        </Link>
        {session?.user && (
          <Link href="/profile" className="flex items-center gap-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-full border border-[var(--ink-600)]"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)] font-display text-xs text-[var(--paper)]">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
