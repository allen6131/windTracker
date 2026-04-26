import type { Cache } from "../../cache/cache.js";
import type { Coordinates } from "../../domain/coordinates.js";
import type { LocationCandidate } from "../../domain/location.js";
import { config } from "../../config.js";
import { fetchJson } from "../../utils/fetchJson.js";
import type { LocationProvider } from "../types/locationProvider.js";

interface GooglePlaceTextSearchResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
  }>;
}

export class GooglePlacesProvider implements LocationProvider {
  constructor(private readonly cache: Cache) {}

  async search(input: { query: string; userLocation?: Coordinates; limit?: number }): Promise<LocationCandidate[]> {
    if (!config.googleMapsApiKey) return [];

    const limit = input.limit ?? 5;
    const cacheKey = `google:places:${input.query.toLowerCase().trim()}:${input.userLocation?.lat ?? ""}:${input.userLocation?.lon ?? ""}:${limit}`;
    const cached = await this.cache.get<LocationCandidate[]>(cacheKey);
    if (cached) return cached;

    const body: Record<string, unknown> = {
      textQuery: input.query,
      maxResultCount: limit,
    };
    if (input.userLocation) {
      body.locationBias = {
        circle: {
          center: { latitude: input.userLocation.lat, longitude: input.userLocation.lon },
          radius: 50000,
        },
      };
    }

    const json = await fetchJson<GooglePlaceTextSearchResponse>("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      timeoutMs: 6000,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": config.googleMapsApiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify(body),
    });

    const results =
      json.places
        ?.filter((place) => place.location?.latitude !== undefined && place.location.longitude !== undefined)
        .map((place, index) => {
          const parts = place.formattedAddress?.split(",").map((part) => part.trim()) ?? [];
          return {
            id: `google_${place.id ?? index}`,
            name: place.displayName?.text ?? parts[0] ?? input.query,
            admin1: parts.length > 2 ? parts[parts.length - 2] : undefined,
            country: parts.at(-1),
            lat: place.location?.latitude ?? 0,
            lon: place.location?.longitude ?? 0,
            source: "Google" as const,
            confidence: Math.max(0.5, 0.98 - index * 0.1),
          };
        }) ?? [];

    await this.cache.set(cacheKey, results, 7 * 24 * 60 * 60);
    return results;
  }
}
