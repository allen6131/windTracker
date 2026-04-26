import type { Coordinates } from "../domain/coordinates.js";
import { ProviderError } from "../domain/errors.js";
import type { NormalizedWeatherForecast } from "../domain/forecast.js";
import type { LocationCandidate } from "../domain/location.js";
import type { NormalizedAlert } from "../domain/observations.js";
import type { WeatherProvider } from "../providers/types/weatherProvider.js";
import { LocationService } from "./locationService.js";

export interface ForecastBundle {
  weather: NormalizedWeatherForecast | null;
  alerts: NormalizedAlert[];
  warnings: string[];
}

export class ForecastService {
  constructor(
    private readonly weatherProvider: WeatherProvider,
    private readonly locationService: LocationService,
    private readonly nwsProvider?: { getAlerts(input: { coordinates: Coordinates }): Promise<NormalizedAlert[]> },
  ) {}

  async getForecast(input: {
    coordinates: Coordinates;
    location?: LocationCandidate;
    startTime?: string;
    endTime?: string;
  }): Promise<ForecastBundle> {
    const warnings: string[] = [];
    let weather: NormalizedWeatherForecast | null = null;
    let alerts: NormalizedAlert[] = [];

    try {
      weather = await this.weatherProvider.getForecast({
        coordinates: input.coordinates,
        startTime: input.startTime,
        endTime: input.endTime,
      });
      warnings.push(...weather.warnings);
    } catch (error) {
      if (error instanceof ProviderError) {
        warnings.push(error.safeMessage);
      } else {
        warnings.push("Weather forecast is temporarily unavailable.");
      }
    }

    if (this.nwsProvider && this.locationService.isLikelyUnitedStates(input.location)) {
      try {
        alerts = await this.nwsProvider.getAlerts({ coordinates: input.coordinates });
      } catch {
        warnings.push("NWS alert enrichment is unavailable.");
      }
    }

    return { weather, alerts, warnings };
  }
}
