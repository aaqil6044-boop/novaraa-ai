import { prisma } from "@/lib/prisma";

export async function createChat(userId: string) {
  return prisma.chat.create({
    data: {
      title: "New Chat",
      userId,
    },
  });
}

export async function getChats(userId: string) {
  return prisma.chat.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}