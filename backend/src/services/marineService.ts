import { ProviderError } from "../domain/errors.js";
import type { NormalizedMarineForecast } from "../domain/marine.js";
import type { MarineProvider } from "../providers/types/marineProvider.js";

export interface MarineBundle {
  marine: NormalizedMarineForecast | null;
  warnings: string[];
}

export class MarineService {
  constructor(private readonly marineProviders: MarineProvider[]) {}

  async getMarineForecast(input: Parameters<MarineProvider["getMarineForecast"]>[0]): Promise<MarineBundle> {
    const warnings: string[] = [];
    for (const provider of this.marineProviders) {
      try {
        const marine = await provider.getMarineForecast(input);
        if (marine) {
          warnings.push(...marine.warnings);
          return { marine, warnings };
        }
      } catch (error) {
        warnings.push(error instanceof ProviderError ? error.safeMessage : "Marine forecast is temporarily unavailable.");
      }
    }
    warnings.push("Marine forecast is unavailable for this location.");
    return { marine: null, warnings };
  }
}
