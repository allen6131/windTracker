export function parseNoaaTimestamp(value: string): string {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  return new Date(normalized.endsWith("Z") ? normalized : `${normalized}Z`).toISOString();
}
