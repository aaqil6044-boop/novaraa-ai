import { prisma } from "@/lib/prisma";

const REQUIRED = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GEMINI_API_KEY",
] as const;

const OPTIONAL = ["AUTH_URL", "SERPER_API_KEY"] as const;

/**
 * Visit /api/health to see exactly which required env vars are missing
 * and whether the database is reachable — the two most common causes of
 * "login is broken" / "everything crashes" reports.
 */
export async function GET() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  const missingOptional = OPTIONAL.filter((key) => !process.env[key]);

  let dbStatus: "ok" | "error" = "ok";
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : String(err);
  }

  return Response.json({
    ok: missing.length === 0 && dbStatus === "ok",
    missingRequiredEnvVars: missing,
    missingOptionalEnvVars: missingOptional,
    database: { status: dbStatus, error: dbError },
  });
}
