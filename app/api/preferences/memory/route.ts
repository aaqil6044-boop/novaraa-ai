import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMemoryFacts } from "@/lib/services/memory-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const facts = await getMemoryFacts(user.id);
  return Response.json({ facts });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  await prisma.userPreference.upsert({
    where: { userId: user.id },
    update: { memoryFacts: "[]" },
    create: { userId: user.id, memoryFacts: "[]" },
  });

  return Response.json({ success: true });
}
