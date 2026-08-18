import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listChats, createChat, type ChatFilter } from "@/lib/services/chat-service";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const url = new URL(req.url);
  const query = url.searchParams.get("q") || undefined;
  const folderId = url.searchParams.get("folderId") || undefined;
  const filter = (url.searchParams.get("filter") as ChatFilter) || "all";

  try {
    const chats = await listChats(user.id, { query, folderId, filter });
    return Response.json(chats);
  } catch (error) {
    logger.error("Failed to list chats", error, { userId: user.id });
    return Response.json({ error: "Failed to load chats" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  const chat = await createChat(user.id, {
    title: body.title,
    model: body.model,
    folderId: body.folderId,
  });

  return Response.json(chat, { status: 201 });
}
