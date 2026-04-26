import { describe, expect, it } from "vitest";
import { findNearestByCoordinates, haversineDistanceKm, roundCoordinateForCache } from "../utils/haversine.js";

describe("haversine utilities", () => {
  it("computes nearest station by distance", () => {
    const origin = { lat: 26.1118, lon: -97.1681 };
    const nearest = findNearestByCoordinates(origin, [
      { id: "far", lat: 25.7617, lon: -80.1918 },
      { id: "near", lat: 26.0731, lon: -97.1675 },
    ]);
    expect(nearest?.id).toBe("near");
    expect(nearest?.distanceKm).toBeLessThan(10);
    expect(haversineDistanceKm(origin, origin)).toBe(0);
  });

  it("rounds forecast cache coordinates to 0.02 degrees", () => {
    expect(roundCoordinateForCache(26.1118)).toBe(26.12);
  });
});
