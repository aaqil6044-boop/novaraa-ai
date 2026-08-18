import ChatShell from "@/components/chat/ChatShell";

export default async function ChatHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatShell initialChatId={id} />;
}
