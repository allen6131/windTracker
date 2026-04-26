import { nanoid } from "nanoid";
import type { ChatRequest, ChatResponse } from "../domain/chat.js";

export interface ChatOrchestrator {
  handleChat(request: ChatRequest, conversationId: string): Promise<ChatResponse>;
}

export class ChatService {
  constructor(private readonly orchestrator: ChatOrchestrator) {}

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
