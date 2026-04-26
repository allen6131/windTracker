import type { Cache } from "../../cache/cache.js";
import type { NormalizedTideForecast, NormalizedTidePoint } from "../../domain/tides.js";
import type { TideProvider, TideProviderInput } from "../types/tideProvider.js";
import { NoaaStationService } from "./noaaStationService.js";
import { fetchJson } from "../../utils/fetchJson.js";

export class NoaaCoopsProvider implements TideProvider {
  private readonly stationService: NoaaStationService;

  constructor(private readonly cache: Cache) {
    this.stationService = new NoaaStationService(cache);
  }

  async getTides(input: TideProviderInput): Promise<NormalizedTideForecast | null> {
    const station = await this.stationService.findNearestCoopsStation(input.coordinates, 100);
    if (!station) return null;
    const now = new Date();
    const begin = compactDate(input.startTime ?? now.toISOString());
    const end = compactDate(input.endTime ?? new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString());
    const cacheKey = `noaa:coops:tides:${station.id}:${begin}:${end}`;
    const cached = await this.cache.get<NormalizedTideForecast>(cacheKey);
    if (cached) return cached;

    const url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
    url.searchParams.set("product", "predictions");
    url.searchParams.set("application", "wind-ai-forecast");
    url.searchParams.set("begin_date", begin);
    url.searchParams.set("end_date", end);
    url.searchParams.set("datum", "MLLW");
    url.searchParams.set("station", station.id);
    url.searchParams.set("time_zone", "gmt");
    url.searchParams.set("units", "metric");
    url.searchParams.set("interval", "hilo");
    url.searchParams.set("format", "json");

    try {
      const json = await fetchJson<{ predictions?: Array<{ t: string; v: string; type?: string }> }>(url, {
        timeoutMs: 7000,
      });
      const points: NormalizedTidePoint[] =
        json.predictions?.map((point) => ({
          time: `${point.t.replace(" ", "T")}:00Z`,
          heightM: Number.isFinite(Number(point.v)) ? Number(point.v) : undefined,
          type: point.type === "H" ? "high" : point.type === "L" ? "low" : undefined,
        })) ?? [];
      const forecast: NormalizedTideForecast = {
        points,
        stationName: station.name,
        stationId: station.id,
        distanceKm: station.distanceKm,
        sources: [
          {
            provider: "NOAA CO-OPS",
            dataset: "Tide Predictions",
            url: "https://api.tidesandcurrents.noaa.gov",
            fetchedAt: new Date().toISOString(),
            stationName: station.name,
            stationId: station.id,
            distanceKm: station.distanceKm,
          },
        ],
        warnings: [],
      };
      await this.cache.set(cacheKey, forecast, 6 * 60 * 60);
      return forecast;
    } catch {
      return {
        points: [],
        stationName: station.name,
        stationId: station.id,
        distanceKm: station.distanceKm,
        sources: [],
        warnings: ["NOAA tide predictions are unavailable right now."],
      };
    }
  }
}

function compactDate(iso: string): string {
  return iso.slice(0, 10).replaceAll("-", "");
}
