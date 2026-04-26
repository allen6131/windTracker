import type { Activity } from "../domain/activity.js";
import type { NormalizedWeatherForecast, NormalizedWeatherPoint } from "../domain/forecast.js";
import type { NormalizedMarineForecast } from "../domain/marine.js";
import type { NormalizedTideForecast } from "../domain/tides.js";

export interface RankedWindow {
  start: string;
  end: string;
  score: number;
  label: string;
  reasons: string[];
  cautions: string[];
}

export interface AvoidWindow {
  start: string;
  end: string;
  reasons: string[];
}

export interface RankingResult {
  bestWindows: RankedWindow[];
  avoidWindows: AvoidWindow[];
}

export function rankActivityWindows(input: {
  activity: Activity;
  forecast: NormalizedWeatherForecast;
  marine?: NormalizedMarineForecast | null;
  tides?: NormalizedTideForecast | null;
}): RankingResult {
  const hourly = input.forecast.hourly.slice(0, 168);
  if (hourly.length === 0) return { bestWindows: [], avoidWindows: [] };

  const marineByTime = new Map(input.marine?.hourly.map((point) => [point.time, point]) ?? []);
  const scored = hourly.map((point, index) => {
    const marine = marineByTime.get(point.time);
    const result = scorePoint(input.activity, point, marine);
    const end = hourly[index + 1]?.time ?? new Date(new Date(point.time).getTime() + 60 * 60 * 1000).toISOString();
    return { start: point.time, end, ...result };
  });

  return {
    bestWindows: scored
      .filter((window) => window.score >= 45)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((window) => ({
        ...window,
        score: Math.round(window.score),
        label: labelForScore(window.score),
      })),
    avoidWindows: scored
      .filter((window) => window.cautions.some((caution) => caution.includes("Avoid")) || window.score < 25)
      .slice(0, 5)
      .map((window) => ({ start: window.start, end: window.end, reasons: window.cautions.length ? window.cautions : ["Low activity score"] })),
  };
}

function scorePoint(activity: Activity, point: NormalizedWeatherPoint, marine?: { waveHeightM?: number; swellWaveHeightM?: number; swellWavePeriodSeconds?: number }) {
  const wind = point.windSpeedMs ?? 0;
  const gust = point.windGustMs ?? wind;
  const gustSpread = Math.max(0, gust - wind);
  const precip = point.precipitationProbability ?? 0;
  const visibilityKm = point.visibilityMeters ? point.visibilityMeters / 1000 : undefined;
  const wave = marine?.waveHeightM ?? 0;
  const swell = marine?.swellWaveHeightM ?? wave;
  const swellPeriod = marine?.swellWavePeriodSeconds ?? 0;
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 50;

  const addWindReason = () => {
    if (wind > 0) reasons.push(`Wind around ${wind.toFixed(1)} m/s`);
    if (gustSpread >= 4) cautions.push("Gust spread is elevated; conditions may be punchy");
    if (precip >= 50) cautions.push("High precipitation risk");
    if (visibilityKm !== undefined && visibilityKm < 5) cautions.push("Reduced visibility");
  };

  switch (activity) {
    case "kitesurfing":
    case "windsurfing":
      score = bandScore(wind, 7, 13, 4, 18) - gustSpread * 4 - precip * 0.15;
      if (wind >= 7 && wind <= 13) reasons.push("Steady wind is in a favorable wind-sport range");
      if (wind > 16 || gust > 22) cautions.push("Avoid if you are not advanced: strong wind or gusts");
      addWindReason();
      break;
    case "sailing":
      score = bandScore(wind, 4, 10, 1, 16) - wave * 8 - precip * 0.15;
      if (wind >= 4 && wind <= 10) reasons.push("Moderate sailing breeze");
      if (gust > 18 || wave > 2) cautions.push("Avoid smaller craft: gusts or seas may be uncomfortable");
      addWindReason();
      break;
    case "surfing":
      score = bandScore(swell, 0.8, 2.5, 0.2, 4) + Math.min(20, swellPeriod * 1.5) - wind * 2;
      if (swell >= 0.8) reasons.push("Surfable swell height indicated");
      if (swellPeriod >= 8) reasons.push("Swell period is supportive");
      cautions.push("Surf score is approximate because coastline orientation is not modeled");
      if (wave > 4) cautions.push("Avoid: large seas for many surfers");
      break;
    case "fishing":
    case "boating":
      score = bandScore(wind, 0, 6, 0, 12) - wave * 14 - precip * 0.2;
      if (wind <= 6) reasons.push("Lighter winds favor comfort on the water");
      if (wave > 1.5 || gust > 14) cautions.push("Avoid small craft: choppy or gusty conditions");
      addWindReason();
      break;
    case "paragliding":
      score = bandScore(wind, 2, 6, 0, 9) - gustSpread * 8 - precip * 0.4;
      if (wind >= 2 && wind <= 6) reasons.push("Surface wind appears moderate");
      cautions.push("Not a flight-safety product; use official aviation and local site guidance");
      if (gustSpread > 3 || precip > 20) cautions.push("Avoid: gusts or precipitation risk are elevated");
      addWindReason();
      break;
    case "hiking":
    case "general":
      score = 80 - precip * 0.4 - Math.max(0, wind - 8) * 3;
      if ((point.temperatureC ?? 15) >= 8 && (point.temperatureC ?? 15) <= 28) reasons.push("Comfortable temperature range");
      if (precip < 30) reasons.push("Lower precipitation risk");
      if (precip > 60) cautions.push("Avoid: high precipitation probability");
      break;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: "",
    reasons: reasons.length ? reasons : ["Best available conditions in the requested window"],
    cautions,
  };
}

function bandScore(value: number, idealMin: number, idealMax: number, hardMin: number, hardMax: number): number {
  if (value >= idealMin && value <= idealMax) return 90;
  if (value < hardMin || value > hardMax) return 15;
  if (value < idealMin) return 45 + ((value - hardMin) / Math.max(0.1, idealMin - hardMin)) * 40;
  return 45 + ((hardMax - value) / Math.max(0.1, hardMax - idealMax)) * 40;
}

function labelForScore(score: number): string {
  if (score >= 80) return "Best";
  if (score >= 65) return "Good";
  if (score >= 45) return "Possible";
  return "Marginal";
}
