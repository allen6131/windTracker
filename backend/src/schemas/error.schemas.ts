export const errorResponseSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message", "requestId"],
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        requestId: { type: "string" },
      },
    },
  },
} as const;

export const errorResponses = {
  400: {
    description: "Bad request",
    ...errorResponseSchema,
  },
  401: {
    description: "Unauthorized",
    ...errorResponseSchema,
  },
  404: {
    description: "Not found",
    ...errorResponseSchema,
  },
  429: {
    description: "Rate limited",
    ...errorResponseSchema,
  },
  500: {
    description: "Internal server error",
    ...errorResponseSchema,
  },
} as const;

export const errorResponseSchemas = errorResponses;
