import type { Coordinates } from "../domain/coordinates.js";
import type { LocationCandidate } from "../domain/location.js";
import type { NormalizedTideForecast } from "../domain/tides.js";
import type { TideProvider } from "../providers/types/tideProvider.js";
import { LocationService } from "./locationService.js";

export class TideService {
  constructor(
    private readonly tideProviders: TideProvider[],
    private readonly locationService: LocationService,
  ) {}

  async getTides(input: {
    coordinates: Coordinates;
    location?: LocationCandidate;
    startTime?: string;
    endTime?: string;
  }): Promise<{ tides: NormalizedTideForecast | null; warnings: string[] }> {
    const warnings: string[] = [];
    for (const provider of this.tideProviders) {
      const isNoaaOnlyProvider = provider.constructor.name.toLowerCase().includes("noaa");
      if (isNoaaOnlyProvider && !this.locationService.isLikelyUnitedStates(input.location)) {
        continue;
      }
      try {
        const tides = await provider.getTides(input);
        if (tides) {
          warnings.push(...(tides.warnings ?? []));
          return { tides, warnings };
        }
      } catch {
        warnings.push("Tide provider is temporarily unavailable.");
      }
    }
    warnings.push("Tide data unavailable from configured providers for this location.");
    return { tides: null, warnings };
  }
}
