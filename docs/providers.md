# Provider Setup Notes

## Open-Meteo

Open-Meteo is the default provider for:

- Geocoding fallback
- General weather and wind forecast
- Marine wave/swell forecast

No API key is required.

## NOAA

NOAA enrichment is U.S.-focused:

- CO-OPS tide predictions
- NDBC buoy observations adapter boundary
- NWS alerts

Station metadata is cached and nearest stations are selected by haversine distance with conservative thresholds. If no station is close enough, the backend returns a warning and continues with wind/wave forecasts.

## Google Places

Set `GOOGLE_MAPS_API_KEY` in backend `.env` to use Google location search first. Mobile apps never receive this key.

## Stormglass

Set `STORMGLASS_API_KEY` to mark the premium adapter as configured. The MVP includes a clean adapter boundary; full premium retrieval can be enabled behind the existing `MarineProvider` and `TideProvider` interfaces.

## Meteomatics

Set `METEOMATICS_USERNAME` and `METEOMATICS_PASSWORD` to mark Meteomatics as configured. The MVP includes the adapter boundary for enterprise weather/marine/tide support.

## Attribution

Every successful forecast response includes `sources[]` with provider, dataset, timestamp, and station metadata when applicable. Mobile apps render these in data-source sections.
