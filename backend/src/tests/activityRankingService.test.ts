import { describe, expect, it } from "vitest";
import { ActivityRankingService } from "../services/activityRankingService.js";

describe("ActivityRankingService", () => {
  it("returns best windows and cautions for kitesurfing", () => {
    const result = new ActivityRankingService().rank({
      activity: "kitesurfing",
      weather: {
        hourly: [
          { time: "2026-04-27T12:00:00Z", windSpeedMs: 10, windGustMs: 13, precipitationProbability: 10 },
          { time: "2026-04-27T13:00:00Z", windSpeedMs: 22, windGustMs: 26, precipitationProbability: 10 },
        ],
        sources: [],
        warnings: [],
      },
    });

    expect(result.bestWindows[0]?.score).toBeGreaterThan(70);
    expect(result.bestWindows[0]?.reasons.join(" ")).toContain("wind");
    expect(result.avoidWindows.length).toBeGreaterThan(0);
  });
});
