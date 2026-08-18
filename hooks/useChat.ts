"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
};

type SendOptions = {
  fileIds?: string[];
  webSearch?: boolean;
  modelId?: string;
  editMessageId?: string;
  regenerateAssistantId?: string;
};

export function useChat(initialChatId: string | null = null) {
  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const refreshChat = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(
        data.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content }))
      );
    } catch {
      // Non-fatal: keep whatever is currently rendered.
    }
  }, []);

  const loadChat = useCallback(
    async (id: string) => {
      setChatId(id);
      await refreshChat(id);
    },
    [refreshChat]
  );

  const resetChat = useCallback(() => {
    setChatId(null);
    setMessages([]);
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const run = useCallback(
    async (text: string, opts: SendOptions = {}) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      const tempUserId = `temp-user-${Date.now()}`;
      const tempAssistantId = `temp-assistant-${Date.now()}`;

      setMessages((prev) => {
        const withoutEditedTail = opts.editMessageId
          ? prev.slice(0, prev.findIndex((m) => m.id === opts.editMessageId))
          : opts.regenerateAssistantId
          ? prev.slice(0, prev.findIndex((m) => m.id === opts.regenerateAssistantId))
          : prev;

        const next = [...withoutEditedTail];
        if (!opts.regenerateAssistantId) {
          next.push({ id: tempUserId, role: "user", content: text });
        }
        next.push({ id: tempAssistantId, role: "assistant", content: "", pending: true });
        return next;
      });

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            message: text,
            modelId: opts.modelId,
            fileIds: opts.fileIds,
            webSearch: opts.webSearch,
            editMessageId: opts.editMessageId,
            regenerateAssistantId: opts.regenerateAssistantId,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Something went wrong");
        }

        const newChatId = res.headers.get("X-Chat-Id");
        if (newChatId && newChatId !== chatId) setChatId(newChatId);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === tempAssistantId ? { ...m, content: fullText } : m))
          );
        }

        if (newChatId) await refreshChat(newChatId);
      } catch (error: any) {
        if (error?.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) => (m.id === tempAssistantId ? { ...m, pending: false } : m))
          );
        } else {
          toast.error(error?.message || "Failed to get a response");
          setMessages((prev) => prev.filter((m) => m.id !== tempAssistantId));
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [chatId, refreshChat]
  );

  const sendMessage = useCallback(
    (text: string, opts: Omit<SendOptions, "editMessageId" | "regenerateAssistantId"> = {}) =>
      run(text, opts),
    [run]
  );

  const editMessage = useCallback(
    (messageId: string, newContent: string) => run(newContent, { editMessageId: messageId }),
    [run]
  );

  const regenerate = useCallback(
    (assistantMessageId: string) => run("", { regenerateAssistantId: assistantMessageId }),
    [run]
  );

  return {
    chatId,
    messages,
    isStreaming,
    sendMessage,
    editMessage,
    regenerate,
    stopGeneration,
    loadChat,
    resetChat,
  };
}
