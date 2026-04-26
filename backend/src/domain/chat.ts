import type { Activity } from "./activity";
import type { ForecastCard } from "./cards";
import type { Coordinates } from "./coordinates";
import type { LocationCandidate } from "./location";
import type { SourceAttribution } from "./sources";
import type { UnitSystem } from "./units";

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
  precipitationProbability?: number;
  waveHeight?: number;
  swellHeight?: number;
  wavePeriod?: number;
}

export interface LocationSearchResponse {
  query: string;
  results: LocationCandidate[];
}
