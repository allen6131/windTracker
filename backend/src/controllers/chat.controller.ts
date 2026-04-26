import type { FastifyReply, FastifyRequest } from "fastify";
import { chatService } from "../services/dependencies.js";
import type { ChatRequest } from "../domain/chat.js";

export async function postChatController(request: FastifyRequest, reply: FastifyReply) {
  const response = await chatService.sendMessage(request.body as ChatRequest);
  return reply.send(response);
}
