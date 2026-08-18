import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getChatWithMessages } from "@/lib/services/chat-service";

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

  const exportData = {
    novaraaExportVersion: 1,
    title: chat.title,
    model: chat.model,
    exportedAt: new Date().toISOString(),
    messages: chat.messages.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${chat.title.replace(/[^a-z0-9]/gi, "_")}.json"`,
    },
  });
}
