import "server-only";
import { GoogleGenAI } from "@google/genai";

export const DEFAULT_MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing — set it in .env.local");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}
