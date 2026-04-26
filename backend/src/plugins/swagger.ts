import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { config } from "../config.js";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Wind AI Forecast API",
        description:
          "Backend API for native iOS and Android wind, weather, marine, tide, and AI chat forecast apps.",
        version: "0.1.0",
      },
      servers: [
        {
          url: config.publicApiBaseUrl,
          description: config.nodeEnv === "production" ? "Production" : "Local development",
        },
      ],
      tags: [
        { name: "Health", description: "Health checks" },
        { name: "Chat", description: "AI chat forecast endpoints" },
        { name: "Locations", description: "Location search and disambiguation" },
        { name: "Forecasts", description: "Wind, weather, marine, tide, and observation forecasts" },
        { name: "Providers", description: "Provider metadata and diagnostics" },
      ],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });

  app.get(
    "/openapi.json",
    {
      schema: {
        hide: true,
      },
    },
    async () => app.swagger(),
  );
}
