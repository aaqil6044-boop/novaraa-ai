import Link from "next/link";
import { MessageSquare, Upload, FileText, Image } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { title: "New Chat", icon: MessageSquare, href: "/chat" },
    { title: "Upload File", icon: Upload, href: "/chat" },
    { title: "Resume Review", icon: FileText, href: "/tools/resume-reviewer" },
    { title: "Image Analysis", icon: Image, href: "/tools/image-analyzer" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
      <h2 className="mb-5 font-display text-xl text-[var(--paper)]">Quick Actions</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex flex-col items-center gap-3 rounded-xl border border-[var(--ink-700)] p-6 transition hover:border-[var(--signal-line)] hover:bg-[var(--ink-800)]"
            >
              <Icon size={26} className="text-[var(--signal)]" strokeWidth={1.8} />
              <span className="text-[13px] text-[var(--paper-dim)]">{action.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
