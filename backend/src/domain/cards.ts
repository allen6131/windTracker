export type CardType =
  | "current_conditions"
  | "forecast_summary"
  | "best_windows"
  | "marine"
  | "tides"
  | "alerts";

export type CardSeverity = "normal" | "watch" | "warning";

export interface ForecastCardItem {
  label: string;
  value: string;
  severity?: CardSeverity;
}

export interface ForecastCard {
  type: CardType;
  title: string;
  subtitle?: string;
  items: ForecastCardItem[];
}
