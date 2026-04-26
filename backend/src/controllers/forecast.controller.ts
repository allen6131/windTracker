import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { services } from "../services/dependencies.js";

const requestSchema = z.object({
  location: z.object({ lat: z.number(), lon: z.number(), name: z.string().optional() }),
  activity: z
    .enum(["kitesurfing", "windsurfing", "sailing", "surfing", "fishing", "boating", "paragliding", "hiking", "general"])
    .default("general"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  units: z.enum(["metric", "imperial", "knots"]).default("imperial"),
  include: z.array(z.string()).optional(),
});

export async function forecastController(request: FastifyRequest, reply: FastifyReply) {
  const body = requestSchema.parse(request.body);
  const location = services.locationService.manualLocation(body.location);
  location.name = body.location.name ?? location.name;
  const base = { coordinates: location, startTime: body.startTime, endTime: body.endTime };
  const [forecast, marine, tides, observations] = await Promise.all([
    services.forecastService.getForecast({ ...base, location }),
    services.marineService.getMarineForecast(base),
    services.tideService.getTides({ ...base, location }),
    services.observationService.getNearestObservations({ coordinates: location }),
  ]);
  const ranking = services.rankingService.rank({ activity: body.activity, weather: forecast.weather, marine: marine.marine });
  const warnings = [...forecast.warnings, ...marine.warnings, ...tides.warnings, ...observations.warnings];
  const parts = {
    location,
    weather: forecast.weather,
    marine: marine.marine,
    tides: tides.tides,
    observations: observations.observations,
    alerts: forecast.alerts,
    ranking,
    units: body.units,
    warnings,
  };
  const responseBuilder = services.responseBuilder;
  return reply.send({
    location: { name: location.name, lat: location.lat, lon: location.lon },
    cards: responseBuilder.buildCards(parts),
    timeSeries: responseBuilder.buildTimeSeries(parts),
    sources: responseBuilder.collectSources(parts),
    warnings,
  });
}

export async function providersStatusController(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    providers: [
      { name: "Open-Meteo", configured: true, requiredKey: false, role: ["weather", "marine", "geocoding fallback"] },
      { name: "Google Places", configured: services.config.googleMapsApiKeyConfigured, requiredKey: true, role: ["location search"] },
      { name: "NOAA", configured: true, requiredKey: false, role: ["tides", "buoys", "observations", "alerts"] },
      { name: "Stormglass", configured: services.config.stormglassConfigured, requiredKey: true, role: ["premium marine", "tides"] },
      {
        name: "Meteomatics",
        configured: services.config.meteomaticsConfigured,
        requiredKey: true,
        role: ["premium weather", "marine", "tides"],
      },
    ],
  });
}
