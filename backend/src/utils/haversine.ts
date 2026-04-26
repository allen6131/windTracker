import type { Coordinates } from "../domain/coordinates";

const EARTH_RADIUS_KM = 6371.0088;

export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLon = toRadians(b.lon - a.lon);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function findNearestByCoordinates<T extends { lat: number; lon: number }>(
  origin: Coordinates,
  candidates: T[]
): (T & { distanceKm: number }) | null {
  return candidates.reduce<(T & { distanceKm: number }) | null>((nearest, candidate) => {
    const distanceKm = haversineDistanceKm(origin, candidate);
    if (!nearest || distanceKm < nearest.distanceKm) {
      return { ...candidate, distanceKm };
    }
    return nearest;
  }, null);
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
