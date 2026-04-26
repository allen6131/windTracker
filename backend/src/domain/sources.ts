export type SourceProvider =
  | "Open-Meteo"
  | "NOAA CO-OPS"
  | "NOAA NDBC"
  | "NWS"
  | "Google"
  | "Stormglass"
  | "Meteomatics";

export interface SourceAttribution {
  provider: SourceProvider;
  dataset: string;
  url?: string;
  fetchedAt: string;
  stationName?: string;
  stationId?: string;
  distanceKm?: number;
}
