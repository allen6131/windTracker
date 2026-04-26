import type { Cache } from "../../cache/cache.js";
import type { Coordinates } from "../../domain/coordinates.js";
import type { LocationCandidate } from "../../domain/location.js";
import { ProviderError } from "../../domain/errors.js";
import { fetchJson } from "../../utils/fetchJson.js";
import type { LocationProvider } from "../types/locationProvider.js";

interface OpenMeteoGeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export class OpenMeteoGeocodingProvider implements LocationProvider {
  constructor(private readonly cache: Cache) {}

  async search(input: { query: string; userLocation?: Coordinates; limit?: number }): Promise<LocationCandidate[]> {
    const limit = input.limit ?? 5;
    const cacheKey = `openmeteo:geocode:${input.query.toLowerCase().trim()}:${limit}`;
    const cached = await this.cache.get<LocationCandidate[]>(cacheKey);
    if (cached) return cached;

    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", input.query);
    url.searchParams.set("count", String(limit));
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    try {
      const json = await fetchJson<{ results?: OpenMeteoGeocodeResult[] }>(url, "Open-Meteo", 6000);
      const candidates =
        json.results?.map((result, index) =>
          compactLocation({
            id: `openmeteo_${result.id}`,
            name: result.name,
            admin1: result.admin1,
            country: result.country,
            lat: result.latitude,
            lon: result.longitude,
            timezone: result.timezone,
            source: "Open-Meteo" as const,
            confidence: Math.max(0.35, 0.95 - index * 0.12),
          }),
        ) ?? [];
      await this.cache.set(cacheKey, candidates, 7 * 24 * 60 * 60);
      return candidates;
    } catch (error) {
      throw new ProviderError("Open-Meteo", error instanceof Error ? error.message : "Geocoding failed");
    }
  }
}

function compactLocation(location: LocationCandidate): LocationCandidate {
  return Object.fromEntries(Object.entries(location).filter(([, value]) => value !== undefined)) as LocationCandidate;
}
