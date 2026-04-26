import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    HOST: z.string().default("0.0.0.0"),
    PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000"),
    OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
    GOOGLE_MAPS_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
    STORMGLASS_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
    METEOMATICS_USERNAME: z.preprocess(emptyToUndefined, z.string().optional()),
    METEOMATICS_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
    REDIS_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
    CORS_ORIGINS: z.string().default("http://localhost:3000"),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    RATE_LIMIT_WINDOW: z.string().default("1 minute"),
    CHAT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
    PROVIDER_TIMEOUT_MS: z.coerce.number().int().positive().default(10000)
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && !env.OPENAI_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "OPENAI_API_KEY is required in production",
        path: ["OPENAI_API_KEY"]
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid backend environment", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid backend environment");
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  host: parsed.data.HOST,
  publicApiBaseUrl: parsed.data.PUBLIC_API_BASE_URL,
  openAiApiKey: parsed.data.OPENAI_API_KEY,
  openAiModel: parsed.data.OPENAI_MODEL,
  googleMapsApiKey: parsed.data.GOOGLE_MAPS_API_KEY,
  stormglassApiKey: parsed.data.STORMGLASS_API_KEY,
  meteomaticsUsername: parsed.data.METEOMATICS_USERNAME,
  meteomaticsPassword: parsed.data.METEOMATICS_PASSWORD,
  redisUrl: parsed.data.REDIS_URL,
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  rateLimitMax: parsed.data.RATE_LIMIT_MAX,
  rateLimitWindow: parsed.data.RATE_LIMIT_WINDOW,
  chatRateLimitMax: parsed.data.CHAT_RATE_LIMIT_MAX,
  logLevel: parsed.data.LOG_LEVEL,
  providerTimeoutMs: parsed.data.PROVIDER_TIMEOUT_MS,
  isMockAiMode: !parsed.data.OPENAI_API_KEY && parsed.data.NODE_ENV !== "production"
} as const;

if (config.isMockAiMode && config.nodeEnv !== "test") {
  // eslint-disable-next-line no-console
  console.warn("OPENAI_API_KEY is not set. Backend is running in deterministic development AI mode.");
}
