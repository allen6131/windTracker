import type { NormalizedMarineForecast } from "../../domain/marine.js";
import type { NormalizedTideForecast } from "../../domain/tides.js";
import type { NormalizedWeatherForecast } from "../../domain/forecast.js";
import type { MarineProvider } from "../types/marineProvider.js";
import type { TideProvider } from "../types/tideProvider.js";
import type { WeatherProvider } from "../types/weatherProvider.js";

export class MeteomaticsProvider implements WeatherProvider, MarineProvider, TideProvider {
  constructor(private readonly configured: boolean) {}

  async getForecast(): Promise<NormalizedWeatherForecast> {
    return { hourly: [], sources: [], warnings: [this.message()] };
  }

  async getMarineForecast(): Promise<NormalizedMarineForecast | null> {
    return this.configured ? null : null;
  }

  async getTides(): Promise<NormalizedTideForecast | null> {
    return this.configured ? null : null;
  }

  private message(): string {
    return this.configured
      ? "Meteomatics adapter is configured but premium data retrieval is not enabled in this MVP."
      : "Meteomatics is not configured.";
  }
}
