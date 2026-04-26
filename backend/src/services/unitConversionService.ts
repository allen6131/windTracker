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

  convertWind(ms: number, units: UnitSystem): { value: number; unit: string } {
    return { value: Number(this.windSpeed(ms, units).toFixed(1)), unit: this.windSpeedUnit(units) };
  }

  convertTemperature(celsius: number, units: UnitSystem): { value: number; unit: string } {
    return { value: Number(this.temperature(celsius, units).toFixed(1)), unit: this.temperatureUnit(units) };
  }

  convertWaveHeight(meters: number, units: UnitSystem): { value: number; unit: string } {
    return { value: Number(this.waveHeight(meters, units).toFixed(1)), unit: this.waveHeightUnit(units) };
  }

  formatWind(ms: number | undefined, units: UnitSystem): string {
    if (ms === undefined) return "—";
    return this.format(this.windSpeed(ms, units), this.windSpeedUnit(units));
  }

  formatWindSpeed(ms: number | undefined, units: UnitSystem): string {
    return this.formatWind(ms, units);
  }

  formatTemperature(celsius: number | undefined, units: UnitSystem): string {
    if (celsius === undefined) return "—";
    return this.format(this.temperature(celsius, units), this.temperatureUnit(units));
  }

  formatWaveHeight(meters: number | undefined, units: UnitSystem): string {
    if (meters === undefined) return "—";
    return this.format(this.waveHeight(meters, units), this.waveHeightUnit(units), 1);
  }

  formatDistance(km: number | undefined, units: UnitSystem): string {
    if (km === undefined) return "—";
    return this.format(this.distance(km, units), this.distanceUnit(units), 1);
  }
}

export const unitConversionService = new UnitConversionService();
