import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";

type Chat = { id: string; title: string; updatedAt: string | Date; favorite: boolean };

export default function RecentChats({ chats }: { chats: Chat[] }) {
  return (
    <div className="rounded-2xl border border-[var(--ink-700)] bg-[var(--ink-900)] p-6">
      <h2 className="mb-5 font-display text-xl text-[var(--paper)]">Recent Chats</h2>

      {chats.length === 0 ? (
        <p className="text-[13.5px] text-[var(--paper-faint)]">No chats yet — start one to see it here.</p>
      ) : (
        <div className="space-y-2.5">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center justify-between rounded-xl border border-[var(--ink-700)] p-4 transition hover:border-[var(--signal-line)] hover:bg-[var(--ink-800)]"
            >
              <div className="flex items-center gap-2">
                {chat.favorite && <Star size={13} className="fill-[var(--signal)] text-[var(--signal)]" />}
                <h3 className="text-[14px] text-[var(--paper)]">{chat.title}</h3>
              </div>
              <p className="font-data text-[11px] text-[var(--paper-faint)]">
                {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
