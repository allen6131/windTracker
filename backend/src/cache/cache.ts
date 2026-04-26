export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export const cacheTtlSeconds = {
  geocoding: 7 * 24 * 60 * 60,
  weatherForecast: 15 * 60,
  marineForecast: 30 * 60,
  tideStationMetadata: 7 * 24 * 60 * 60,
  tidePredictions: 6 * 60 * 60,
  buoyObservations: 10 * 60,
  nwsAlerts: 5 * 60,
} as const;

export function roundedCoordinateKey(lat: number, lon: number): string {
  return `${Math.round(lat / 0.02) * 0.02}:${Math.round(lon / 0.02) * 0.02}`;
}
