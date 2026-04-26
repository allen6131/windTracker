import type { ChatResponse } from "../domain/chat.js";

export function extractAssistantText(output: unknown): string {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    return output
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) return String((item as { text: unknown }).text);
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

export function ensureChatResponse(response: ChatResponse): ChatResponse {
  return {
    ...response,
    clarification: response.clarification ?? { needed: false, choices: [] },
    cards: response.cards ?? [],
    timeSeries: response.timeSeries ?? [],
    sources: response.sources ?? [],
    warnings: response.warnings ?? [],
  };
}
