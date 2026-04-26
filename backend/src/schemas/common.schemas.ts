import { z } from "zod";

export const units = ["metric", "imperial", "knots"] as const;
export const platforms = ["ios", "android", "web", "unknown"] as const;
export const activities = [
  "kitesurfing",
  "windsurfing",
  "sailing",
  "surfing",
  "fishing",
  "boating",
  "paragliding",
  "hiking",
  "general",
] as const;

export const coordinatesZodSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const coordinatesJsonSchema = {
  type: "object",
  required: ["lat", "lon"],
  additionalProperties: false,
  properties: {
    lat: { type: "number", minimum: -90, maximum: 90, examples: [26.1118] },
    lon: { type: "number", minimum: -180, maximum: 180, examples: [-97.1681] },
  },
} as const;

export const coordinatesSchema = coordinatesJsonSchema;

export const unitsSchema = {
  type: "string",
  enum: units,
} as const;

export const activitySchema = {
  type: "string",
  enum: activities,
} as const;

export const locationCandidateJsonSchema = {
  type: "object",
  required: ["id", "name", "lat", "lon", "source"],
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    admin1: { type: "string" },
    country: { type: "string" },
    lat: { type: "number" },
    lon: { type: "number" },
    timezone: { type: "string" },
    source: { type: "string", enum: ["Google", "Open-Meteo", "Manual"] },
    confidence: { type: "number" },
  },
} as const;

export const sourceSchema = {
  type: "object",
  required: ["provider", "dataset", "fetchedAt"],
  additionalProperties: false,
  properties: {
    provider: {
      type: "string",
      enum: ["Open-Meteo", "NOAA CO-OPS", "NOAA NDBC", "NWS", "Google", "Stormglass", "Meteomatics"],
    },
    dataset: { type: "string" },
    url: { type: "string" },
    fetchedAt: { type: "string", format: "date-time" },
    stationName: { type: "string" },
    stationId: { type: "string" },
    distanceKm: { type: "number" },
  },
} as const;

export const sourceAttributionSchema = sourceSchema;

export const healthResponseSchema = {
  type: "object",
  required: ["ok", "version", "environment", "time"],
  properties: {
    ok: { type: "boolean", examples: [true] },
    version: { type: "string", examples: ["0.1.0"] },
    environment: { type: "string", examples: ["development"] },
    time: { type: "string", format: "date-time" },
  },
} as const;

export const cardSchema = {
  type: "object",
  required: ["type", "title", "items"],
  additionalProperties: false,
  properties: {
    type: {
      type: "string",
      enum: ["current_conditions", "forecast_summary", "best_windows", "marine", "tides", "alerts"],
    },
    title: { type: "string" },
    subtitle: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        required: ["label", "value"],
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          severity: { type: "string", enum: ["normal", "watch", "warning"] },
        },
      },
    },
  },
} as const;

export const ForecastCardSchema = cardSchema;
export const SourceAttributionSchema = sourceSchema;
export const CoordinatesSchema = coordinatesJsonSchema;
export const UnitSystemSchema = unitsSchema;
export const ActivitySchema = activitySchema;

export const timeSeriesPointSchema = {
  type: "object",
  required: ["time"],
  additionalProperties: false,
  properties: {
    time: { type: "string", format: "date-time" },
    windSpeed: { type: "number" },
    windSpeedUnit: { type: "string" },
    windDirectionDegrees: { type: "number" },
    windDirectionCompass: { type: "string" },
    windGust: { type: "number" },
    airTemperature: { type: "number" },
    precipitationProbability: { type: "number" },
    waveHeight: { type: "number" },
    swellHeight: { type: "number" },
    wavePeriod: { type: "number" },
  },
} as const;

export const forecastPayloadSchema = {
  type: "object",
  required: ["cards", "timeSeries", "sources", "warnings"],
  additionalProperties: false,
  properties: {
    cards: { type: "array", items: cardSchema },
    timeSeries: { type: "array", items: timeSeriesPointSchema },
    sources: { type: "array", items: sourceSchema },
    warnings: { type: "array", items: { type: "string" } },
  },
} as const;
