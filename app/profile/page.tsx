import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import { getDashboardStats } from "@/lib/dashboard";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const stats = await getDashboardStats(user.id);

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="font-display text-3xl text-[var(--paper)]">Profile</h1>

        <div className="flex items-center gap-4 rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
          {user.image ? (
            <img src={user.image} alt="" className="h-16 w-16 rounded-full border border-[var(--ink-600)]" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--ink-600)] bg-[var(--ink-800)] font-display text-xl text-[var(--paper)]">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <p className="font-display text-lg text-[var(--paper)]">{user.name}</p>
            <p className="text-[13.5px] text-[var(--paper-dim)]">{user.email}</p>
            <p className="mt-1 font-data text-[11px] text-[var(--paper-faint)]">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
          <h2 className="mb-4 font-display text-[16px] text-[var(--paper)]">Usage</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label="Chats" value={stats.totalChats} />
            <Stat label="Messages" value={stats.totalMessages} />
            <Stat label="Files" value={stats.totalFiles} />
            <Stat label="Tool Runs" value={stats.totalToolRuns} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
          <h2 className="mb-2 font-display text-[16px] text-[var(--paper)]">Subscription</h2>
          <p className="text-[13.5px] text-[var(--paper-dim)]">
            You're on the <span className="text-[var(--signal)]">Free</span> plan.
          </p>
          <a
            href="/pricing"
            className="mt-3 inline-block rounded-full bg-[var(--signal)] px-4 py-2 text-[13px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
          >
            View plans
          </a>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl text-[var(--paper)]">{value}</p>
      <p className="font-data text-[10.5px] uppercase tracking-wide text-[var(--paper-faint)]">{label}</p>
    </div>
  );
}
