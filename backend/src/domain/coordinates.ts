export interface Coordinates {
  lat: number;
  lon: number;
}

export function isValidCoordinates(value: Coordinates): boolean {
  return (
    Number.isFinite(value.lat) &&
    Number.isFinite(value.lon) &&
    value.lat >= -90 &&
    value.lat <= 90 &&
    value.lon >= -180 &&
    value.lon <= 180
  );
}
