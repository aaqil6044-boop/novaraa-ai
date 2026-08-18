import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--ink-700)] bg-[var(--ink-950)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="pulse-dot" />
          <span className="font-display text-xl text-[var(--paper)]">Novaraa</span>
        </Link>

        <div className="hidden items-center gap-8 text-[13.5px] text-[var(--paper-dim)] md:flex">
          <Link href="/" className="transition hover:text-[var(--paper)]">Home</Link>
          <Link href="/tools" className="transition hover:text-[var(--paper)]">AI Tools</Link>
          <Link href="/chat" className="transition hover:text-[var(--paper)]">AI Chat</Link>
          <Link href="/pricing" className="transition hover:text-[var(--paper)]">Pricing</Link>
        </div>

        <Link
          href="/login"
          className="rounded-full bg-[var(--signal)] px-5 py-2 text-[13.5px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
}
