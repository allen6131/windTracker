import type { FastifyInstance } from "fastify";
import { AppError } from "../domain/errors.js";

export async function registerErrorHandler(app: FastifyInstance): Promise<void> {
  app.setErrorHandler((error: Error & { validation?: unknown; statusCode?: number }, request, reply) => {
    const requestId = request.id;

    if (error.validation) {
      request.log.warn({ error, requestId }, "Request validation failed");
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "The request is invalid. Check required fields and try again.",
          requestId,
        },
      });
    }

    if (error instanceof AppError) {
      request.log.warn({ error, requestId, code: error.code }, "Application error");
      return reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.safeMessage,
          requestId,
        },
      });
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    const code = statusCode === 429 ? "RATE_LIMITED" : "INTERNAL_ERROR";
    const message =
      statusCode === 429 ? "Too many requests. Please wait a moment and try again." : "Something went wrong.";

    request.log.error({ error, requestId }, "Unhandled error");
    return reply.status(statusCode).send({
      error: {
        code,
        message,
        requestId,
      },
    });
  });
}
