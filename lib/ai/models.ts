import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

/**
 * Model registry.
 *
 * This is the ONLY file that needs to change to add a new provider.
 * The `ai` (Vercel AI SDK) package already gives every provider the same
 * `LanguageModel` interface, so the rest of the app (streaming route,
 * chat service, UI model picker) never needs to know which vendor is
 * behind a given model id.
 *
 * To add OpenAI later:
 *   1. `npm install @ai-sdk/openai`
 *   2. `const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })`
 *   3. Add an entry below: `"gpt-5": { label: "GPT-5", provider: "openai", model: openai("gpt-5"), supportsFiles: true }`
 *
 * Same pattern for Anthropic via `@ai-sdk/anthropic`.
 */

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface ModelDefinition {
  id: string;
  label: string;
  provider: "google" | "openai" | "anthropic";
  model: LanguageModel;
  supportsFiles: boolean;
  description: string;
}

export const MODEL_REGISTRY: Record<string, ModelDefinition> = {
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "google",
    model: google("gemini-2.5-flash"),
    supportsFiles: true,
    description: "Fast responses, great for everyday chat.",
  },
  "gemini-2.5-pro": {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    provider: "google",
    model: google("gemini-2.5-pro"),
    supportsFiles: true,
    description: "Stronger reasoning for complex tasks.",
  },
};

export const DEFAULT_MODEL_ID = "gemini-2.5-flash";

export const AVAILABLE_MODELS = Object.values(MODEL_REGISTRY).map((m) => ({
  id: m.id,
  label: m.label,
  provider: m.provider,
  description: m.description,
}));

export function getModelDefinition(modelId?: string | null): ModelDefinition {
  if (modelId && MODEL_REGISTRY[modelId]) {
    return MODEL_REGISTRY[modelId];
  }
  return MODEL_REGISTRY[DEFAULT_MODEL_ID];
}

export function getLanguageModel(modelId?: string | null): LanguageModel {
  return getModelDefinition(modelId).model;
}
