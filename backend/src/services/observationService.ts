import type { Coordinates } from "../domain/coordinates.js";
import type { LocationCandidate } from "../domain/location.js";
import type { NormalizedObservation } from "../domain/observations.js";
import type { ObservationProvider } from "../providers/types/observationProvider.js";
import { LocationService } from "./locationService.js";

export class ObservationService {
  constructor(private readonly providers: ObservationProvider[], private readonly locationService?: LocationService) {}

  async getNearestObservations(input: {
    coordinates: Coordinates;
    location?: LocationCandidate;
  }): Promise<{ observations: NormalizedObservation[]; warnings: string[] }> {
    const observations: NormalizedObservation[] = [];
    const warnings: string[] = [];
    for (const provider of this.providers) {
      const noaaOnly = provider.constructor.name.toLowerCase().includes("noaa");
      if (noaaOnly && this.locationService && !this.locationService.isLikelyUnitedStates(input.location)) continue;
      try {
        observations.push(...(await provider.getNearestObservations(input)));
      } catch {
        warnings.push("Observation provider is temporarily unavailable.");
      }
    }
    return { observations, warnings };
  }
}
