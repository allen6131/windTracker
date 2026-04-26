import type { FastifyInstance } from "fastify";
import { searchLocationsController } from "../controllers/location.controller.js";
import { locationSearchRouteSchema } from "../schemas/location.schemas.js";

export async function locationRoutes(app: FastifyInstance) {
  app.post("/api/locations/search", { schema: locationSearchRouteSchema }, searchLocationsController);
}
