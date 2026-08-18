import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getChatWithMessages, updateChat, deleteChat } from "@/lib/services/chat-service";
import { logger } from "@/lib/logger";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const chat = await getChatWithMessages(id, user.id);

  if (!chat) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(chat);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const allowed = ["title", "pinned", "favorite", "archived", "folderId", "model"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  try {
    const updated = await updateChat(id, user.id, data);
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  } catch (error) {
    logger.error("Failed to update chat", error, { chatId: id });
    return Response.json({ error: "Failed to update chat" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const deleted = await deleteChat(id, user.id);

  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
