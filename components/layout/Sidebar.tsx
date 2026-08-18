"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Wrench, FolderOpen, Settings, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/tools", label: "AI Tools", icon: Wrench },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--ink-700)] bg-[var(--ink-950)] px-4 py-6">
      <Link href="/" className="mb-10 flex items-center gap-2.5 px-2">
        <span className="pulse-dot" />
        <span className="font-display text-[19px] tracking-tight text-[var(--paper)]">Novaraa</span>
      </Link>

      <nav className="space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors ${
                active
                  ? "bg-[var(--signal-soft)] text-[var(--signal)]"
                  : "text-[var(--paper-dim)] hover:bg-[var(--ink-800)] hover:text-[var(--paper)]"
              }`}
            >
              <Icon size={16} strokeWidth={2} className={active ? "text-[var(--signal)]" : "opacity-70 group-hover:opacity-100"} />
              {label}
              {active && <span className="pulse-dot ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-3.5">
        <p className="font-display text-[13px] text-[var(--paper)]">Free plan</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--paper-faint)]">
          Upgrade for higher limits and priority models.
        </p>
        <Link
          href="/pricing"
          className="mt-2.5 inline-block text-[11px] font-medium text-[var(--signal)] hover:underline"
        >
          View plans →
        </Link>
      </div>
    </aside>
  );
}
