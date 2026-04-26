import OpenAI from "openai";
import { config } from "../config.js";

export function createOpenAiClient(): OpenAI | null {
  if (!config.openAiApiKey) return null;
  return new OpenAI({ apiKey: config.openAiApiKey });
}
