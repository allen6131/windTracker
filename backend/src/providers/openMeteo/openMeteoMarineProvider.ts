import type { Cache } from "../../cache/cache.js";
import { config } from "../../config.js";
import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedMarineForecast } from "../../domain/marine.js";
import { fetchJson } from "../../utils/fetchJson.js";
import { roundCoordinate } from "../../utils/haversine.js";
import type { MarineProvider } from "../types/marineProvider.js";
import { mapOpenMeteoMarine } from "./openMeteoMapper.js";

export class OpenMeteoMarineProvider implements MarineProvider {
  constructor(private readonly cache: Cache) {}

  async getMarineForecast(input: {
    coordinates: Coordinates;
    startTime?: string;
    endTime?: string;
  }): Promise<NormalizedMarineForecast | null> {
    const lat = roundCoordinate(input.coordinates.lat);
    const lon = roundCoordinate(input.coordinates.lon);
    const cacheKey = `openmeteo:marine:${lat}:${lon}:${input.startTime ?? "na"}:${input.endTime ?? "na"}`;
    const cached = await this.cache.get<NormalizedMarineForecast | null>(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({
      latitude: String(input.coordinates.lat),
      longitude: String(input.coordinates.lon),
      hourly:
        "wave_height,wave_direction,wave_period,wave_peak_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period",
      timezone: "auto",
      forecast_days: "7",
    });
    const url = `https://marine-api.open-meteo.com/v1/marine?${params}`;
    try {
      const raw = await fetchJson<unknown>(url, { timeoutMs: config.providerTimeoutMs });
      const mapped = mapOpenMeteoMarine(raw, url);
      if (!mapped.hourly.length) return null;
      await this.cache.set(cacheKey, mapped, 30 * 60);
      return mapped;
    } catch {
      return null;
    }
  }
}
