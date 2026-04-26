import { nanoid } from "nanoid";
import type { ChatRequest, ChatResponse } from "../domain/chat.js";
import { OpenAiOrchestrator } from "./openAiOrchestrator.js";

export class ChatService {
  constructor(private readonly orchestrator: OpenAiOrchestrator) {}

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const conversationId = request.conversationId ?? `conv_${nanoid(12)}`;
    const response = await this.orchestrator.handleChat(request, conversationId);
    return {
      ...response,
      conversationId,
      clarification: response.clarification ?? { needed: false, question: null, choices: [] },
      cards: response.cards ?? [],
      timeSeries: response.timeSeries ?? [],
      sources: response.sources ?? [],
      warnings: response.warnings ?? [],
    };
  }
}
