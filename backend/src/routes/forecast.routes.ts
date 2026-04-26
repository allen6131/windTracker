import type { FastifyInstance } from "fastify";
import { forecastController, providersStatusController } from "../controllers/forecast.controller.js";
import { forecastRouteSchema } from "../schemas/forecast.schemas.js";
import { providerStatusRouteSchema } from "../schemas/provider.schemas.js";

export async function forecastRoutes(app: FastifyInstance) {
  app.post("/forecast", { schema: forecastRouteSchema }, forecastController);
  app.get("/providers/status", { schema: providerStatusRouteSchema }, providersStatusController);
}
