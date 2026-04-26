import type { SourceAttribution } from "../domain/sources.js";

export function uniqueSources(sources: SourceAttribution[]): SourceAttribution[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.provider}:${source.dataset}:${source.stationId ?? ""}:${source.fetchedAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ensureSources(sources: SourceAttribution[]): SourceAttribution[] {
  if (sources.length > 0) return uniqueSources(sources);
  return [
    {
      provider: "Open-Meteo",
      dataset: "No forecast source available",
      fetchedAt: new Date().toISOString(),
    },
  ];
}
