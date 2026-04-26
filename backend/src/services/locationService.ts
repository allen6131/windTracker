import type { Coordinates } from "../domain/coordinates.js";
import { LocationNotFoundError, ValidationError } from "../domain/errors.js";
import type { LocationCandidate } from "../domain/location.js";
import type { LocationProvider } from "../providers/types/locationProvider.js";

export interface LocationResolution {
  status: "resolved" | "ambiguous" | "not_found";
  location?: LocationCandidate;
  choices: LocationCandidate[];
  question?: string;
}

export function locationLabel(location: Pick<LocationCandidate, "name" | "admin1" | "country">): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

export class LocationService {
  constructor(private readonly providers: LocationProvider[]) {}

  validateCoordinates(coordinates: Coordinates): Coordinates {
    if (coordinates.lat < -90 || coordinates.lat > 90 || coordinates.lon < -180 || coordinates.lon > 180) {
      throw new ValidationError("Coordinates are outside valid latitude/longitude bounds.");
    }
    return coordinates;
  }

  manualLocation(coordinates: Coordinates): LocationCandidate {
    const valid = this.validateCoordinates(coordinates);
    return {
      id: `manual_${valid.lat.toFixed(4)}_${valid.lon.toFixed(4)}`,
      name: `${valid.lat.toFixed(4)}, ${valid.lon.toFixed(4)}`,
      lat: valid.lat,
      lon: valid.lon,
      source: "Manual",
      confidence: 1,
    };
  }

  async search(query: string, userLocation?: Coordinates, limit = 5): Promise<LocationCandidate[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    for (const provider of this.providers) {
      try {
        const results = await provider.search(compact({ query: cleanQuery, userLocation, limit }));
        if (results.length > 0) {
          return this.sortResults(results, userLocation).slice(0, limit);
        }
      } catch {
        continue;
      }
    }
    return [];
  }

  async resolve(input: { query?: string | null; coordinates?: Coordinates | null; userLocation?: Coordinates }): Promise<LocationResolution> {
    if (input.coordinates) {
      return { status: "resolved", location: this.manualLocation(input.coordinates), choices: [] };
    }
    if (!input.query?.trim()) {
      return {
        status: "not_found",
        choices: [],
        question: "What location should I check?",
      };
    }
    const choices = await this.search(input.query, input.userLocation, 5);
    if (choices.length === 0) {
      return {
        status: "not_found",
        choices: [],
        question: "I could not find that location. Try a city, beach, marina, or lat/lon.",
      };
    }
    if (this.shouldAskForClarification(input.query, choices)) {
      return {
        status: "ambiguous",
        choices,
        question: `Which ${input.query.trim()} did you mean?`,
      };
    }
    return { status: "resolved", location: choices[0]!, choices: [] };
  }

  async resolveOrThrow(query: string, userLocation?: Coordinates): Promise<LocationCandidate> {
    const resolution = await this.resolve(compact({ query, userLocation }));
    if (resolution.status === "resolved" && resolution.location) return resolution.location;
    throw new ValidationError("Location not found");
  }

  isLikelyUnitedStates(location?: { country?: string; admin1?: string }): boolean {
    if (!location) return false;
    return location.country === "United States" || location.country === "US" || Boolean(location.admin1 && !location.country);
  }

  createManualLocation(coordinates: Coordinates, name?: string): LocationCandidate {
    const manual = this.manualLocation(coordinates);
    return { ...manual, name: name ?? manual.name };
  }

  private sortResults(results: LocationCandidate[], _userLocation?: Coordinates): LocationCandidate[] {
    return [...results].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
  }

  private shouldAskForClarification(query: string, choices: LocationCandidate[]): boolean {
    if (choices.length < 2) return false;
    const normalized = query.trim().toLowerCase();
    if (["portland", "springfield", "miami", "sydney", "san jose"].includes(normalized)) return true;
    const [first, second] = choices as [LocationCandidate, LocationCandidate, ...LocationCandidate[]];
    const confidenceGap = (first.confidence ?? 0.5) - (second.confidence ?? 0.5);
    const namesDiffer =
      first.country !== second.country ||
      first.admin1 !== second.admin1 ||
      first.name.toLowerCase() !== second.name.toLowerCase();
    return namesDiffer && confidenceGap < 0.18;
  }
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)) as T;
}
