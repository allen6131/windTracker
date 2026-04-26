export const providerStatusResponseSchema = {
  type: "object",
  required: ["providers"],
  properties: {
    providers: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "configured", "requiredKey", "role"],
        properties: {
          name: { type: "string" },
          configured: { type: "boolean" },
          requiredKey: { type: "boolean" },
          role: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

export const providerStatusRouteSchema = {
  summary: "Get provider status",
  description: "Return configured provider capabilities and whether optional API keys are present.",
  tags: ["Providers"],
  response: {
    200: providerStatusResponseSchema,
  },
} as const;
