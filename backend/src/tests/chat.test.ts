import { describe, expect, it } from "vitest";
import { ChatService } from "../services/chatService.js";
import type { ChatResponse } from "../domain/chat.js";

describe("ChatService", () => {
  it("returns an orchestrated chat response", async () => {
    const response: ChatResponse = {
      conversationId: "conv_test",
      assistantMessage: "South Padre looks windy.",
      clarification: { needed: false, question: null, choices: [] },
      cards: [],
      timeSeries: [],
      sources: [{ provider: "Open-Meteo", dataset: "Forecast API", fetchedAt: new Date().toISOString() }],
      warnings: [],
    };
    const service = new ChatService({ handleChat: async () => response });
    const result = await service.sendMessage({
      message: "South Padre kiteboarding tomorrow afternoon",
      platform: "ios",
      units: "imperial",
    });
    expect(result.assistantMessage).toContain("South Padre");
    expect(result.conversationId).toBeTruthy();
  });
});
