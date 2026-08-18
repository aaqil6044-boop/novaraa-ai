import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { runTool, listRecentToolRunsForSlug } from "@/lib/services/tool-service";
import { logger } from "@/lib/logger";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { slug } = await params;
  const runs = await listRecentToolRunsForSlug(user.id, slug, 5);
  return Response.json({ runs });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  try {
    const result = await runTool({
      userId: user.id,
      slug,
      input: body.input || "",
      fileId: body.fileId || null,
      modelId: body.modelId,
    });
    return Response.json(result);
  } catch (error: any) {
    logger.error("Tool run failed", error, { slug });
    return Response.json(
      { error: error.message || "Tool run failed" },
      { status: error.status || 500 }
    );
  }
}
