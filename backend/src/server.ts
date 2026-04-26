import { buildApp } from "./app.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

const app = await buildApp();

try {
  await app.listen({ host: config.host, port: config.port });
  logger.info({ host: config.host, port: config.port }, "Wind AI Forecast API listening");
} catch (error) {
  logger.error({ error }, "Failed to start API");
  process.exit(1);
}
