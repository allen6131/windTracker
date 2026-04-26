import type { Coordinates } from "./coordinates";
import type { SourceAttribution } from "./sources";

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
