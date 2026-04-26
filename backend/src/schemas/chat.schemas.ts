import { activities, cardSchema, coordinatesJsonSchema, sourceSchema, timeSeriesPointSchema, units } from "./common.schemas.js";
import { errorResponses } from "./error.schemas.js";

const platformSchema = { type: "string", enum: ["ios", "android", "web", "unknown"] } as const;

export const chatRequestSchema = {
  type: "object",
  required: ["message", "platform"],
  additionalProperties: false,
  properties: {
    conversationId: { type: "string", minLength: 1, maxLength: 160 },
    message: { type: "string", minLength: 1, maxLength: 2000 },
    userLocation: coordinatesJsonSchema,
    units: { type: "string", enum: units },
    platform: platformSchema,
  },
  examples: [
    {
      conversationId: "conv_123",
      message: "Is South Padre good for kiteboarding tomorrow afternoon?",
      userLocation: { lat: 40.7128, lon: -74.006 },
      units: "imperial",
      platform: "ios",
    },
  ],
} as const;

export const chatResponseSchema = {
  type: "object",
  required: ["conversationId", "assistantMessage", "clarification", "cards", "timeSeries", "sources", "warnings"],
  additionalProperties: false,
  properties: {
    conversationId: { type: "string" },
    assistantMessage: { type: "string" },
    location: {
      type: "object",
      required: ["name", "lat", "lon"],
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        admin1: { type: "string" },
        country: { type: "string" },
        lat: { type: "number" },
        lon: { type: "number" },
        timezone: { type: "string" },
      },
    },
    clarification: {
      type: "object",
      required: ["needed", "choices"],
      additionalProperties: false,
      properties: {
        needed: { type: "boolean" },
        question: { anyOf: [{ type: "string" }, { type: "null" }] },
        choices: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "label", "lat", "lon"],
            additionalProperties: false,
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              lat: { type: "number" },
              lon: { type: "number" },
            },
          },
        },
      },
    },
    cards: { type: "array", items: cardSchema },
    timeSeries: { type: "array", items: timeSeriesPointSchema },
    sources: { type: "array", items: sourceSchema },
    warnings: { type: "array", items: { type: "string" } },
  },
  examples: [
    {
      conversationId: "conv_abc",
      assistantMessage: "Tomorrow afternoon looks breezy for South Padre. Watch gust spread and check local conditions.",
      location: {
        name: "South Padre Island",
        admin1: "Texas",
        country: "United States",
        lat: 26.1118,
        lon: -97.1681,
        timezone: "America/Chicago",
      },
      clarification: { needed: false, question: null, choices: [] },
      cards: [
        {
          type: "current_conditions",
          title: "Current wind",
          subtitle: "South Padre Island",
          items: [{ label: "Wind", value: "16 mph SE", severity: "normal" }],
        },
      ],
      timeSeries: [],
      sources: [{ provider: "Open-Meteo", dataset: "Forecast API", fetchedAt: "2026-04-26T12:00:00.000Z" }],
      warnings: [],
    },
  ],
} as const;

export const forecastIntentSchema = {
  type: "object",
  required: [
    "locationQuery",
    "coordinates",
    "activity",
    "startTimeLocal",
    "endTimeLocal",
    "datePhrase",
    "units",
    "requestedFields",
    "needsClarification",
    "clarificationQuestion",
  ],
  properties: {
    locationQuery: { anyOf: [{ type: "string" }, { type: "null" }] },
    coordinates: { anyOf: [coordinatesJsonSchema, { type: "null" }] },
    activity: { type: "string", enum: activities },
    startTimeLocal: { anyOf: [{ type: "string" }, { type: "null" }] },
    endTimeLocal: { anyOf: [{ type: "string" }, { type: "null" }] },
    datePhrase: { anyOf: [{ type: "string" }, { type: "null" }] },
    units: { anyOf: [{ type: "string", enum: units }, { type: "null" }] },
    requestedFields: { type: "array", items: { type: "string" } },
    needsClarification: { type: "boolean" },
    clarificationQuestion: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
} as const;

export const chatRouteSchema = {
  summary: "Send a natural-language forecast chat message",
  description:
    "Main endpoint for native mobile chat UI. The backend resolves intent, fetches provider data, ranks windows, and returns conversational and structured forecast output.",
  tags: ["Chat"],
  body: chatRequestSchema,
  examples: [
    {
      message: "Is South Padre good for kiteboarding tomorrow afternoon?",
      units: "imperial",
      platform: "ios",
    },
  ],
  response: {
    200: chatResponseSchema,
    ...errorResponses,
  },
};
