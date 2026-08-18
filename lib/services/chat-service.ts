import { prisma } from "@/lib/prisma";

export type ChatFilter = "all" | "pinned" | "favorite" | "archived";

export async function listChats(
  userId: string,
  opts: { query?: string; folderId?: string | null; filter?: ChatFilter } = {}
) {
  const { query, folderId, filter = "all" } = opts;

  return prisma.chat.findMany({
    where: {
      userId,
      archived: filter === "archived" ? true : false,
      ...(filter === "pinned" ? { pinned: true } : {}),
      ...(filter === "favorite" ? { favorite: true } : {}),
      ...(folderId ? { folderId } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { messages: { some: { content: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    include: { folder: true },
  });
}

export async function createChat(
  userId: string,
  opts: { title?: string; model?: string; folderId?: string | null } = {}
) {
  return prisma.chat.create({
    data: {
      title: opts.title?.trim() || "New Chat",
      model: opts.model || "gemini-2.5-flash",
      folderId: opts.folderId ?? null,
      userId,
    },
  });
}

export async function getChatForUser(chatId: string, userId: string) {
  return prisma.chat.findFirst({
    where: { id: chatId, userId },
  });
}

export async function getChatWithMessages(chatId: string, userId: string) {
  return prisma.chat.findFirst({
    where: { id: chatId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { attachments: { include: { file: true } } },
      },
    },
  });
}

export async function updateChat(
  chatId: string,
  userId: string,
  data: Partial<{
    title: string;
    pinned: boolean;
    favorite: boolean;
    archived: boolean;
    folderId: string | null;
    model: string;
  }>
) {
  const chat = await getChatForUser(chatId, userId);
  if (!chat) return null;

  return prisma.chat.update({
    where: { id: chatId },
    data,
  });
}

export async function deleteChat(chatId: string, userId: string) {
  const chat = await getChatForUser(chatId, userId);
  if (!chat) return null;

  return prisma.chat.delete({ where: { id: chatId } });
}

export async function appendMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string
) {
  const message = await prisma.message.create({
    data: { chatId, role, content },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  return message;
}

/** Replace a user message's content and drop everything that came after it,
 * so the conversation can be regenerated cleanly from that point (used by
 * both "edit message" and "regenerate response"). */
export async function truncateFrom(chatId: string, fromMessageId: string) {
  const target = await prisma.message.findUnique({ where: { id: fromMessageId } });
  if (!target || target.chatId !== chatId) return;

  await prisma.message.deleteMany({
    where: {
      chatId,
      createdAt: { gte: target.createdAt },
    },
  });
}

export async function editUserMessage(
  chatId: string,
  messageId: string,
  newContent: string
) {
  await truncateFrom(chatId, messageId);
  return appendMessage(chatId, "user", newContent);
}

/** Simple, fast, non-LLM title generation from the first user message.
 * Cheap and deterministic — good enough for "auto chat titles" without
 * burning an extra model call on every new chat. */
export function deriveTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 48) return cleaned || "New Chat";
  return cleaned.slice(0, 45) + "...";
}

export async function getOrCreateFolder(userId: string, name: string, color?: string) {
  const existing = await prisma.folder.findFirst({ where: { userId, name } });
  if (existing) return existing;
  return prisma.folder.create({ data: { userId, name, color } });
}

export async function listFolders(userId: string) {
  return prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { chats: true } } },
  });
}
