# Architecture

Wind AI Forecast is a monorepo with native mobile clients and one shared backend.

```text
iOS SwiftUI app ┐
                ├── HTTPS JSON API ── Fastify backend ── OpenAI Responses API
Android Compose ┘                         ├──────────── Open-Meteo forecast/marine/geocoding
                                          ├──────────── NOAA CO-OPS/NDBC/NWS enrichment
                                          └──────────── Optional Google/Stormglass/Meteomatics
```

The mobile apps never call OpenAI or data providers directly. They send only user messages, explicit user location coordinates, settings, and platform metadata to the backend.

## Backend layers

- HTTP: Fastify routes, JSON Schema validation, Swagger/OpenAPI, Helmet, CORS, rate limiting, error handler.
- Services: chat orchestration, location resolution, forecasts, marine, tides, observations, deterministic activity ranking, units, source attribution.
- Domain: provider-neutral normalized models.
- Providers: adapters for Open-Meteo, NOAA/NWS, Google, Stormglass, Meteomatics.
- Infrastructure: config, cache, logging, OpenAI client.

## Safety

Forecasts are estimates and can change. The app is not a substitute for official marine, aviation, emergency, or local safety guidance.
