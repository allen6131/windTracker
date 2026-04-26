import { describe, expect, it } from "vitest";
import { mapOpenMeteoForecast, mapOpenMeteoMarine } from "../providers/openMeteo/openMeteoMapper.js";

const source = { provider: "Open-Meteo" as const, dataset: "Test", fetchedAt: "2026-04-26T12:00:00.000Z" };

describe("Open-Meteo mapper", () => {
  it("maps weather responses to normalized units", () => {
    const forecast = mapOpenMeteoForecast(
      {
        timezone: "America/Chicago",
        current: { time: "2026-04-26T12:00", temperature_2m: 21, wind_speed_10m: 8 },
        hourly: {
          time: ["2026-04-26T12:00"],
          temperature_2m: [21],
          precipitation_probability: [15],
          wind_speed_10m: [8],
          wind_direction_10m: [135],
          wind_gusts_10m: [11],
        },
      },
      source,
    );
    expect(forecast.current?.windSpeedMs).toBe(8);
    expect(forecast.hourly[0]?.windDirectionDegrees).toBe(135);
    expect(forecast.sources[0]).toEqual(source);
  });

  it("maps marine responses", () => {
    const marine = mapOpenMeteoMarine(
      {
        hourly: {
          time: ["2026-04-26T12:00"],
          wave_height: [1.2],
          swell_wave_height: [0.9],
          wave_period: [7],
        },
      },
      source,
    );
    expect(marine?.hourly[0]?.waveHeightM).toBe(1.2);
    expect(marine?.hourly[0]?.swellWaveHeightM).toBe(0.9);
  });
});
