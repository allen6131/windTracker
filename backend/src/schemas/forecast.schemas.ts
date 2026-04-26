import { Type } from "@sinclair/typebox";
import { ActivitySchema, CoordinatesSchema, ForecastCardSchema, SourceAttributionSchema, UnitSystemSchema } from "./common.schemas.js";

export const ForecastRequestBodySchema = Type.Object({
  location: Type.Intersect([
    CoordinatesSchema,
    Type.Object({
      name: Type.Optional(Type.String()),
    }),
  ]),
  activity: ActivitySchema,
  startTime: Type.Optional(Type.String({ format: "date-time" })),
  endTime: Type.Optional(Type.String({ format: "date-time" })),
  units: Type.Optional(UnitSystemSchema),
  include: Type.Optional(
    Type.Array(Type.Union([
      Type.Literal("wind"),
      Type.Literal("marine"),
      Type.Literal("tides"),
      Type.Literal("observations"),
      Type.Literal("alerts"),
    ])),
  ),
});

export const ForecastResponseSchema = Type.Object({
  location: Type.Optional(Type.Object({
    name: Type.String(),
    lat: Type.Number(),
    lon: Type.Number(),
  })),
  cards: Type.Array(ForecastCardSchema),
  timeSeries: Type.Array(Type.Object({
    time: Type.String(),
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
  })),
  sources: Type.Array(SourceAttributionSchema),
  warnings: Type.Array(Type.String()),
});
