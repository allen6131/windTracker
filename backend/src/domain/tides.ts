import type { SourceAttribution } from "./sources";

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
  source: SourceAttribution;
  warnings?: string[];
}
