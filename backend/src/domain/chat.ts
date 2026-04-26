import type { Activity } from "./activity.js";
import type { ForecastCard } from "./cards.js";
import type { Coordinates } from "./coordinates.js";
import type { LocationCandidate } from "./location.js";
import type { SourceAttribution } from "./sources.js";
import type { UnitSystem } from "./units.js";

export type Platform = "ios" | "android" | "web" | "unknown";

export interface ChatRequest {
  conversationId?: string;
  message: string;
  userLocation?: Coordinates;
  units?: UnitSystem;
  platform: Platform;
}

export interface ForecastIntent {
  locationQuery: string | null;
  coordinates: Coordinates | null;
  activity: Activity;
  startTimeLocal: string | null;
  endTimeLocal: string | null;
  datePhrase: string | null;
  units: UnitSystem | null;
  requestedFields: Array<
    | "wind"
    | "gusts"
    | "waves"
    | "swell"
    | "tides"
    | "currents"
    | "temperature"
    | "precipitation"
    | "visibility"
    | "alerts"
    | "observations"
  >;
  needsClarification: boolean;
  clarificationQuestion: string | null;
}

export interface ChatResponse {
  conversationId: string;
  assistantMessage: string;
  location?: {
    name: string;
    admin1?: string;
    country?: string;
    lat: number;
    lon: number;
    timezone?: string;
  };
  clarification: {
    needed: boolean;
    question?: string | null;
    choices: Array<{
      id: string;
      label: string;
      lat: number;
      lon: number;
    }>;
  };
  cards: ForecastCard[];
  timeSeries: ChatTimeSeriesPoint[];
  sources: SourceAttribution[];
  warnings: string[];
}

export interface ChatTimeSeriesPoint {
  time: string;
  windSpeed?: number;
  windSpeedUnit?: string;
  windDirectionDegrees?: number;
  windDirectionCompass?: string;
  windGust?: number;
  airTemperature?: number;
  airTemperatureUnit?: string;
  precipitationProbability?: number;
  waveHeight?: number;
  waveHeightUnit?: string;
  swellHeight?: number;
  wavePeriod?: number;
}

export interface LocationSearchResponse {
  query: string;
  results: LocationCandidate[];
}
