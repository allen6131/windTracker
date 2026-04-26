# Wind AI Forecast API

Fastify/TypeScript backend for native iOS and Android wind, weather, marine, tide, and AI chat forecast apps. Mobile clients call this API only; provider and OpenAI keys stay server-side.

## Architecture

Native app → Fastify API → OpenAI Responses API + Open-Meteo + NOAA + optional Google/Stormglass/Meteomatics.

Layers:
- HTTP routes/controllers with JSON Schema and Swagger.
- Services for chat, location, forecast aggregation, marine/tide/observations, ranking, units, and source attribution.
- Provider adapters behind interfaces.
- Domain models normalized to m/s, °C, meters, km.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

If `OPENAI_API_KEY` is empty in development, the API starts in deterministic mock AI mode. Production requires `OPENAI_API_KEY`.

## Swagger

- Swagger UI: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/openapi.json

## Environment

See `.env.example`. Open-Meteo and NOAA require no keys. Google, Stormglass, Meteomatics, and Redis are optional.

## API examples

```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/chat \
  -H 'content-type: application/json' \
  -d '{"message":"Is South Padre good for kiteboarding tomorrow afternoon?","platform":"ios","units":"imperial"}'

curl -X POST http://localhost:3000/api/locations/search \
  -H 'content-type: application/json' \
  -d '{"query":"South Padre"}'

curl -X POST http://localhost:3000/api/forecast \
  -H 'content-type: application/json' \
  -d '{"location":{"lat":26.1118,"lon":-97.1681,"name":"South Padre Island"},"activity":"kitesurfing","units":"imperial","include":["wind","marine","tides"]}'
```

## Testing

```bash
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker compose up --build
```

## Providers

- Open-Meteo: default geocoding fallback, wind/weather, marine forecast.
- NOAA: U.S.-only tide/alert/observation enrichment where available.
- Google Places: optional location search with `GOOGLE_MAPS_API_KEY`.
- Stormglass/Meteomatics: premium adapter stubs; no mobile key exposure.

## Known limitations

- Forecasts are estimates and can change.
- Tide coverage is best for U.S. NOAA-supported stations unless premium providers are configured.
- Surf scoring is approximate without coastline orientation.
- This app is not for emergency navigation, aviation, or life-safety decisions.
