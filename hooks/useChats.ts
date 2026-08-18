"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type ChatSummary = {
  id: string;
  title: string;
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  updatedAt: string;
  folderId: string | null;
};

export function useChats() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned" | "favorite" | "archived">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filter !== "all") params.set("filter", filter);

      const res = await fetch(`/api/chats?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load chats");
      setChats(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const timeout = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [load, query]);

  const patchChat = useCallback(async (id: string, data: Partial<ChatSummary>) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to update chat");
      load();
    }
  }, [load]);

  const rename = useCallback((id: string, title: string) => patchChat(id, { title }), [patchChat]);
  const togglePin = useCallback(
    (id: string, pinned: boolean) => patchChat(id, { pinned: !pinned }),
    [patchChat]
  );
  const toggleFavorite = useCallback(
    (id: string, favorite: boolean) => patchChat(id, { favorite: !favorite }),
    [patchChat]
  );

  const remove = useCallback(async (id: string) => {
    const prev = chats;
    setChats((c) => c.filter((chat) => chat.id !== id));
    try {
      const res = await fetch(`/api/chats/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to delete chat");
      setChats(prev);
    }
  }, [chats]);

  return {
    chats,
    loading,
    query,
    setQuery,
    filter,
    setFilter,
    reload: load,
    rename,
    togglePin,
    toggleFavorite,
    remove,
  };
}
