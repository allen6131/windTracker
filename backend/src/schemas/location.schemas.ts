import { coordinatesJsonSchema, locationCandidateJsonSchema } from "./common.schemas.js";
import { errorResponses } from "./error.schemas.js";

export const locationSearchRequestJsonSchema = {
  type: "object",
  required: ["query"],
  additionalProperties: false,
  properties: {
    query: { type: "string", minLength: 1, maxLength: 300, examples: ["South Padre"] },
    userLocation: coordinatesJsonSchema,
  },
} as const;

export const locationSearchResponseJsonSchema = {
  type: "object",
  required: ["query", "results"],
  additionalProperties: false,
  properties: {
    query: { type: "string" },
    results: { type: "array", items: locationCandidateJsonSchema },
  },
} as const;

export const locationSearchRouteSchema = {
  summary: "Search locations",
  description: "Search for forecast destinations using Google when configured, otherwise Open-Meteo geocoding.",
  tags: ["Locations"],
  body: locationSearchRequestJsonSchema,
  response: {
    200: locationSearchResponseJsonSchema,
    ...errorResponses,
  },
  examples: [
    {
      request: {
        query: "South Padre",
        userLocation: { lat: 30, lon: -97 },
      },
      response: {
        query: "South Padre",
        results: [
          {
            id: "openmeteo_123",
            name: "South Padre Island",
            admin1: "Texas",
            country: "United States",
            lat: 26.1118,
            lon: -97.1681,
            timezone: "America/Chicago",
            source: "Open-Meteo",
          },
        ],
      },
    },
  ],
} as const;
