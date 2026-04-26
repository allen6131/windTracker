import Fastify from "fastify";
import { config } from "./config.js";
import { registerCors } from "./plugins/cors.js";
import { registerErrorHandler } from "./plugins/errorHandler.js";
import { registerHelmet } from "./plugins/helmet.js";
import { registerRateLimit } from "./plugins/rateLimit.js";
import { registerSwagger } from "./plugins/swagger.js";
import { registerRoutes } from "./routes/index.js";

export async function buildApp() {
  const app = Fastify({
    logger: { level: config.logLevel },
    bodyLimit: 1_000_000,
    genReqId: (request) => request.headers["x-request-id"]?.toString() ?? crypto.randomUUID(),
  });

  registerErrorHandler(app);
  await registerHelmet(app);
  await registerCors(app);
  await registerRateLimit(app);
  await registerSwagger(app);
  await registerRoutes(app);

  app.addHook("onResponse", async (request, reply) => {
    request.log.info({
      requestId: request.id,
      method: request.method,
      path: request.url.split("?")[0],
      statusCode: reply.statusCode,
      durationMs: reply.elapsedTime,
    });
  });

  app.log.info({ environment: config.nodeEnv, mockAiMode: config.isMockAiMode }, "Fastify app configured");
  return app;
}
