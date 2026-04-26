import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedWeatherForecast } from "../../domain/forecast.js";

export interface ForecastProviderInput {
  coordinates: Coordinates;
  startTime?: string;
  endTime?: string;
}

export interface WeatherProvider {
  getForecast(input: ForecastProviderInput): Promise<NormalizedWeatherForecast>;
}
