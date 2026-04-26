import type { Cache } from "../../cache/cache.js";
import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedWeatherForecast } from "../../domain/forecast.js";
import type { WeatherProvider } from "../types/weatherProvider.js";
import { config } from "../../config.js";
import { ProviderError } from "../../domain/errors.js";
import { fetchJson } from "../../utils/fetchJson.js";
import { roundCoordinateForCache } from "../../utils/haversine.js";
import { mapOpenMeteoForecast } from "./openMeteoMapper.js";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteoForecastProvider implements WeatherProvider {
  constructor(private readonly cache: Cache) {}

  async getForecast(input: {
    coordinates: Coordinates;
    startTime?: string;
    endTime?: string;
  }): Promise<NormalizedWeatherForecast> {
    const lat = roundCoordinateForCache(input.coordinates.lat);
    const lon = roundCoordinateForCache(input.coordinates.lon);
    const cacheKey = `openmeteo:forecast:${lat}:${lon}:${input.startTime ?? "any"}:${input.endTime ?? "any"}`;
    const cached = await this.cache.get<NormalizedWeatherForecast>(cacheKey);
    if (cached) return cached;

    const url = new URL(FORECAST_URL);
    url.searchParams.set("latitude", String(input.coordinates.lat));
    url.searchParams.set("longitude", String(input.coordinates.lon));
    url.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "cloud_cover",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
      ].join(","),
    );
    url.searchParams.set(
      "hourly",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation_probability",
        "precipitation",
        "weather_code",
        "cloud_cover",
        "visibility",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
      ].join(","),
    );
    url.searchParams.set("daily", "sunrise,sunset,uv_index_max");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", String(config.defaultForecastDays));
    url.searchParams.set("wind_speed_unit", "ms");

    try {
      const raw = await fetchJson<unknown>(url, { timeoutMs: config.providerTimeoutMs });
      const forecast = mapOpenMeteoForecast(raw, url.toString());
      await this.cache.set(cacheKey, forecast, 15 * 60);
      return forecast;
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError("Open-Meteo", error instanceof Error ? error.message : "forecast request failed");
    }
  }
}
