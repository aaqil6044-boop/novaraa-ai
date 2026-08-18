import { prisma } from "@/lib/prisma";
import { getToolUsageCounts } from "@/lib/services/tool-service";

export async function getDashboardStats(userId: string) {
  const [totalChats, totalMessages, totalFiles, totalToolRuns, recentChats, recentFiles, toolUsage] =
    await Promise.all([
      prisma.chat.count({ where: { userId } }),
      prisma.message.count({ where: { chat: { userId } } }),
      prisma.uploadedFile.count({ where: { userId } }),
      prisma.toolRun.count({ where: { userId } }),
      prisma.chat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, updatedAt: true, favorite: true },
      }),
      prisma.uploadedFile.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, filename: true, createdAt: true, mimeType: true },
      }),
      getToolUsageCounts(userId),
    ]);

  const dailyActivity = await getDailyActivity(userId);

  return {
    totalChats,
    totalMessages,
    totalFiles,
    totalToolRuns,
    recentChats,
    recentFiles,
    toolUsage,
    dailyActivity,
  };
}

/** Messages sent per day over the last 7 days, for the usage chart. */
export async function getDailyActivity(userId: string) {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const messages = await prisma.message.findMany({
    where: { chat: { userId }, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = messages.filter((m) => {
      const md = new Date(m.createdAt);
      return md.toDateString() === d.toDateString();
    }).length;
    days.push({ day: label, count });
  }

  return days;
}
