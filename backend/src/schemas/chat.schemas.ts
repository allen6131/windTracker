import { Type } from "@sinclair/typebox";
import { activityValues } from "../domain/activity.js";
import { cardSchema, coordinatesJsonSchema, coordinatesSchema, sourceAttributionSchema, unitsSchema } from "./common.schemas.js";
import { errorResponseSchemas } from "./error.schemas.js";

export const platformSchema = Type.Union([
  Type.Literal("ios"),
  Type.Literal("android"),
  Type.Literal("web"),
  Type.Literal("unknown"),
]);

export const chatRequestSchema = Type.Object(
  {
    conversationId: Type.Optional(Type.String({ minLength: 1, maxLength: 160 })),
    message: Type.String({ minLength: 1, maxLength: 2000 }),
    userLocation: Type.Optional(coordinatesJsonSchema),
    units: Type.Optional(unitsSchema),
    platform: platformSchema,
  },
  {
    additionalProperties: false,
    examples: [
      {
        conversationId: "conv_123",
        message: "Is South Padre good for kiteboarding tomorrow afternoon?",
        userLocation: { lat: 40.7128, lon: -74.006 },
        units: "imperial",
        platform: "ios",
      },
    ],
  },
);

export const chatTimeSeriesPointSchema = Type.Object(
  {
    time: Type.String({ format: "date-time" }),
    windSpeed: Type.Optional(Type.Number()),
    windSpeedUnit: Type.Optional(Type.String()),
    windDirectionDegrees: Type.Optional(Type.Number()),
    windDirectionCompass: Type.Optional(Type.String()),
    windGust: Type.Optional(Type.Number()),
    airTemperature: Type.Optional(Type.Number()),
    precipitationProbability: Type.Optional(Type.Number()),
    waveHeight: Type.Optional(Type.Number()),
    swellHeight: Type.Optional(Type.Number()),
    wavePeriod: Type.Optional(Type.Number()),
  },
  { additionalProperties: false },
);

export const chatResponseSchema = Type.Object(
  {
    conversationId: Type.String(),
    assistantMessage: Type.String(),
    location: Type.Optional(
      Type.Object(
        {
          name: Type.String(),
          admin1: Type.Optional(Type.String()),
          country: Type.Optional(Type.String()),
          lat: Type.Number(),
          lon: Type.Number(),
          timezone: Type.Optional(Type.String()),
        },
        { additionalProperties: false },
      ),
    ),
    clarification: Type.Object(
      {
        needed: Type.Boolean(),
        question: Type.Optional(Type.Union([Type.String(), Type.Null()])),
        choices: Type.Array(
          Type.Object(
            {
              id: Type.String(),
              label: Type.String(),
              lat: Type.Number(),
              lon: Type.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      },
      { additionalProperties: false },
    ),
    cards: Type.Array(cardSchema),
    timeSeries: Type.Array(chatTimeSeriesPointSchema),
    sources: Type.Array(sourceAttributionSchema),
    warnings: Type.Array(Type.String()),
  },
  {
    additionalProperties: false,
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
  },
);

export const forecastIntentSchema = Type.Object({
  locationQuery: Type.Union([Type.String(), Type.Null()]),
  coordinates: Type.Union([coordinatesSchema, Type.Null()]),
  activity: Type.Union(activityValues.map((activity) => Type.Literal(activity))),
  startTimeLocal: Type.Union([Type.String(), Type.Null()]),
  endTimeLocal: Type.Union([Type.String(), Type.Null()]),
  datePhrase: Type.Union([Type.String(), Type.Null()]),
  units: Type.Union([unitsSchema, Type.Null()]),
  requestedFields: Type.Array(Type.String()),
  needsClarification: Type.Boolean(),
  clarificationQuestion: Type.Union([Type.String(), Type.Null()]),
});

export const chatRouteSchema = {
  summary: "Send a natural-language forecast chat message",
  description:
    "Main endpoint for native mobile chat UI. The backend resolves intent, fetches provider data, ranks windows, and returns conversational and structured forecast output.",
  tags: ["Chat"],
  body: chatRequestSchema,
  response: {
    200: chatResponseSchema,
    ...errorResponseSchemas,
  },
};
