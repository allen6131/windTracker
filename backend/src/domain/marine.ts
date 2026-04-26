import type { SourceAttribution } from "./sources";

export interface NormalizedMarinePoint {
  time: string;
  waveHeightM?: number;
  waveDirectionDegrees?: number;
  wavePeriodSeconds?: number;
  wavePeakPeriodSeconds?: number;
  windWaveHeightM?: number;
  windWaveDirectionDegrees?: number;
  windWavePeriodSeconds?: number;
  swellWaveHeightM?: number;
  swellWaveDirectionDegrees?: number;
  swellWavePeriodSeconds?: number;
}

export interface NormalizedMarineForecast {
  hourly: NormalizedMarinePoint[];
  timezone?: string;
  sources: SourceAttribution[];
  warnings: string[];
}
