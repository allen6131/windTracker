export function nowIso(): string {
  return new Date().toISOString();
}

export function toIsoOrUndefined(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function defaultForecastWindow(): { startTime: string; endTime: string } {
  const start = new Date();
  const end = new Date(start.getTime() + 36 * 60 * 60 * 1000);
  return { startTime: start.toISOString(), endTime: end.toISOString() };
}

export function filterByWindow<T extends { time: string }>(points: T[], startTime?: string, endTime?: string): T[] {
  const start = startTime ? new Date(startTime).getTime() : Number.NEGATIVE_INFINITY;
  const end = endTime ? new Date(endTime).getTime() : Number.POSITIVE_INFINITY;
  return points.filter((point) => {
    const time = new Date(point.time).getTime();
    return Number.isFinite(time) && time >= start && time <= end;
  });
}

export function summarizeDateRange(start?: string | null, end?: string | null): string | undefined {
  if (!start && !end) return undefined;
  const format = (value: string) => new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric" });
  if (start && end) return `${format(start)} – ${format(end)}`;
  return start ? `Starting ${format(start)}` : `Until ${format(end!)}`;
}
