import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedTideForecast } from "../../domain/tides.js";

export interface TideProvider {
  getTides(input: {
    coordinates: Coordinates;
    startTime?: string;
    endTime?: string;
  }): Promise<NormalizedTideForecast | null>;
}
