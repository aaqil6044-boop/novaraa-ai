import { streamText, type ModelMessage } from "ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLanguageModel, getModelDefinition } from "@/lib/ai/models";
import { getToolset } from "@/lib/ai/tools";
import {
  createChat,
  getChatForUser,
  appendMessage,
  deriveTitle,
  truncateFrom,
  editUserMessage,
} from "@/lib/services/chat-service";
import { buildMemorySystemPrompt, updateMemoryFromTurn } from "@/lib/services/memory-service";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

const SYSTEM_PROMPT =
  "You are Novaraa, a helpful, direct AI assistant. Format responses in Markdown when it aids clarity (code blocks, tables, lists). Keep answers concise unless the user asks for depth.";

interface StreamRequestBody {
  chatId?: string;
  message: string;
  modelId?: string;
  fileIds?: string[];
  editMessageId?: string;
  regenerateAssistantId?: string;
  webSearch?: boolean;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  let body: StreamRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    chatId: incomingChatId,
    message,
    modelId,
    fileIds = [],
    editMessageId,
    regenerateAssistantId,
    webSearch = false,
  } = body;

  if (!message?.trim() && !regenerateAssistantId) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    // Resolve or create the chat.
    let chat = incomingChatId ? await getChatForUser(incomingChatId, user.id) : null;

    if (!chat) {
      chat = await createChat(user.id, {
        title: deriveTitle(message || "New Chat"),
        model: modelId,
      });
    }

    const chatId = chat.id;

    // Edit / regenerate: rewind the conversation to the right point first.
    if (regenerateAssistantId) {
      await truncateFrom(chatId, regenerateAssistantId);
    } else if (editMessageId) {
      await editUserMessage(chatId, editMessageId, message);
    } else {
      await appendMessage(chatId, "user", message);

      if (fileIds.length > 0) {
        const lastMessage = await prisma.message.findFirst({
          where: { chatId, role: "user" },
          orderBy: { createdAt: "desc" },
        });
        if (lastMessage) {
          await prisma.messageAttachment.createMany({
            data: fileIds.map((fileId) => ({ messageId: lastMessage.id, fileId })),
          });
        }
      }
    }

    // Build full history for the model.
    const history = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: { attachments: { include: { file: true } } },
    });

    const modelMessages: ModelMessage[] = history.map((m) => {
      if (m.attachments.length > 0) {
        const parts: any[] = [{ type: "text", text: m.content }];
        for (const att of m.attachments) {
          if (att.file.geminiFileUri) {
            parts.push({
              type: "file",
              data: new URL(att.file.geminiFileUri),
              mediaType: att.file.mimeType,
            });
          }
        }
        return { role: m.role as "user" | "assistant", content: parts };
      }
      return { role: m.role as "user" | "assistant", content: m.content };
    });

    const memoryPrompt = await buildMemorySystemPrompt(user.id);
    const system = memoryPrompt ? `${SYSTEM_PROMPT}\n\n${memoryPrompt}` : SYSTEM_PROMPT;

    const effectiveModelId = modelId || chat.model;
    const modelDef = getModelDefinition(effectiveModelId);

    const result = streamText({
      model: getLanguageModel(effectiveModelId),
      system,
      messages: modelMessages,
      tools: getToolset(webSearch),
      abortSignal: req.signal,
      onFinish: async ({ text }) => {
        try {
          await appendMessage(chatId, "assistant", text);
          const lastUserMessage = [...history].reverse().find((m) => m.role === "user");
          if (lastUserMessage) {
            void updateMemoryFromTurn(user.id, lastUserMessage.content, text);
          }
        } catch (err) {
          logger.error("Failed to persist assistant message", err, { chatId });
        }
      },
      onError: ({ error }) => {
        logger.error("streamText error", error, { chatId, model: modelDef.id });
      },
    });

    const response = result.toTextStreamResponse();
    response.headers.set("X-Chat-Id", chatId);
    response.headers.set("X-Model-Id", modelDef.id);
    return response;
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      return new Response(null, { status: 499 });
    }
    logger.error("Chat stream failed", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
