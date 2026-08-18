"use client";

import { useState } from "react";
import { Pin, Star, Trash2, Pencil, Search, Plus, Check, X } from "lucide-react";
import { useChats, type ChatSummary } from "@/hooks/useChats";

type SidebarProps = {
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
};

export default function Sidebar({ activeChatId, onSelectChat, onNewChat }: SidebarProps) {
  const {
    chats,
    loading,
    query,
    setQuery,
    filter,
    setFilter,
    rename,
    togglePin,
    toggleFavorite,
    remove,
  } = useChats();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function startEdit(chat: ChatSummary) {
    setEditingId(chat.id);
    setEditValue(chat.title);
  }

  function commitEdit(id: string) {
    if (editValue.trim()) rename(id, editValue.trim());
    setEditingId(null);
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-[var(--ink-700)] bg-[var(--ink-900)] p-3">
      <button
        onClick={onNewChat}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--signal)] py-2.5 text-[13px] font-semibold text-[var(--ink-950)] transition hover:brightness-110"
      >
        <Plus size={15} strokeWidth={2.5} /> New Chat
      </button>

      <div className="relative mb-2">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full rounded-lg border border-[var(--ink-700)] bg-[var(--ink-950)] py-2 pl-8 pr-3 text-[13px] text-[var(--paper)] placeholder:text-[var(--paper-faint)] outline-none focus:border-[var(--signal-line)]"
        />
      </div>

      <div className="mb-3 flex gap-1 text-[11px]">
        {(["all", "pinned", "favorite", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-2.5 py-1 capitalize transition ${
              filter === f
                ? "bg-[var(--signal-soft)] text-[var(--signal)]"
                : "text-[var(--paper-dim)] hover:bg-[var(--ink-800)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto">
        {loading && <p className="p-3 text-[13px] text-[var(--paper-faint)]">Loading...</p>}
        {!loading && chats.length === 0 && (
          <p className="p-3 text-[13px] text-[var(--paper-faint)]">No chats yet.</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => editingId !== chat.id && onSelectChat(chat.id)}
            className={`group flex cursor-pointer items-center gap-2 rounded-xl p-2.5 text-[13px] transition-colors ${
              activeChatId === chat.id
                ? "bg-[var(--signal-soft)] text-[var(--paper)]"
                : "text-[var(--paper-dim)] hover:bg-[var(--ink-800)] hover:text-[var(--paper)]"
            }`}
          >
            {editingId === chat.id ? (
              <div className="flex flex-1 items-center gap-1">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit(chat.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded border border-[var(--signal-line)] bg-[var(--ink-950)] px-2 py-1 text-[13px] text-[var(--paper)] outline-none"
                />
                <button onClick={(e) => { e.stopPropagation(); commitEdit(chat.id); }}>
                  <Check size={14} className="text-[var(--success)]" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>
                  <X size={14} className="text-[var(--paper-faint)]" />
                </button>
              </div>
            ) : (
              <>
                {chat.pinned && <Pin size={11} className="shrink-0 text-[var(--signal)]" />}
                <span className="flex-1 truncate">{chat.title}</span>
                <div className="hidden shrink-0 items-center gap-1.5 group-hover:flex">
                  <button title="Favorite" onClick={(e) => { e.stopPropagation(); toggleFavorite(chat.id, chat.favorite); }}>
                    <Star size={13} className={chat.favorite ? "fill-[var(--signal)] text-[var(--signal)]" : "text-[var(--paper-faint)] hover:text-[var(--paper)]"} />
                  </button>
                  <button title="Pin" onClick={(e) => { e.stopPropagation(); togglePin(chat.id, chat.pinned); }}>
                    <Pin size={13} className={chat.pinned ? "text-[var(--signal)]" : "text-[var(--paper-faint)] hover:text-[var(--paper)]"} />
                  </button>
                  <button title="Rename" onClick={(e) => { e.stopPropagation(); startEdit(chat); }}>
                    <Pencil size={13} className="text-[var(--paper-faint)] hover:text-[var(--paper)]" />
                  </button>
                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${chat.title}"?`)) remove(chat.id);
                    }}
                  >
                    <Trash2 size={13} className="text-[var(--paper-faint)] hover:text-[var(--danger)]" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
