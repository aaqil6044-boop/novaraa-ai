import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const url = new URL(req.url);
  const query = url.searchParams.get("q") || undefined;

  const files = await prisma.uploadedFile.findMany({
    where: {
      userId: user.id,
      ...(query ? { filename: { contains: query, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(files);
}
