# Wind AI Forecast API Contract

Base URL defaults to `http://localhost:3000`.

## Health

`GET /api/health`

```json
{
  "ok": true,
  "version": "0.1.0",
  "environment": "development",
  "time": "2026-04-26T12:00:00.000Z"
}
```

## Chat

`POST /api/chat`

```json
{
  "conversationId": "optional-string",
  "message": "Is South Padre good for kiteboarding tomorrow afternoon?",
  "userLocation": { "lat": 40.7128, "lon": -74.006 },
  "units": "imperial",
  "platform": "ios"
}
```

Returns `assistantMessage`, optional `location`, `clarification`, `cards`, `timeSeries`, `sources`, and `warnings`.

## Locations

`POST /api/locations/search`

```json
{ "query": "South Padre", "userLocation": { "lat": 30, "lon": -97 } }
```

Returns ranked location candidates from Google when configured or Open-Meteo fallback.

## Forecast

`POST /api/forecast`

```json
{
  "location": { "lat": 26.1118, "lon": -97.1681, "name": "South Padre Island" },
  "activity": "kitesurfing",
  "startTime": "2026-04-27T12:00:00-05:00",
  "endTime": "2026-04-27T18:00:00-05:00",
  "units": "imperial",
  "include": ["wind", "marine", "tides", "observations"]
}
```

Returns the same structured forecast payload as chat without the assistant text.

## Provider status

`GET /api/providers/status` lists configured provider roles.

## Error shape

```json
{
  "error": {
    "code": "LOCATION_NOT_FOUND",
    "message": "I could not find that location. Try a city, beach, marina, or lat/lon.",
    "requestId": "string"
  }
}
```
