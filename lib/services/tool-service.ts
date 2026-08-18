import { generateObject, NoObjectGeneratedError } from "ai";
import { prisma } from "@/lib/prisma";
import { getLanguageModel } from "@/lib/ai/models";
import { getTool } from "@/lib/tools";
import { logger } from "@/lib/logger";

interface RunToolArgs {
  userId: string;
  slug: string;
  input: string;
  fileId?: string | null;
  modelId?: string;
}

/**
 * Execution path for every AI tool. Unlike a single shared prompt, each tool
 * now supplies its own system prompt, user-prompt builder, and a Zod schema
 * describing exactly the structured result it must produce — so every tool
 * is a genuinely different model call with a genuinely different output
 * contract, not just different wording on top of one generic call.
 *
 * The validated structured object is stored as JSON in ToolRun.output
 * (still a plain Text column — no schema migration needed) so history and
 * re-hydration work the same way they always did.
 */
export async function runTool({ userId, slug, input, fileId, modelId }: RunToolArgs) {
  const tool = getTool(slug);
  if (!tool) {
    throw Object.assign(new Error("Unknown tool"), { status: 404 });
  }

  if (!input?.trim() && !fileId) {
    throw Object.assign(new Error("Provide input text or attach a file"), { status: 400 });
  }

  const prompt = tool.buildUserPrompt(input || "");

  let fileRecord = null;
  if (fileId) {
    fileRecord = await prisma.uploadedFile.findFirst({ where: { id: fileId, userId } });
    if (!fileRecord) {
      throw Object.assign(new Error("Attached file not found"), { status: 404 });
    }
    if (fileRecord.status === "processing") {
      throw Object.assign(
        new Error("This file is still being processed by AI — wait a few seconds and try again."),
        { status: 409 }
      );
    }
    if (fileRecord.status === "error" || !fileRecord.geminiFileUri) {
      throw Object.assign(
        new Error("This file failed to process and can't be analyzed. Try re-uploading it."),
        { status: 422 }
      );
    }
  }

  const content: any[] = [{ type: "text", text: prompt }];
  if (fileRecord?.geminiFileUri) {
    content.push({
      type: "file",
      data: new URL(fileRecord.geminiFileUri),
      mediaType: fileRecord.mimeType,
    });
  }

  let object: unknown;
  try {
    const result = await generateObject({
      model: getLanguageModel(modelId),
      schema: tool.schema,
      system: tool.systemPrompt,
      messages: [{ role: "user", content }],
    });
    object = result.object;
  } catch (error) {
    logger.error("Tool model call failed", error, { userId, slug });

    if (NoObjectGeneratedError.isInstance(error)) {
      throw Object.assign(
        new Error("The AI couldn't produce a valid structured result for this input. Please try again or rephrase."),
        { status: 502 }
      );
    }

    throw Object.assign(
      new Error("The AI model failed to respond. This is usually temporary — please try again."),
      { status: 502 }
    );
  }

  const outputJson = JSON.stringify(object);

  await prisma.toolRun.create({
    data: {
      userId,
      toolSlug: slug,
      input: input || `[file: ${fileRecord?.filename ?? "unknown"}]`,
      output: outputJson,
    },
  });

  logger.info("Tool run completed", { userId, slug });

  return { output: object };
}

export async function listRecentToolRuns(userId: string, limit = 10) {
  return prisma.toolRun.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listRecentToolRunsForSlug(userId: string, slug: string, limit = 5) {
  const runs = await prisma.toolRun.findMany({
    where: { userId, toolSlug: slug },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return runs.map((r) => ({
    id: r.id,
    input: r.input,
    createdAt: r.createdAt,
  }));
}

/** Re-hydrates a stored ToolRun's JSON output, falling back gracefully for
 * older rows that were saved as plain Markdown before this architecture. */
export function parseToolRunOutput(raw: string): { kind: "structured"; data: unknown } | { kind: "legacy"; text: string } {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { kind: "structured", data: parsed };
    }
  } catch {
    // fall through — this is a pre-existing plain-text row
  }
  return { kind: "legacy", text: raw };
}

export async function getToolUsageCounts(userId: string) {
  const runs = await prisma.toolRun.groupBy({
    by: ["toolSlug"],
    where: { userId },
    _count: { toolSlug: true },
  });

  return runs
    .map((r) => ({ slug: r.toolSlug, count: r._count.toolSlug }))
    .sort((a, b) => b.count - a.count);
}
