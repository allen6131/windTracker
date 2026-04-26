const DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export function degreesToCompass(degrees?: number): string | undefined {
  if (degrees === undefined || Number.isNaN(degrees)) return undefined;
  const normalized = ((degrees % 360) + 360) % 360;
  return DIRECTIONS[Math.round(normalized / 22.5) % 16];
}
