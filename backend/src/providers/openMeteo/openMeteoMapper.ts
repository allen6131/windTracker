import type { NormalizedWeatherForecast, NormalizedWeatherPoint } from "../../domain/forecast.js";
import type { NormalizedMarineForecast, NormalizedMarinePoint } from "../../domain/marine.js";
import type { SourceAttribution } from "../../domain/sources.js";

const valueAt = <T>(values: T[] | undefined, index: number): T | undefined => values?.[index];

export function mapOpenMeteoForecast(raw: any, source: SourceAttribution): NormalizedWeatherForecast {
  const hourly = raw?.hourly ?? {};
  const times: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  const points: NormalizedWeatherPoint[] = times.map((time, index) => ({
    time,
    temperatureC: valueAt(hourly.temperature_2m, index),
    apparentTemperatureC: valueAt(hourly.apparent_temperature, index),
    precipitationMm: valueAt(hourly.precipitation, index),
    precipitationProbability: valueAt(hourly.precipitation_probability, index),
    cloudCoverPercent: valueAt(hourly.cloud_cover, index),
    visibilityMeters: valueAt(hourly.visibility, index),
    pressureHpa: valueAt(hourly.pressure_msl, index),
    windSpeedMs: valueAt(hourly.wind_speed_10m, index),
    windDirectionDegrees: valueAt(hourly.wind_direction_10m, index),
    windGustMs: valueAt(hourly.wind_gusts_10m, index),
    weatherCode: valueAt(hourly.weather_code, index),
  }));

  const currentRaw = raw?.current;
  const current: NormalizedWeatherPoint | undefined = currentRaw
    ? {
        time: currentRaw.time ?? new Date().toISOString(),
        temperatureC: currentRaw.temperature_2m,
        apparentTemperatureC: currentRaw.apparent_temperature,
        precipitationMm: currentRaw.precipitation,
        cloudCoverPercent: currentRaw.cloud_cover,
        pressureHpa: currentRaw.pressure_msl,
        windSpeedMs: currentRaw.wind_speed_10m,
        windDirectionDegrees: currentRaw.wind_direction_10m,
        windGustMs: currentRaw.wind_gusts_10m,
        weatherCode: currentRaw.weather_code,
      }
    : undefined;

  const dailyRaw = raw?.daily;
  const daily = Array.isArray(dailyRaw?.time)
    ? dailyRaw.time.map((time: string, index: number) => ({
        time,
        sunrise: valueAt(dailyRaw.sunrise, index),
        sunset: valueAt(dailyRaw.sunset, index),
        uvIndexMax: valueAt(dailyRaw.uv_index_max, index),
      }))
    : undefined;

  return {
    current,
    hourly: points,
    daily,
    timezone: raw?.timezone,
    sources: [source],
    warnings: [],
  };
}

export function mapOpenMeteoMarine(raw: any, source: SourceAttribution): NormalizedMarineForecast | null {
  const hourly = raw?.hourly ?? {};
  const times: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  if (times.length === 0) return null;

  const points: NormalizedMarinePoint[] = times.map((time, index) => ({
    time,
    waveHeightM: valueAt(hourly.wave_height, index),
    waveDirectionDegrees: valueAt(hourly.wave_direction, index),
    wavePeriodSeconds: valueAt(hourly.wave_period, index),
    wavePeakPeriodSeconds: valueAt(hourly.wave_peak_period, index),
    windWaveHeightM: valueAt(hourly.wind_wave_height, index),
    windWaveDirectionDegrees: valueAt(hourly.wind_wave_direction, index),
    windWavePeriodSeconds: valueAt(hourly.wind_wave_period, index),
    swellWaveHeightM: valueAt(hourly.swell_wave_height, index),
    swellWaveDirectionDegrees: valueAt(hourly.swell_wave_direction, index),
    swellWavePeriodSeconds: valueAt(hourly.swell_wave_period, index),
  }));

  return {
    hourly: points,
    timezone: raw?.timezone,
    sources: [source],
    warnings: [],
  };
}
