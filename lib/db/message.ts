import { prisma } from "@/lib/prisma";

export async function saveMessage(
  chatId: string,
  role: string,
  content: string
) {
  return prisma.message.create({
    data: {
      chatId,
      role,
      content,
    },
  });
}

export async function getMessages(chatId: string) {
  return prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}