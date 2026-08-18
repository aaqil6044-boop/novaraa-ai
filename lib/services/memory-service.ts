import { generateText } from "ai";
import { prisma } from "@/lib/prisma";
import { getLanguageModel } from "@/lib/ai/models";
import { logger } from "@/lib/logger";

const MAX_FACTS = 30;

export async function getMemoryFacts(userId: string): Promise<string[]> {
  const pref = await prisma.userPreference.findUnique({ where: { userId } });
  if (!pref || !pref.memoryEnabled) return [];

  try {
    const facts = JSON.parse(pref.memoryFacts) as string[];
    return Array.isArray(facts) ? facts : [];
  } catch {
    return [];
  }
}

export async function buildMemorySystemPrompt(userId: string): Promise<string | null> {
  const facts = await getMemoryFacts(userId);
  if (facts.length === 0) return null;

  return [
    "Here is durable context you have learned about this user in past conversations.",
    "Use it naturally when relevant. Do not repeat it verbatim or mention that you 'remember' things unless asked.",
    ...facts.map((f) => `- ${f}`),
  ].join("\n");
}

/**
 * After a conversation turn, ask the fast model to pull out any new,
 * durable facts about the user (preferences, projects, recurring context)
 * worth remembering — then merge them into the user's stored memory.
 * This runs fire-and-forget after the response streams back, so it never
 * adds latency to the chat itself.
 */
export async function updateMemoryFromTurn(
  userId: string,
  userMessage: string,
  assistantMessage: string
) {
  try {
    const pref = await prisma.userPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    if (!pref.memoryEnabled) return;

    const existingFacts: string[] = JSON.parse(pref.memoryFacts || "[]");

    const { text } = await generateText({
      model: getLanguageModel("gemini-2.5-flash"),
      prompt: [
        "Extract at most 3 short, durable facts worth remembering about the USER from this exchange",
        "(preferences, ongoing projects, tools they use, constraints, goals). Ignore small talk.",
        "Reply with a JSON array of strings only, e.g. [\"prefers Python over JS\"]. If nothing is worth remembering, reply with [].",
        "",
        `User: ${userMessage}`,
        `Assistant: ${assistantMessage}`,
      ].join("\n"),
    });

    let newFacts: string[] = [];
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) newFacts = parsed.filter((f) => typeof f === "string");
    } catch {
      return; // model didn't return valid JSON — skip silently, non-critical
    }

    if (newFacts.length === 0) return;

    const merged = Array.from(new Set([...existingFacts, ...newFacts])).slice(-MAX_FACTS);

    await prisma.userPreference.update({
      where: { userId },
      data: { memoryFacts: JSON.stringify(merged) },
    });
  } catch (error) {
    logger.error("Failed to update AI memory", error, { userId });
  }
}
