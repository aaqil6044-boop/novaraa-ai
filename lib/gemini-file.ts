import { GoogleGenAI } from "@google/genai";
import { logger } from "@/lib/logger";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeminiUploadResult {
  uri: string;
  mimeType: string;
  name: string;
}

/**
 * Uploads a buffer to the Gemini Files API and waits until it's ACTIVE
 * (Gemini processes PDFs/images/audio asynchronously — using a file before
 * it's ready causes a 400). Used for PDF, image, DOCX, TXT and CSV analysis,
 * and doubles as OCR for scanned documents since Gemini reads embedded text
 * and visual text in the same pass.
 */
export async function uploadFileToGemini(
  buffer: Buffer,
  mimeType: string,
  displayName: string
): Promise<GeminiUploadResult> {
  const blob = new Blob([buffer], { type: mimeType });

  const uploaded = await ai.files.upload({
    file: blob,
    config: { mimeType, displayName },
  });

  if (!uploaded.name) {
    throw new Error("Gemini file upload did not return a file name");
  }

  let file = uploaded;
  let attempts = 0;

  while (file.state === "PROCESSING" && attempts < 20) {
    await new Promise((r) => setTimeout(r, 1500));
    file = await ai.files.get({ name: uploaded.name! });
    attempts++;
  }

  if (file.state === "FAILED") {
    throw new Error("Gemini failed to process the uploaded file");
  }

  logger.info("Uploaded file to Gemini Files API", { name: file.name, state: file.state });

  return {
    uri: file.uri!,
    mimeType: file.mimeType || mimeType,
    name: file.name!,
  };
}

export async function deleteGeminiFile(name: string) {
  try {
    await ai.files.delete({ name });
  } catch (error) {
    logger.warn("Failed to delete Gemini file (non-fatal)", { name, error: String(error) });
  }
}

/** MIME types Novaraa currently supports for upload + analysis. */
export const SUPPORTED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
