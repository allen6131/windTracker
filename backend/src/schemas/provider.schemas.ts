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
