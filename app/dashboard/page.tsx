import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/dashboard";
import AppLayout from "@/components/layout/AppLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentChats from "@/components/dashboard/RecentChats";
import UsageChart from "@/components/dashboard/UsageChart";
import QuickActions from "@/components/dashboard/QuickActions";
import ToolUsage from "@/components/dashboard/ToolUsage";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const stats = await getDashboardStats(user.id);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl text-[var(--paper)]">
            Welcome back, {session.user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-[14px] text-[var(--paper-dim)]">Here's what's happening in your workspace.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Chats" value={String(stats.totalChats)} subtitle="Conversations started" />
          <StatsCard title="Total Messages" value={String(stats.totalMessages)} subtitle="Across all chats" />
          <StatsCard title="Files Uploaded" value={String(stats.totalFiles)} subtitle="Analyzed by AI" />
          <StatsCard title="Tool Runs" value={String(stats.totalToolRuns)} subtitle="AI tools used" />
        </div>

        <QuickActions />

        <div className="grid gap-6 lg:grid-cols-2">
          <UsageChart data={stats.dailyActivity} />
          <ToolUsage usage={stats.toolUsage} />
        </div>

        <RecentChats chats={stats.recentChats as any} />
      </div>
    </AppLayout>
  );
}
