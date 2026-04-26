import type { NormalizedWeatherForecast, NormalizedWeatherPoint } from "../../domain/forecast.js";
import type { NormalizedMarineForecast, NormalizedMarinePoint } from "../../domain/marine.js";
import type { SourceAttribution } from "../../domain/sources.js";

const numberAt = (values: unknown, index: number): number | undefined => {
  const value = Array.isArray(values) ? values[index] : undefined;
  return typeof value === "number" ? value : undefined;
};

const scalarAt = (values: unknown, index: number): number | string | undefined => {
  const value = Array.isArray(values) ? values[index] : undefined;
  return typeof value === "number" || typeof value === "string" ? value : undefined;
};

function withoutUndefined<T extends Record<string, unknown>>(object: T): T {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined)) as T;
}

export function mapOpenMeteoForecast(raw: any, source: SourceAttribution): NormalizedWeatherForecast {
  const hourly = raw?.hourly ?? {};
  const times: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  const points: NormalizedWeatherPoint[] = times.map((time, index) =>
    withoutUndefined({
      time,
      temperatureC: numberAt(hourly.temperature_2m, index),
      apparentTemperatureC: numberAt(hourly.apparent_temperature, index),
      precipitationMm: numberAt(hourly.precipitation, index),
      precipitationProbability: numberAt(hourly.precipitation_probability, index),
      cloudCoverPercent: numberAt(hourly.cloud_cover, index),
      visibilityMeters: numberAt(hourly.visibility, index),
      pressureHpa: numberAt(hourly.pressure_msl, index),
      windSpeedMs: numberAt(hourly.wind_speed_10m, index),
      windDirectionDegrees: numberAt(hourly.wind_direction_10m, index),
      windGustMs: numberAt(hourly.wind_gusts_10m, index),
      weatherCode: scalarAt(hourly.weather_code, index),
    }),
  );

  const currentRaw = raw?.current;
  const current: NormalizedWeatherPoint | undefined = currentRaw
    ? withoutUndefined({
        time: currentRaw.time ?? new Date().toISOString(),
        temperatureC: typeof currentRaw.temperature_2m === "number" ? currentRaw.temperature_2m : undefined,
        apparentTemperatureC: typeof currentRaw.apparent_temperature === "number" ? currentRaw.apparent_temperature : undefined,
        precipitationMm: typeof currentRaw.precipitation === "number" ? currentRaw.precipitation : undefined,
        cloudCoverPercent: typeof currentRaw.cloud_cover === "number" ? currentRaw.cloud_cover : undefined,
        pressureHpa: typeof currentRaw.pressure_msl === "number" ? currentRaw.pressure_msl : undefined,
        windSpeedMs: typeof currentRaw.wind_speed_10m === "number" ? currentRaw.wind_speed_10m : undefined,
        windDirectionDegrees: typeof currentRaw.wind_direction_10m === "number" ? currentRaw.wind_direction_10m : undefined,
        windGustMs: typeof currentRaw.wind_gusts_10m === "number" ? currentRaw.wind_gusts_10m : undefined,
        weatherCode: currentRaw.weather_code,
      })
    : undefined;

  const dailyRaw = raw?.daily;
  const daily = Array.isArray(dailyRaw?.time)
    ? dailyRaw.time.map((time: string, index: number) => ({
        time,
        sunrise: scalarAt(dailyRaw.sunrise, index),
        sunset: scalarAt(dailyRaw.sunset, index),
        uvIndexMax: numberAt(dailyRaw.uv_index_max, index),
      }))
    : undefined;

  return withoutUndefined({
    current,
    hourly: points,
    daily,
    timezone: raw?.timezone,
    sources: [source],
    warnings: [],
  });
}

export function mapOpenMeteoMarine(raw: any, source: SourceAttribution): NormalizedMarineForecast | null {
  const hourly = raw?.hourly ?? {};
  const times: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  if (times.length === 0) return null;

  const points: NormalizedMarinePoint[] = times.map((time, index) =>
    withoutUndefined({
      time,
      waveHeightM: numberAt(hourly.wave_height, index),
      waveDirectionDegrees: numberAt(hourly.wave_direction, index),
      wavePeriodSeconds: numberAt(hourly.wave_period, index),
      wavePeakPeriodSeconds: numberAt(hourly.wave_peak_period, index),
      windWaveHeightM: numberAt(hourly.wind_wave_height, index),
      windWaveDirectionDegrees: numberAt(hourly.wind_wave_direction, index),
      windWavePeriodSeconds: numberAt(hourly.wind_wave_period, index),
      swellWaveHeightM: numberAt(hourly.swell_wave_height, index),
      swellWaveDirectionDegrees: numberAt(hourly.swell_wave_direction, index),
      swellWavePeriodSeconds: numberAt(hourly.swell_wave_period, index),
    }),
  );

  return withoutUndefined({
    hourly: points,
    timezone: raw?.timezone,
    sources: [source],
    warnings: [],
  });
}
