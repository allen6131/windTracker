import type { Coordinates } from "./coordinates.js";
import type { SourceAttribution } from "./sources.js";

export interface NormalizedObservation {
  id: string;
  stationName?: string;
  stationId?: string;
  coordinates?: Coordinates;
  distanceKm?: number;
  time: string;
  windSpeedMs?: number;
  windDirectionDegrees?: number;
  windGustMs?: number;
  airTemperatureC?: number;
  waterTemperatureC?: number;
  waveHeightM?: number;
  wavePeriodSeconds?: number;
  pressureHpa?: number;
  source: SourceAttribution;
}

export interface NormalizedAlert {
  id: string;
  title: string;
  severity?: "normal" | "watch" | "warning";
  description?: string;
  effective?: string;
  expires?: string;
  source: SourceAttribution;
}
