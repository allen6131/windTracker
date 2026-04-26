import type { SourceAttribution } from "./sources";

export interface NormalizedWeatherPoint {
  time: string;
  temperatureC?: number;
  apparentTemperatureC?: number;
  precipitationMm?: number;
  precipitationProbability?: number;
  cloudCoverPercent?: number;
  visibilityMeters?: number;
  pressureHpa?: number;
  windSpeedMs?: number;
  windDirectionDegrees?: number;
  windGustMs?: number;
  weatherCode?: string | number;
}

export interface NormalizedWeatherForecast {
  current?: NormalizedWeatherPoint;
  hourly: NormalizedWeatherPoint[];
  daily?: Array<{
    time: string;
    sunrise?: string;
    sunset?: string;
    uvIndexMax?: number;
  }>;
  timezone?: string;
  sources: SourceAttribution[];
  warnings: string[];
}
