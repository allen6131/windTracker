import type { Coordinates } from "../../domain/coordinates.js";
import type { NormalizedAlert, NormalizedObservation } from "../../domain/observations.js";
import { fetchJson } from "../../utils/fetchJson.js";
import type { ObservationProvider } from "../types/observationProvider.js";

export class NwsProvider implements ObservationProvider {
  async getNearestObservations(): Promise<NormalizedObservation[]> {
    return [];
  }

  async getAlerts(input: { coordinates: Coordinates }): Promise<NormalizedAlert[]> {
    try {
      const url = new URL("https://api.weather.gov/alerts/active");
      url.searchParams.set("point", `${input.coordinates.lat},${input.coordinates.lon}`);
      const json = await fetchJson<{ features?: Array<{ id?: string; properties?: { headline?: string; event?: string; description?: string; severity?: string; effective?: string; expires?: string } }> }>(url, {
        timeoutMs: 5000,
        headers: { "User-Agent": "WindAI/0.1 support@example.com" },
      });
      const source = { provider: "NWS" as const, dataset: "Alerts API", fetchedAt: new Date().toISOString(), url: url.toString() };
      return (json.features ?? []).map((feature, index) => ({
        id: feature.id ?? `nws_${index}`,
        title: feature.properties?.headline ?? feature.properties?.event ?? "Weather alert",
        description: feature.properties?.description,
        severity: mapSeverity(feature.properties?.severity),
        effective: feature.properties?.effective,
        expires: feature.properties?.expires,
        source,
      }));
    } catch {
      return [];
    }
  }
}

function mapSeverity(severity?: string): "normal" | "watch" | "warning" {
  if (severity === "Severe" || severity === "Extreme") return "warning";
  if (severity === "Moderate") return "watch";
  return "normal";
}
