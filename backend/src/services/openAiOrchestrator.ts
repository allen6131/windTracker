import type { ChatRequest, ChatResponse, ForecastIntent } from "../domain/chat.js";
import type { NormalizedWeatherForecast } from "../domain/forecast.js";
import type { NormalizedMarineForecast } from "../domain/marine.js";
import type { NormalizedTideForecast } from "../domain/tides.js";
import type { NormalizedAlert, NormalizedObservation } from "../domain/observations.js";
import type { LocationCandidate } from "../domain/location.js";
import type { UnitSystem } from "../domain/units.js";
import { config } from "../config.js";
import { createOpenAiClient } from "../openai/client.js";
import { SYSTEM_PROMPT } from "../openai/prompts.js";
import { openAiToolDefinitions } from "../openai/tools.js";
import { ResponseBuilder } from "./responseBuilder.js";
import { ToolRegistry } from "./toolRegistry.js";

export class OpenAiOrchestrator {
  constructor(
    private readonly tools: ToolRegistry,
    private readonly responseBuilder = new ResponseBuilder(),
  ) {}

  async handleChat(request: ChatRequest, conversationId: string): Promise<ChatResponse> {
    if (config.isMockAiMode) {
      return this.handleDeterministicFallback(request, conversationId);
    }

    const client = createOpenAiClient();
    if (!client) {
      return this.handleDeterministicFallback(request, conversationId);
    }

    try {
      const response = await client.responses.create({
        model: config.openAiModel,
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              message: request.message,
              platform: request.platform,
              units: request.units,
              userLocation: request.userLocation ? "provided" : "not provided",
            }),
          },
        ],
        tools: openAiToolDefinitions as never,
      });
      const text = response.output_text?.trim();
      const fallback = await this.handleDeterministicFallback(request, conversationId);
      return {
        ...fallback,
        assistantMessage: text || fallback.assistantMessage,
      };
    } catch {
      return this.handleDeterministicFallback(request, conversationId);
    }
  }

  async handleDeterministicFallback(request: ChatRequest, conversationId: string): Promise<ChatResponse> {
    const units = request.units ?? "imperial";
    const intent = this.extractIntent(request.message, units);
    const locationResult = await this.tools.resolveLocation({
      query: intent.locationQuery ?? request.message,
      userLocation: request.userLocation,
    });

    if (locationResult.status !== "resolved" || !locationResult.location) {
      return {
        conversationId,
        assistantMessage:
          locationResult.question ?? "I need a little more detail before I can check the forecast. Which location did you mean?",
        clarification: {
          needed: true,
          question: locationResult.question ?? null,
          choices: locationResult.choices.map((choice: LocationCandidate) => ({
            id: choice.id,
            label: [choice.name, choice.admin1, choice.country].filter(Boolean).join(", "),
            lat: choice.lat,
            lon: choice.lon,
          })),
        },
        cards: [],
        timeSeries: [],
        sources: [],
        warnings: [],
      };
    }

    const location = locationResult.location as LocationCandidate;
    const [forecastBundle, marineBundle, tideBundle, observationBundle] = await Promise.all([
      this.tools.getWeatherForecast({
        lat: location.lat,
        lon: location.lon,
        startTime: intent.startTimeLocal,
        endTime: intent.endTimeLocal,
        location,
      }),
      this.tools.getMarineForecast({
        lat: location.lat,
        lon: location.lon,
        startTime: intent.startTimeLocal,
        endTime: intent.endTimeLocal,
      }),
      this.tools.getTidePredictions({
        lat: location.lat,
        lon: location.lon,
        startTime: intent.startTimeLocal,
        endTime: intent.endTimeLocal,
        location,
      }),
      this.tools.getNearestObservations({
        lat: location.lat,
        lon: location.lon,
      }),
    ]);

    const ranking = await this.tools.rankActivityWindows({
      activity: intent.activity,
      forecast: forecastBundle.weather,
      marine: marineBundle.marine,
      units,
    });
    const warnings = [
      ...(forecastBundle.warnings ?? []),
      ...(marineBundle.warnings ?? []),
      ...(tideBundle.warnings ?? []),
      ...(observationBundle.warnings ?? []),
      "Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.",
    ];
    const parts = {
      location,
      weather: forecastBundle.weather,
      marine: marineBundle.marine,
      tides: tideBundle.tides,
      observations: observationBundle.observations,
      alerts: forecastBundle.alerts,
      ranking,
      units,
      warnings,
    };
    const cards = this.responseBuilder.buildCards(parts);
    const timeSeries = this.responseBuilder.buildTimeSeries(parts);
    const sources = this.responseBuilder.collectSources(parts);
    return {
      conversationId,
      assistantMessage: this.buildAssistantMessage(location, intent, ranking, warnings),
      location: compactLocation({
        name: location.name,
        admin1: location.admin1,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        timezone: location.timezone,
      }),
      clarification: { needed: false, question: null, choices: [] },
      cards,
      timeSeries,
      sources,
      warnings,
    };
  }

  private extractIntent(message: string, units: UnitSystem): ForecastIntent {
    const lower = message.toLowerCase();
    const activity = lower.includes("kite")
      ? "kitesurfing"
      : lower.includes("windsurf")
        ? "windsurfing"
        : lower.includes("sail")
          ? "sailing"
          : lower.includes("surf")
            ? "surfing"
            : lower.includes("fish")
              ? "fishing"
              : lower.includes("boat")
                ? "boating"
                : lower.includes("paraglid")
                  ? "paragliding"
                  : lower.includes("hik")
                    ? "hiking"
                    : "general";
    const requestedFields = [
      "wind",
      "gusts",
      lower.match(/wave|swell|surf|marine/) ? "waves" : undefined,
      lower.match(/tide|current/) ? "tides" : undefined,
      "temperature",
      "precipitation",
      "observations",
    ].filter(Boolean) as ForecastIntent["requestedFields"];
    const datePhrase = lower.includes("weekend")
      ? "this weekend"
      : lower.includes("tomorrow")
        ? "tomorrow"
        : lower.includes("today")
          ? "today"
          : null;
    const window = this.roughWindow(datePhrase, lower);
    return {
      locationQuery: this.extractLocationQuery(message),
      coordinates: null,
      activity,
      startTimeLocal: window.start,
      endTimeLocal: window.end,
      datePhrase,
      units,
      requestedFields,
      needsClarification: false,
      clarificationQuestion: null,
    };
  }

  private extractLocationQuery(message: string): string {
    const beachQuestion = message.match(/\bis\s+([A-Za-z .'-]+?)\s+(?:good|ok|safe|worth|windy)\b/i);
    if (beachQuestion?.[1]) return beachQuestion[1].trim();
    const match = message.match(/\b(?:near|at|out of|in|for)\s+([A-Za-z .'-]+?)(?:\s+(?:tomorrow|today|this weekend|at|around|for|good|conditions|forecast)|[?.!,]|$)/i);
    if (match?.[1]) return match[1].trim();
    return message
      .replace(/is|show|wind|waves|near|this weekend|tomorrow|today|afternoon|morning|evening|good|for|kiteboarding|kitesurfing|windsurfing|sailing|surf|surfing|fishing|boating|conditions|like|what|best|time|to/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private roughWindow(datePhrase: string | null, lower: string): { start: string; end: string } {
    const start = new Date();
    if (datePhrase === "tomorrow") start.setDate(start.getDate() + 1);
    if (datePhrase === "this weekend") {
      const day = start.getDay();
      const daysUntilSaturday = (6 - day + 7) % 7;
      start.setDate(start.getDate() + daysUntilSaturday);
    }
    start.setHours(lower.includes("morning") ? 8 : lower.includes("evening") ? 17 : lower.includes("afternoon") ? 12 : start.getHours(), 0, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + (datePhrase === "this weekend" ? 36 : 6));
    return { start: start.toISOString(), end: end.toISOString() };
  }

  private buildAssistantMessage(location: LocationCandidate, intent: ForecastIntent, ranking: { bestWindows?: Array<{ label: string; reasons: string[]; cautions: string[] }> }, warnings: string[]): string {
    const best = ranking.bestWindows?.[0];
    const activityLabel = intent.activity === "general" ? "conditions" : intent.activity;
    const sourceNote = warnings.length ? " Check the notes and source timestamps before heading out." : "";
    if (best) {
      return `${location.name}: the best ${activityLabel} window looks like ${best.label}. ${[...best.reasons, ...best.cautions].slice(0, 3).join(" ")}${sourceNote}`;
    }
    return `${location.name}: I found forecast data, but there is no standout window for ${activityLabel}. Review wind, waves, tides, and warnings below.${sourceNote}`;
  }
}

function compactLocation(location: ChatResponse["location"]): NonNullable<ChatResponse["location"]> {
  return Object.fromEntries(Object.entries(location ?? {}).filter(([, value]) => value !== undefined)) as NonNullable<ChatResponse["location"]>;
}
