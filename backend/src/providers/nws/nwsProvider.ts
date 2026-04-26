import type { NormalizedObservation } from "../../domain/observations.js";
import type { SourceAttribution } from "../../domain/sources.js";
import { fetchJson } from "../../utils/fetchJson.js";
import type { ObservationProvider } from "../types/observationProvider.js";

export class NwsProvider implements ObservationProvider {
  async getNearestObservations(): Promise<NormalizedObservation[]> {
    return [];
  }

  async getAlerts(lat: number, lon: number): Promise<{ alerts: string[]; sources: SourceAttribution[] }> {
    try {
      const url = new URL("https://api.weather.gov/alerts/active");
      url.searchParams.set("point", `${lat},${lon}`);
      const json = await fetchJson<{ features?: Array<{ properties?: { headline?: string } }> }>(url, {
        timeoutMs: 5000,
        headers: { "User-Agent": "WindAI/0.1 support@example.com" },
      });
      return {
        alerts: json.features?.map((feature) => feature.properties?.headline).filter(Boolean) as string[],
        sources: [{ provider: "NWS", dataset: "Alerts API", fetchedAt: new Date().toISOString(), url: url.toString() }],
      };
    } catch {
      return { alerts: [], sources: [] };
    }
  }
}
