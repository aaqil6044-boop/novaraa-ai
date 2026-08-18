import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listFolders } from "@/lib/services/chat-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const folders = await listFolders(user.id);
  return Response.json(folders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  if (!body.name?.trim()) {
    return Response.json({ error: "Folder name is required" }, { status: 400 });
  }

  const folder = await prisma.folder.create({
    data: { name: body.name.trim(), color: body.color, userId: user.id },
  });

  return Response.json(folder, { status: 201 });
}
