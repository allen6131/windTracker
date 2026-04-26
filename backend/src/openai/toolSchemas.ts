import { z } from "zod";
import { activities } from "../schemas/common.schemas.js";

export const toolCoordinateSchema = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });
export const toolUnitsSchema = z.enum(["metric", "imperial", "knots"]).default("imperial");

export const resolveLocationToolSchema = z.object({
  query: z.string().min(1),
  userLocation: toolCoordinateSchema.optional(),
});

export const forecastToolSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  units: toolUnitsSchema,
});

export const observationsToolSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  units: toolUnitsSchema,
});

export const rankActivityToolSchema = z.object({
  activity: z.enum(activities),
  forecast: z.any(),
  marine: z.any().optional(),
  tides: z.any().optional(),
  units: toolUnitsSchema,
});

export const openAiToolDefinitions = [
  {
    type: "function",
    name: "resolve_location",
    description: "Resolve a user-provided place name into forecast coordinates.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["query"],
      properties: {
        query: { type: "string" },
        userLocation: {
          type: "object",
          additionalProperties: false,
          required: ["lat", "lon"],
          properties: { lat: { type: "number" }, lon: { type: "number" } },
        },
      },
    },
  },
  {
    type: "function",
    name: "get_weather_forecast",
    description: "Get normalized wind and weather forecast data.",
    parameters: forecastParameters(),
  },
  {
    type: "function",
    name: "get_marine_forecast",
    description: "Get normalized wave, wind-wave, and swell forecast data.",
    parameters: forecastParameters(),
  },
  {
    type: "function",
    name: "get_tide_predictions",
    description: "Get tide predictions near a coordinate when available.",
    parameters: forecastParameters(),
  },
  {
    type: "function",
    name: "get_nearest_observations",
    description: "Get nearby station or buoy observations.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["lat", "lon", "units"],
      properties: {
        lat: { type: "number" },
        lon: { type: "number" },
        units: { type: "string", enum: ["metric", "imperial", "knots"] },
      },
    },
  },
  {
    type: "function",
    name: "rank_activity_windows",
    description: "Score best and avoid windows deterministically for an activity.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["activity", "forecast", "units"],
      properties: {
        activity: { type: "string", enum: activities },
        forecast: { type: "object" },
        marine: { type: "object" },
        tides: { type: "object" },
        units: { type: "string", enum: ["metric", "imperial", "knots"] },
      },
    },
  },
] as const;

function forecastParameters() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["lat", "lon", "units"],
    properties: {
      lat: { type: "number" },
      lon: { type: "number" },
      startTime: { type: "string" },
      endTime: { type: "string" },
      units: { type: "string", enum: ["metric", "imperial", "knots"] },
    },
  };
}
