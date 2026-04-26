import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { healthResponseSchema } from "../schemas/common.schemas.js";
import { errorResponses } from "../schemas/error.schemas.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/api/health",
    {
      schema: {
        summary: "Health check",
        description: "Health check for load balancers and mobile diagnostics.",
        tags: ["Health"],
        response: {
          200: healthResponseSchema,
          ...errorResponses,
        },
      },
    },
    async () => ({
      ok: true,
      version: "0.1.0",
      environment: config.nodeEnv,
      time: new Date().toISOString(),
    }),
  );
}
