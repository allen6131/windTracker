import type { SourceAttribution } from "./sources.js";

export type TideType = "high" | "low" | "rising" | "falling";

export interface NormalizedTidePoint {
  time: string;
  heightM?: number;
  type?: TideType;
}

export interface NormalizedTideForecast {
  points: NormalizedTidePoint[];
  stationName?: string;
  stationId?: string;
  distanceKm?: number;
  source: SourceAttribution;
  warnings?: string[];
}
