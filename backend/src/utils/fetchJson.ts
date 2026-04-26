import { ProviderError } from "../domain/errors.js";
import { config } from "../config.js";

export async function fetchJson<T>(url: URL, provider: string, timeoutMs = config.providerTimeoutMs): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "wind-ai-forecast/0.1.0" },
    });
    if (!response.ok) {
      throw new ProviderError(provider, `HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    throw new ProviderError(provider, error instanceof Error ? error.message : "fetch failed");
  } finally {
    clearTimeout(timeout);
  }
}
