export type ErrorCode =
  | "VALIDATION_ERROR"
  | "PROVIDER_ERROR"
  | "PROVIDER_UNAVAILABLE"
  | "LOCATION_AMBIGUOUS"
  | "LOCATION_NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode = 500,
    public readonly safeMessage = message,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
  }
}

export class ProviderError extends AppError {
  constructor(provider: string, message: string) {
    super("PROVIDER_ERROR", `${provider}: ${message}`, 502, "A forecast provider is temporarily unavailable.");
  }
}

export class ProviderUnavailableError extends AppError {
  constructor(message = "Provider unavailable") {
    super("PROVIDER_UNAVAILABLE", message, 503, "A forecast provider is temporarily unavailable.");
  }
}

export class LocationAmbiguousError extends AppError {
  constructor(message = "Location is ambiguous") {
    super("LOCATION_AMBIGUOUS", message, 400, "Which location did you mean?");
  }
}

export class LocationNotFoundError extends AppError {
  constructor(message = "Location not found") {
    super(
      "LOCATION_NOT_FOUND",
      message,
      404,
      "I could not find that location. Try a city, beach, marina, or lat/lon.",
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super("RATE_LIMITED", message, 429, "Too many requests. Please wait a moment and try again.");
  }
}
