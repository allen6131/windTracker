import type { Coordinates } from "./coordinates.js";

export type LocationSource = "Google" | "Open-Meteo" | "Manual";

export interface LocationCandidate extends Coordinates {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  timezone?: string;
  source: LocationSource;
  confidence?: number;
}

export interface ResolvedLocation extends Omit<LocationCandidate, "source" | "confidence"> {
  source?: LocationSource;
}
