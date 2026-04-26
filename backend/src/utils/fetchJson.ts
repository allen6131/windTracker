import { ProviderError } from "../domain/errors.js";
import { config } from "../config.js";

export interface FetchJsonOptions {
  timeoutMs?: number;
  headers?: Record<string, string>;
  method?: string;
  body?: string;
}

export async function fetchJson<T>(url: URL | string, providerOrOptions?: string | FetchJsonOptions, timeoutMs = config.providerTimeoutMs): Promise<T> {
  const provider = typeof providerOrOptions === "string" ? providerOrOptions : "Provider";
  const options = typeof providerOrOptions === "object" ? providerOrOptions : undefined;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? timeoutMs);
  try {
    const response = await fetch(url.toString(), {
      method: options?.method ?? "GET",
      signal: controller.signal,
      headers: { "User-Agent": "wind-ai-forecast/0.1.0", ...options?.headers },
      body: options?.body,
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
