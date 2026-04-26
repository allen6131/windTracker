import type { FastifyInstance } from "fastify";
import { chatRoutes } from "./chat.routes.js";
import { forecastRoutes } from "./forecast.routes.js";
import { healthRoutes } from "./health.routes.js";
import { locationRoutes } from "./location.routes.js";

export async function registerRoutes(app: FastifyInstance) {
  await healthRoutes(app);
  await chatRoutes(app);
  await locationRoutes(app);
  await forecastRoutes(app);
}
