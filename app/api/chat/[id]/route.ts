import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const messages = await prisma.message.findMany({
    where: {
      chatId: id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json(messages);
}