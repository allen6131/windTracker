import { z } from "zod";
import type { Activity } from "../domain/activity.js";
import { ForecastService } from "./forecastService.js";
import { LocationService } from "./locationService.js";
import { MarineService } from "./marineService.js";
import { ObservationService } from "./observationService.js";
import { ActivityRankingService } from "./activityRankingService.js";
import { TideService } from "./tideService.js";

const coordinatesSchema = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });
const unitsSchema = z.enum(["metric", "imperial", "knots"]).default("imperial");
const activitySchema = z.enum([
  "kitesurfing",
  "windsurfing",
  "sailing",
  "surfing",
  "fishing",
  "boating",
  "paragliding",
  "hiking",
  "general",
]);

export class ToolRegistry {
  constructor(
    private readonly locationService: LocationService,
    private readonly forecastService: ForecastService,
    private readonly marineService: MarineService,
    private readonly tideService: TideService,
    private readonly observationService: ObservationService,
    private readonly rankingService: ActivityRankingService,
  ) {}

  get services() {
    return {
      locationService: this.locationService,
      forecastService: this.forecastService,
      marineService: this.marineService,
      tideService: this.tideService,
      observationService: this.observationService,
      rankingService: this.rankingService,
    };
  }

  execute(name: string, args: unknown): unknown {
    switch (name) {
      case "resolve_location": {
        return this.resolveLocation(args);
      }
      case "get_weather_forecast": {
        return this.getWeatherForecast(args);
      }
      case "get_marine_forecast": {
        return this.getMarineForecast(args);
      }
      case "get_tide_predictions": {
        return this.getTidePredictions(args);
      }
      case "get_nearest_observations": {
        return this.getNearestObservations(args);
      }
      case "rank_activity_windows": {
        return this.rankActivityWindows(args);
      }
      default:
        throw new Error(`Tool ${name} is not whitelisted.`);
    }
  }

  resolveLocation(args: unknown) {
    const input = z.object({ query: z.string(), userLocation: coordinatesSchema.optional() }).parse(args);
    return this.locationService.resolve(compact({ query: input.query, userLocation: input.userLocation }));
  }

  getWeatherForecast(args: unknown) {
    const input = forecastToolSchema.parse(args);
    return this.forecastService.getForecast(compact({
      coordinates: input,
      startTime: input.startTime,
      endTime: input.endTime,
      location: input.location,
    }));
  }

  getMarineForecast(args: unknown) {
    const input = forecastToolSchema.parse(args);
    return this.marineService.getMarineForecast(compact({ coordinates: input, startTime: input.startTime, endTime: input.endTime }));
  }

  getTidePredictions(args: unknown) {
    const input = forecastToolSchema.parse(args);
    return this.tideService.getTides(compact({ coordinates: input, startTime: input.startTime, endTime: input.endTime, location: input.location }));
  }

  getNearestObservations(args: unknown) {
    const input = z.object({ lat: z.number(), lon: z.number(), units: unitsSchema.optional() }).parse(args);
    return this.observationService.getNearestObservations({ coordinates: { lat: input.lat, lon: input.lon } });
  }

  rankActivityWindows(args: unknown) {
    const input = z
      .object({
        activity: activitySchema,
        forecast: z.any(),
        marine: z.any().optional(),
        tides: z.any().optional(),
        units: unitsSchema.optional(),
      })
      .parse(args);
    return this.rankingService.rank({
      activity: input.activity as Activity,
      weather: input.forecast,
      marine: input.marine,
    });
  }
}

export const forecastToolSchema = coordinatesSchema.extend({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  units: unitsSchema.optional(),
  location: z.any().optional(),
});

export interface ToolServices {
  locationService: LocationService;
  forecastService: ForecastService;
  marineService: MarineService;
  tideService: TideService;
  observationService: ObservationService;
  rankingService: ActivityRankingService;
}

export function createToolRegistry(services: ToolServices): ToolRegistry {
  return new ToolRegistry(
    services.locationService,
    services.forecastService,
    services.marineService,
    services.tideService,
    services.observationService,
    services.rankingService,
  );
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)) as T;
}
