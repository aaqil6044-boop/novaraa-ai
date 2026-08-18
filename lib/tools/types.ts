import type { LucideIcon } from "lucide-react";
import type { z } from "zod";

export type ToolCategory =
  | "Career"
  | "Documents"
  | "Code"
  | "Writing"
  | "Study"
  | "Vision";

export type ToolAccent = "signal" | "nova" | "success" | "danger";

/**
 * Every AI tool is a genuinely different product: its own system prompt,
 * its own structured output contract (Zod schema), and its own result UI
 * (registered separately in components/tools/results). This file only
 * describes the shape of a tool entry — see lib/tools/definitions.ts for
 * the actual registry.
 */
export interface ToolDefinition<Schema extends z.ZodTypeAny = z.ZodTypeAny> {
  slug: string;
  label: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  accent: ToolAccent;
  placeholder: string;
  acceptsFile: boolean;
  fileHint?: string;
  /** Short example inputs a user can tap to prefill the input box. */
  examples: string[];
  /** Loading-state copy shown in sequence while the tool is working. */
  loadingSteps: string[];
  /** Frames the model's role/persona for this specific tool — never reused verbatim across tools. */
  systemPrompt: string;
  /** Turns raw user input into the task-specific instruction sent to the model. */
  buildUserPrompt: (input: string) => string;
  /** The structured output contract this tool's model call must satisfy. */
  schema: Schema;
  /** Converts a validated structured result back into Markdown for copy/export. */
  toMarkdown: (data: z.infer<Schema>) => string;
}

export type AnyToolDefinition = ToolDefinition<z.ZodTypeAny>;
