import pino from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.logLevel,
  redact: {
    paths: [
      "OPENAI_API_KEY",
      "GOOGLE_MAPS_API_KEY",
      "STORMGLASS_API_KEY",
      "authorization",
      "headers.authorization",
      "*.apiKey",
      "*.password"
    ],
    censor: "[REDACTED]"
  }
});
