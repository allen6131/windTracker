import type { Coordinates } from "../../domain/coordinates.js";
import type { LocationCandidate } from "../../domain/location.js";

export interface LocationProvider {
  search(input: { query: string; userLocation?: Coordinates; limit?: number }): Promise<LocationCandidate[]>;
}
