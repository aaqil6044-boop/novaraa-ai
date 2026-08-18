import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  uploadFileToGemini,
  SUPPORTED_UPLOAD_MIME_TYPES,
} from "@/lib/gemini-file";
import { logger } from "@/lib/logger";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const chatId = (formData.get("chatId") as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 20MB limit" }, { status: 413 });
    }

    if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 415 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeName), buffer);

    const record = await prisma.uploadedFile.create({
      data: {
        filename: file.name,
        url: `/uploads/${safeName}`,
        mimeType: file.type,
        size: file.size,
        status: "processing",
        userId: user.id,
        chatId,
      },
    });

    try {
      const geminiFile = await uploadFileToGemini(buffer, file.type, file.name);

      const updated = await prisma.uploadedFile.update({
        where: { id: record.id },
        data: { status: "ready", geminiFileUri: geminiFile.uri },
      });

      return NextResponse.json({ success: true, file: updated });
    } catch (err) {
      logger.error("Gemini file processing failed", err, { fileId: record.id });

      const failed = await prisma.uploadedFile.update({
        where: { id: record.id },
        data: { status: "error" },
      });

      return NextResponse.json(
        { success: false, file: failed, error: "AI processing failed, file was still saved." },
        { status: 502 }
      );
    }
  } catch (err) {
    logger.error("Upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
