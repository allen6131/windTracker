import type { Coordinates } from "../../domain/coordinates.js";
import type { SourceAttribution, SourceProvider } from "../../domain/sources.js";
import type { NormalizedMarineForecast } from "../../domain/marine.js";
import type { NormalizedTideForecast } from "../../domain/tides.js";

export class StormglassProvider {
  readonly providerName: SourceProvider = "Stormglass";

  constructor(private readonly apiKey?: string) {}

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async getMarineForecast(_input: {
    coordinates: Coordinates;
    startTime?: string;
    endTime?: string;
  }): Promise<NormalizedMarineForecast | null> {
    return null;
  }

  async getTides(_input: { coordinates: Coordinates; startTime?: string; endTime?: string }): Promise<NormalizedTideForecast | null> {
    return null;
  }

  statusSource(): SourceAttribution {
    return { provider: "Stormglass", dataset: "Premium adapter stub", fetchedAt: new Date().toISOString() };
  }
}
