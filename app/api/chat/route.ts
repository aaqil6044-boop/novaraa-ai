import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createChat } from "@/lib/db/chat";
import { saveMessage } from "@/lib/db/message";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message, chatId } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let currentChat;

    if (chatId) {
      currentChat = { id: chatId };
    } else {
      currentChat = await createChat(user.id);
    }

    if (!chatId) {
  await prisma.chat.update({
    where: {
      id: currentChat.id,
    },
    data: {
      title:
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message,
    },
  });
}

    await saveMessage(currentChat.id, "user", message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text ?? "No response.";

    await saveMessage(currentChat.id, "assistant", reply);

    return Response.json({
      reply,
      chatId: currentChat.id,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}