import type { UnitSystem } from "../domain/units.js";

export interface DisplayUnits {
  windSpeed: string;
  temperature: string;
  waveHeight: string;
  distance: string;
}

export class UnitConversionService {
  windSpeed(ms: number, units: UnitSystem): number {
    if (units === "knots") return ms * 1.94384449;
    if (units === "imperial") return ms * 2.23693629;
    return ms * 3.6;
  }

  windSpeedUnit(units: UnitSystem): string {
    if (units === "knots") return "kt";
    if (units === "imperial") return "mph";
    return "km/h";
  }

  temperature(celsius: number, units: UnitSystem): number {
    if (units === "imperial" || units === "knots") return (celsius * 9) / 5 + 32;
    return celsius;
  }

  temperatureUnit(units: UnitSystem): string {
    return units === "metric" ? "°C" : "°F";
  }

  waveHeight(meters: number, units: UnitSystem): number {
    return units === "metric" ? meters : meters * 3.280839895;
  }

  waveHeightUnit(units: UnitSystem): string {
    return units === "metric" ? "m" : "ft";
  }

  distance(km: number, units: UnitSystem): number {
    return units === "metric" ? km : km * 0.621371;
  }

  distanceUnit(units: UnitSystem): string {
    return units === "metric" ? "km" : "mi";
  }

  displayUnits(units: UnitSystem): DisplayUnits {
    return {
      windSpeed: this.windSpeedUnit(units),
      temperature: this.temperatureUnit(units),
      waveHeight: this.waveHeightUnit(units),
      distance: this.distanceUnit(units),
    };
  }

  format(value: number | undefined, suffix: string, digits = 0): string {
    if (value === undefined || Number.isNaN(value)) return "—";
    return `${value.toFixed(digits)} ${suffix}`;
  }
}

export const unitConversionService = new UnitConversionService();
