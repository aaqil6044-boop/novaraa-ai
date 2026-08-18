"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full rounded-full bg-[var(--signal)] px-6 py-3 text-[13.5px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
    >
      Continue with Google
    </button>
  );
}