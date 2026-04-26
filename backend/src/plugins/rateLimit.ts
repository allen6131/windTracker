import fastifyRateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

export async function registerRateLimit(app: FastifyInstance) {
  await app.register(fastifyRateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
  });
}
