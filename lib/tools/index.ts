import type { AnyToolDefinition, ToolCategory } from "./types";
import { TOOLS as TOOLS_TUPLE } from "./definitions";

export type { ToolDefinition, AnyToolDefinition, ToolCategory, ToolAccent } from "./types";

// Widen the `as const` tuple to a plain array of the common (erased-schema)
// shape so every consumer can treat TOOLS uniformly regardless of which
// tool's specific Zod schema it carries.
export const TOOLS: AnyToolDefinition[] = TOOLS_TUPLE as unknown as AnyToolDefinition[];

export function getTool(slug: string): AnyToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolCategories(): ToolCategory[] {
  return Array.from(new Set(TOOLS.map((t) => t.category)));
}
