import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import { config } from "../config.js";

export async function registerCors(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: config.nodeEnv === "production" ? config.corsOrigins : true,
    credentials: false,
  });
}
