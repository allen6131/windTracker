import type { FastifyInstance } from "fastify";
import { chatRouteSchema } from "../schemas/chat.schemas.js";
import { postChatController } from "../controllers/chat.controller.js";
import { config } from "../config.js";

export async function chatRoutes(app: FastifyInstance) {
  app.post(
    "/api/chat",
    {
      config: {
        rateLimit: {
          max: config.chatRateLimitMax,
          timeWindow: config.rateLimitWindow,
        },
      },
      schema: chatRouteSchema,
    },
    postChatController,
  );
}
