import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import { config } from "../config.js";

export async function registerCors(app: FastifyInstance) {
  const origins = config.corsOrigins.split(",").map((origin) => origin.trim());

  await app.register(fastifyCors, {
    origin: config.nodeEnv === "production" ? origins : true,
    credentials: false,
  });
}
