import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { locationService } from "../services/dependencies.js";

const requestSchema = z.object({
  query: z.string().min(1).max(300),
  userLocation: z.object({ lat: z.number(), lon: z.number() }).optional(),
});

export async function searchLocationsController(request: FastifyRequest, reply: FastifyReply) {
  const input = requestSchema.parse(request.body);
  const results = await locationService.search(input.query, input.userLocation, 5);
  return reply.send({ query: input.query, results });
}
