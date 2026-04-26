# Wind AI Forecast

Native iOS and native Android wind, marine, tide, and weather forecast apps powered by a shared Fastify backend.

The mobile apps call only the backend. OpenAI and provider credentials for Open-Meteo, NOAA, Google, Stormglass, and Meteomatics are never shipped in mobile source code.

## Projects

- `backend/` — TypeScript Fastify API, OpenAI orchestration, provider adapters, Swagger, tests, Docker.
- `ios/` — SwiftUI iOS 17+ app using MVVM and URLSession.
- `android/` — Kotlin + Jetpack Compose app using MVVM, Retrofit/OkHttp, coroutines, and DataStore.
- `docs/` — Architecture, API contract, and provider setup notes.

## Quick start

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Then open:

- Health: <http://localhost:3000/api/health>
- Swagger UI: <http://localhost:3000/docs>
- OpenAPI JSON: <http://localhost:3000/openapi.json>

In development, the backend can run without `OPENAI_API_KEY` using a deterministic local chat fallback. Production requires `OPENAI_API_KEY`.

## Native apps

See `ios/README.md` and `android/README.md` for platform-specific setup.

## Safety

Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.
