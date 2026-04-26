import { describe, expect, it } from "vitest";
import { LocationService } from "../services/locationService.js";
import type { LocationProvider } from "../providers/types/locationProvider.js";

describe("LocationService", () => {
  it("returns clarification choices for ambiguous Portland", async () => {
    const provider: LocationProvider = {
      async search() {
        return [
          { id: "1", name: "Portland", admin1: "Oregon", country: "United States", lat: 45.5, lon: -122.6, source: "Open-Meteo", confidence: 0.9 },
          { id: "2", name: "Portland", admin1: "Maine", country: "United States", lat: 43.6, lon: -70.2, source: "Open-Meteo", confidence: 0.88 },
        ];
      },
    };
    const result = await new LocationService([provider]).resolve({ query: "Portland" });
    expect(result.status).toBe("ambiguous");
    expect(result.choices).toHaveLength(2);
  });
});
