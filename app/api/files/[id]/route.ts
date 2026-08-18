import { unlink } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteGeminiFile } from "@/lib/gemini-file";
import { logger } from "@/lib/logger";

async function getOwnedFile(id: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return prisma.uploadedFile.findFirst({ where: { id, userId: user.id } });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const file = await getOwnedFile(id, session.user.email);
  if (!file) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.filename !== "string" || !body.filename.trim()) {
    return Response.json({ error: "filename is required" }, { status: 400 });
  }

  const updated = await prisma.uploadedFile.update({
    where: { id },
    data: { filename: body.filename.trim() },
  });

  return Response.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const file = await getOwnedFile(id, session.user.email);
  if (!file) return Response.json({ error: "Not found" }, { status: 404 });

  try {
    await unlink(path.join(process.cwd(), "public", file.url));
  } catch (err) {
    logger.warn("Local file already missing on delete", { id });
  }

  if (file.geminiFileUri) {
    const name = file.geminiFileUri.split("/files/")[1];
    if (name) void deleteGeminiFile(`files/${name}`);
  }

  await prisma.uploadedFile.delete({ where: { id } });

  return Response.json({ success: true });
}
