import type { Cache } from "../../cache/cache.js";
import type { Coordinates } from "../../domain/coordinates.js";
import { haversineKm } from "../../utils/haversine.js";

export interface NoaaStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const FALLBACK_TIDE_STATIONS: NoaaStation[] = [
  { id: "8779748", name: "South Padre Island CG Station, TX", lat: 26.0731, lon: -97.1675 },
  { id: "8723214", name: "Virginia Key, Biscayne Bay, FL", lat: 25.7314, lon: -80.1618 },
  { id: "9410660", name: "Los Angeles, CA", lat: 33.72, lon: -118.272 },
  { id: "9432780", name: "Charleston, OR", lat: 43.345, lon: -124.322 },
  { id: "9410230", name: "La Jolla, CA", lat: 32.8669, lon: -117.2571 },
];

export class NoaaStationService {
  constructor(private readonly cache: Cache) {}

  async getTideStations(): Promise<NoaaStation[]> {
    const cached = await this.cache.get<NoaaStation[]>("noaa:coops:stations:fallback");
    if (cached) return cached;
    await this.cache.set("noaa:coops:stations:fallback", FALLBACK_TIDE_STATIONS, 7 * 24 * 60 * 60);
    return FALLBACK_TIDE_STATIONS;
  }

  async nearestStation(coordinates: Coordinates, maxDistanceKm: number): Promise<(NoaaStation & { distanceKm: number }) | null> {
    const stations = await this.getTideStations();
    const sorted = stations
      .map((station) => ({ ...station, distanceKm: haversineKm(coordinates, station) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    const nearest = sorted[0];
    return nearest && nearest.distanceKm <= maxDistanceKm ? nearest : null;
  }
}
