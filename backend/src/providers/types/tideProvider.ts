import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedTideForecast } from "../../domain/tides.js";

export interface TideProvider {
  getTides(input: TideProviderInput): Promise<NormalizedTideForecast | null>;
}

export interface TideProviderInput {
  coordinates: Coordinates;
  startTime?: string;
  endTime?: string;
}
