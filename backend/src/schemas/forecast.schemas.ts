import { activityJsonSchema, cardSchema, coordinatesJsonSchema, sourceSchema, timeSeriesPointJsonSchema, unitsJsonSchema } from "./common.schemas.js";
import { errorResponses } from "./error.schemas.js";

export const forecastRequestBodyJsonSchema = {
  type: "object",
  required: ["location", "activity"],
  additionalProperties: false,
  properties: {
    location: {
      type: "object",
      required: ["lat", "lon"],
      additionalProperties: false,
      properties: {
        ...coordinatesJsonSchema.properties,
        name: { type: "string" },
      },
    },
    activity: activityJsonSchema,
    startTime: { type: "string", format: "date-time" },
    endTime: { type: "string", format: "date-time" },
    units: unitsJsonSchema,
    include: {
      type: "array",
      items: { type: "string", enum: ["wind", "marine", "tides", "observations", "alerts"] },
    },
  },
  examples: [
    {
      location: { lat: 26.1118, lon: -97.1681, name: "South Padre Island" },
      activity: "kitesurfing",
      startTime: "2026-04-27T12:00:00-05:00",
      endTime: "2026-04-27T18:00:00-05:00",
      units: "imperial",
      include: ["wind", "marine", "tides", "observations"],
    },
  ],
} as const;

export const forecastResponseJsonSchema = {
  type: "object",
  required: ["cards", "timeSeries", "sources", "warnings"],
  additionalProperties: false,
  properties: {
    location: {
      type: "object",
      required: ["lat", "lon"],
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        lat: { type: "number" },
        lon: { type: "number" },
      },
    },
    cards: { type: "array", items: cardSchema },
    timeSeries: { type: "array", items: timeSeriesPointJsonSchema },
    sources: { type: "array", items: sourceSchema },
    warnings: { type: "array", items: { type: "string" } },
  },
  examples: [
    {
      location: { name: "South Padre Island", lat: 26.1118, lon: -97.1681 },
      cards: [{ type: "forecast_summary", title: "Wind summary", items: [{ label: "Wind", value: "12 mph SE" }] }],
      timeSeries: [],
      sources: [{ provider: "Open-Meteo", dataset: "Forecast API", fetchedAt: "2026-04-26T12:00:00.000Z" }],
      warnings: [],
    },
  ],
} as const;

export const forecastRouteSchema = {
  summary: "Get a structured forecast",
  description: "Direct endpoint for app screens that need structured wind, marine, tide, observation, and ranking data without chat.",
  tags: ["Forecasts"],
  body: forecastRequestBodyJsonSchema,
  response: {
    200: forecastResponseJsonSchema,
    ...errorResponses,
  },
} as const;
