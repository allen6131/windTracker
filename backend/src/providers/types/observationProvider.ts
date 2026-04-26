import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedObservation } from "../../domain/observations.js";

export interface ObservationProvider {
  getNearestObservations(input: { coordinates: Coordinates }): Promise<NormalizedObservation[]>;
}
