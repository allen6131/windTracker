import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedObservation } from "../../domain/observations.js";
import type { ObservationProvider } from "../types/observationProvider.js";

export class NoaaNdbcProvider implements ObservationProvider {
  async getNearestObservations(_input: { coordinates: Coordinates }): Promise<NormalizedObservation[]> {
    // NDBC latest-observation parsing is intentionally isolated here. The MVP
    // continues gracefully without buoys if station metadata or observations are
    // unavailable.
    return [];
  }
}
