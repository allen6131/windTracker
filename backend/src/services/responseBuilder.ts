import type { ActivityRankingResult } from "./activityRankingService.js";
import type { ForecastCard } from "../domain/cards.js";
import type { ChatTimeSeriesPoint } from "../domain/chat.js";
import type { NormalizedWeatherForecast } from "../domain/forecast.js";
import type { LocationCandidate } from "../domain/location.js";
import type { NormalizedMarineForecast } from "../domain/marine.js";
import type { NormalizedAlert, NormalizedObservation } from "../domain/observations.js";
import type { SourceAttribution } from "../domain/sources.js";
import type { NormalizedTideForecast } from "../domain/tides.js";
import type { UnitSystem } from "../domain/units.js";
import { degreesToCompass } from "../utils/compass.js";
import { summarizeDateRange } from "../utils/dates.js";
import { UnitConversionService } from "./unitConversionService.js";

export interface ForecastResponseParts {
  location?: LocationCandidate;
  weather?: NormalizedWeatherForecast | null;
  marine?: NormalizedMarineForecast | null;
  tides?: NormalizedTideForecast | null;
  observations?: NormalizedObservation[];
  alerts?: NormalizedAlert[];
  ranking?: ActivityRankingResult;
  units: UnitSystem;
  warnings?: string[];
}

export class ResponseBuilder {
  constructor(private readonly unitsService = new UnitConversionService()) {}

  buildCards(input: ForecastResponseParts): ForecastCard[] {
    const cards: ForecastCard[] = [];
    const subtitle = input.location?.name;
    const current = input.weather?.current ?? input.weather?.hourly[0];
    if (current) {
      cards.push(compactCard({
        type: "current_conditions",
        title: "Current conditions",
        subtitle,
        items: [
          current.windSpeedMs !== undefined
            ? {
                label: "Wind",
                value: `${this.unitsService.formatWind(current.windSpeedMs, input.units)} ${degreesToCompass(current.windDirectionDegrees)}`,
                severity: current.windGustMs && current.windSpeedMs && current.windGustMs - current.windSpeedMs > 5 ? "watch" : "normal",
              }
            : undefined,
          current.windGustMs !== undefined ? { label: "Gusts", value: this.unitsService.formatWind(current.windGustMs, input.units) } : undefined,
          current.temperatureC !== undefined
            ? { label: "Air temperature", value: this.unitsService.formatTemperature(current.temperatureC, input.units) }
            : undefined,
          current.precipitationProbability !== undefined
            ? { label: "Precip chance", value: `${Math.round(current.precipitationProbability)}%` }
            : undefined,
        ].filter(Boolean) as ForecastCard["items"],
      }));
    }

    if (input.weather?.hourly.length) {
      const winds = input.weather.hourly.map((p) => p.windSpeedMs).filter((v): v is number => v !== undefined);
      const gusts = input.weather.hourly.map((p) => p.windGustMs).filter((v): v is number => v !== undefined);
      cards.push(compactCard({
        type: "forecast_summary",
        title: "Wind forecast",
        subtitle: `${summarizeDateRange(input.weather.hourly[0]?.time, input.weather.hourly.at(-1)?.time)} · ${this.unitsService.windSpeedUnit(input.units)}`,
        items: [
          winds.length ? { label: "Typical wind", value: this.unitsService.formatWind(average(winds), input.units) } : undefined,
          winds.length ? { label: "Peak wind", value: this.unitsService.formatWind(Math.max(...winds), input.units) } : undefined,
          gusts.length ? { label: "Peak gust", value: this.unitsService.formatWind(Math.max(...gusts), input.units), severity: "watch" } : undefined,
        ].filter(Boolean) as ForecastCard["items"],
      }));
    }

    if (input.marine?.hourly.length) {
      const waves = input.marine.hourly.map((p) => p.waveHeightM).filter((v): v is number => v !== undefined);
      const swell = input.marine.hourly.map((p) => p.swellWaveHeightM).filter((v): v is number => v !== undefined);
      const periods = input.marine.hourly.map((p) => p.wavePeriodSeconds ?? p.swellWavePeriodSeconds).filter((v): v is number => v !== undefined);
      cards.push(compactCard({
        type: "marine",
        title: "Marine and waves",
        subtitle,
        items: [
          waves.length ? { label: "Average waves", value: this.unitsService.formatWaveHeight(average(waves), input.units) } : undefined,
          swell.length ? { label: "Average swell", value: this.unitsService.formatWaveHeight(average(swell), input.units) } : undefined,
          periods.length ? { label: "Period", value: `${Math.round(average(periods))} s` } : undefined,
        ].filter(Boolean) as ForecastCard["items"],
      }));
    }

    if (input.ranking?.bestWindows.length) {
      cards.push(compactCard({
        type: "best_windows",
        title: "Best windows",
        subtitle,
        items: input.ranking.bestWindows.slice(0, 3).map((window) => ({
          label: window.label,
          value: [...window.reasons, ...window.cautions].slice(0, 3).join(" · "),
          severity: window.cautions.length ? "watch" : "normal",
        })),
      }));
    }

    if (input.tides?.points.length) {
      cards.push(compactCard({
        type: "tides",
        title: "Tides",
        subtitle: input.tides.stationName,
        items: input.tides.points.slice(0, 4).map((point) => ({
          label: point.type ? `${point.type} tide` : "Tide",
          value: `${new Date(point.time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric" })}${
            point.heightM !== undefined ? ` · ${this.unitsService.formatWaveHeight(point.heightM, input.units)}` : ""
          }`,
        })),
      }));
    }

    if (input.observations?.length) {
      cards.push(compactCard({
        type: "forecast_summary",
        title: "Nearby observations",
        subtitle,
        items: input.observations.slice(0, 3).map((observation) => ({
          label: observation.stationName ?? observation.stationId ?? "Station",
          value: [
            observation.windSpeedMs !== undefined ? `Wind ${this.unitsService.formatWindSpeed(observation.windSpeedMs, input.units)}` : undefined,
            observation.waveHeightM !== undefined ? `Waves ${this.unitsService.formatWaveHeight(observation.waveHeightM, input.units)}` : undefined,
            observation.distanceKm !== undefined ? `${this.unitsService.formatDistance(observation.distanceKm, input.units)} away` : undefined,
          ]
            .filter(Boolean)
            .join(" · "),
        })),
      }));
    }

    if (input.alerts?.length) {
      cards.push(compactCard({
        type: "alerts",
        title: "Alerts",
        subtitle,
        items: input.alerts.slice(0, 5).map((alert) => ({
          label: alert.title,
          value: alert.description ?? alert.title,
          severity: alert.severity ?? "watch",
        })),
      }));
    }

    if (input.warnings?.length) {
      cards.push({
        type: "alerts",
        title: "Forecast notes",
        items: input.warnings.slice(0, 5).map((warning) => ({ label: "Note", value: warning, severity: "watch" })),
      });
    }
    return cards;
  }

  buildTimeSeries(input: ForecastResponseParts): ChatTimeSeriesPoint[] {
    const marineByTime = new Map(input.marine?.hourly.map((point) => [point.time, point]) ?? []);
    return (input.weather?.hourly ?? []).slice(0, 72).map((point) => {
      const marine = marineByTime.get(point.time);
      return compactTimeSeriesPoint({
        time: point.time,
        windSpeed: point.windSpeedMs === undefined ? undefined : this.unitsService.windSpeed(point.windSpeedMs, input.units),
        windSpeedUnit: this.unitsService.windSpeedUnit(input.units),
        windDirectionDegrees: point.windDirectionDegrees,
        windDirectionCompass: degreesToCompass(point.windDirectionDegrees),
        windGust: point.windGustMs === undefined ? undefined : this.unitsService.windSpeed(point.windGustMs, input.units),
        airTemperature: point.temperatureC === undefined ? undefined : this.unitsService.temperature(point.temperatureC, input.units),
        precipitationProbability: point.precipitationProbability,
        waveHeight: marine?.waveHeightM === undefined ? undefined : this.unitsService.waveHeight(marine.waveHeightM, input.units),
        swellHeight: marine?.swellWaveHeightM === undefined ? undefined : this.unitsService.waveHeight(marine.swellWaveHeightM, input.units),
        wavePeriod: marine?.wavePeriodSeconds ?? marine?.swellWavePeriodSeconds,
      });
    });
  }

  collectSources(input: ForecastResponseParts): SourceAttribution[] {
    const sources = [
      ...(input.weather?.sources ?? []),
      ...(input.marine?.sources ?? []),
      ...(input.tides ? [input.tides.source] : []),
      ...(input.observations?.map((observation) => observation.source) ?? []),
      ...(input.alerts?.map((alert) => alert.source) ?? []),
    ];
    const seen = new Set<string>();
    return sources.filter((source) => {
      const key = `${source.provider}:${source.dataset}:${source.stationId ?? ""}:${source.fetchedAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function compactCard(card: ForecastCard): ForecastCard {
  return Object.fromEntries(Object.entries(card).filter(([, value]) => value !== undefined)) as ForecastCard;
}

function compactTimeSeriesPoint(point: ChatTimeSeriesPoint): ChatTimeSeriesPoint {
  return Object.fromEntries(Object.entries(point).filter(([, value]) => value !== undefined)) as ChatTimeSeriesPoint;
}
