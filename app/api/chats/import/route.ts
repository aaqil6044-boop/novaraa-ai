import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createChat, appendMessage } from "@/lib/services/chat-service";

interface ImportedMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => null);

  if (!body || !Array.isArray(body.messages)) {
    return Response.json({ error: "Invalid import file" }, { status: 400 });
  }

  const chat = await createChat(user.id, {
    title: body.title ? `${body.title} (imported)` : "Imported chat",
    model: body.model,
  });

  for (const msg of body.messages as ImportedMessage[]) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    if (typeof msg.content !== "string") continue;
    await appendMessage(chat.id, msg.role, msg.content);
  }

  return Response.json(chat, { status: 201 });
}
