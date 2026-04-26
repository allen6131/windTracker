import { describe, expect, it } from "vitest";
import { UnitConversionService } from "../services/unitConversionService.js";

describe("UnitConversionService", () => {
  const service = new UnitConversionService();

  it("converts wind speed from m/s", () => {
    expect(service.windSpeed(10, "knots")).toBeCloseTo(19.438, 2);
    expect(service.windSpeed(10, "imperial")).toBeCloseTo(22.369, 2);
    expect(service.windSpeed(10, "metric")).toBeCloseTo(36, 2);
  });

  it("converts temperature and distance", () => {
    expect(service.temperature(20, "imperial")).toBeCloseTo(68);
    expect(service.temperature(20, "metric")).toBeCloseTo(20);
    expect(service.distance(10, "imperial")).toBeCloseTo(6.2137, 3);
  });

  it("converts wave heights", () => {
    expect(service.waveHeight(2, "imperial")).toBeCloseTo(6.561, 2);
    expect(service.waveHeight(2, "metric")).toBe(2);
  });
});
