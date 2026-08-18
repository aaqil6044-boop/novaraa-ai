"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/chat/Sidebar";
import Message from "@/components/chat/Message";
import ChatInput from "@/components/chat/ChatInput";
import FileUpload, { type UploadedFileInfo } from "@/components/chat/FileUpload";
import EmptyChat from "@/components/chat/EmptyChat";
import { useChat } from "@/hooks/useChat";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

export default function ChatShell({ initialChatId }: { initialChatId?: string | null }) {
  const {
    chatId,
    messages,
    isStreaming,
    sendMessage,
    editMessage,
    regenerate,
    stopGeneration,
    loadChat,
    resetChat,
  } = useChat(initialChatId ?? null);

  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [pendingFiles, setPendingFiles] = useState<UploadedFileInfo[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sidebarRefreshKey = useRef(0);

  useEffect(() => {
    if (initialChatId) loadChat(initialChatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  function handleSend(text: string, opts: { webSearch: boolean; modelId: string }) {
    sendMessage(text, {
      webSearch: opts.webSearch,
      modelId: opts.modelId,
      fileIds: pendingFiles.map((f) => f.id),
    });
    setPendingFiles([]);
    sidebarRefreshKey.current++;
  }

  function handleNewChat() {
    resetChat();
    setPendingFiles([]);
    window.history.pushState({}, "", "/chat");
  }

  function handleSelectChat(id: string) {
    loadChat(id);
    window.history.pushState({}, "", `/chat/${id}`);
  }

  return (
    <main className="flex h-screen bg-[var(--ink-950)] text-[var(--paper)]">
      <Sidebar activeChatId={chatId} onSelectChat={handleSelectChat} onNewChat={handleNewChat} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-[var(--ink-700)] px-6 py-4">
          <h1 className="font-display text-lg text-[var(--paper)]">Novaraa AI Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex h-full max-w-4xl flex-col gap-4 p-6">
            {messages.length === 0 ? (
              <EmptyChat onSuggestion={(text) => handleSend(text, { webSearch: false, modelId })} />
            ) : (
              messages.map((msg) => (
                <Message
                  key={msg.id}
                  id={msg.id}
                  role={msg.role}
                  content={msg.content}
                  pending={msg.pending}
                  onEdit={!isStreaming ? (id, content) => editMessage(id, content) : undefined}
                  onRegenerate={!isStreaming ? (id) => regenerate(id) : undefined}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {showUpload && (
          <FileUpload chatId={chatId} files={pendingFiles} onFilesChange={setPendingFiles} />
        )}

        <ChatInput
          onSend={handleSend}
          onStop={stopGeneration}
          isStreaming={isStreaming}
          modelId={modelId}
          onModelChange={setModelId}
          onAttachClick={() => setShowUpload((v) => !v)}
          attachedCount={pendingFiles.length}
        />
      </div>
    </main>
  );
}
