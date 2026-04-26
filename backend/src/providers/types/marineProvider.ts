import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedMarineForecast } from "../../domain/marine.js";

export interface MarineProvider {
  getMarineForecast(input: {
    coordinates: Coordinates;
    startTime?: string;
    endTime?: string;
  }): Promise<NormalizedMarineForecast | null>;
}
