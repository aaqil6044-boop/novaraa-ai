import { tool } from "ai";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Web search tool, exposed to the model via the Vercel AI SDK's tool-calling
 * interface. Uses Serper.dev (Google Search API) when SERPER_API_KEY is
 * configured. Degrades gracefully (tells the model search is unavailable)
 * rather than throwing, so a missing key never breaks the chat.
 */
export const webSearchTool = tool({
  description:
    "Search the web for current information (news, prices, facts after the model's knowledge cutoff). Returns a short list of results with title, snippet, and link.",
  parameters: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ query }) => {
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
      return {
        available: false,
        message:
          "Web search is not configured on this server (missing SERPER_API_KEY). Answer from existing knowledge and say results may be out of date.",
      };
    }

    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query }),
      });

      if (!res.ok) {
        throw new Error(`Serper responded with ${res.status}`);
      }

      const data = await res.json();

      const results = (data.organic || []).slice(0, 5).map((r: any) => ({
        title: r.title,
        snippet: r.snippet,
        link: r.link,
      }));

      return { available: true, results };
    } catch (error) {
      logger.error("Web search tool failed", error, { query });
      return {
        available: false,
        message: "Web search failed. Answer from existing knowledge instead.",
      };
    }
  },
});

export function getToolset(enableWebSearch: boolean) {
  if (!enableWebSearch) return undefined;
  return { web_search: webSearchTool };
}
