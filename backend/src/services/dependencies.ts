import { memoryCache } from "../cache/memoryCache.js";
import { config } from "../config.js";
import { GooglePlacesProvider } from "../providers/google/googlePlacesProvider.js";
import { NoaaCoopsProvider } from "../providers/noaa/noaaCoopsProvider.js";
import { NoaaNdbcProvider } from "../providers/noaa/noaaNdbcProvider.js";
import { NoaaStationService } from "../providers/noaa/noaaStationService.js";
import { NwsProvider } from "../providers/nws/nwsProvider.js";
import { OpenMeteoForecastProvider } from "../providers/openMeteo/openMeteoForecastProvider.js";
import { OpenMeteoGeocodingProvider } from "../providers/openMeteo/openMeteoGeocodingProvider.js";
import { OpenMeteoMarineProvider } from "../providers/openMeteo/openMeteoMarineProvider.js";
import { StormglassProvider } from "../providers/stormglass/stormglassProvider.js";
import type { LocationProvider } from "../providers/types/locationProvider.js";
import type { MarineProvider } from "../providers/types/marineProvider.js";
import type { ObservationProvider } from "../providers/types/observationProvider.js";
import type { TideProvider } from "../providers/types/tideProvider.js";
import { ActivityRankingService } from "./activityRankingService.js";
import { ChatService } from "./chatService.js";
import { ForecastService } from "./forecastService.js";
import { LocationService } from "./locationService.js";
import { MarineService } from "./marineService.js";
import { ObservationService } from "./observationService.js";
import { OpenAiOrchestrator } from "./openAiOrchestrator.js";
import { ResponseBuilder } from "./responseBuilder.js";
import { TideService } from "./tideService.js";
import { createToolRegistry } from "./toolRegistry.js";

const locationProviders: LocationProvider[] = [
  ...(config.googleMapsApiKey ? [new GooglePlacesProvider(memoryCache)] : []),
  new OpenMeteoGeocodingProvider(memoryCache),
];

export const locationService = new LocationService(locationProviders);
export const weatherProvider = new OpenMeteoForecastProvider(memoryCache);
export const marineProviders: MarineProvider[] = [
  new OpenMeteoMarineProvider(memoryCache),
  new StormglassProvider(config.stormglassApiKey),
];
export const stationService = new NoaaStationService(memoryCache);
export const tideProviders: TideProvider[] = [new NoaaCoopsProvider(stationService, memoryCache)];
export const observationProviders: ObservationProvider[] = [new NoaaNdbcProvider(), new NwsProvider()];
export const nwsProvider = new NwsProvider();
export const rankingService = new ActivityRankingService();
export const forecastService = new ForecastService(weatherProvider, locationService, nwsProvider);
export const marineService = new MarineService(marineProviders);
export const tideService = new TideService(tideProviders, locationService);
export const observationService = new ObservationService(observationProviders, locationService);
export const toolRegistry = createToolRegistry({
  locationService,
  forecastService,
  marineService,
  tideService,
  observationService,
  rankingService,
});
export const openAiOrchestrator = new OpenAiOrchestrator(toolRegistry);
export const chatService = new ChatService(openAiOrchestrator);
export const responseBuilder = new ResponseBuilder();

export const services = {
  config: {
    googleMapsApiKeyConfigured: Boolean(config.googleMapsApiKey),
    stormglassConfigured: Boolean(config.stormglassApiKey),
    meteomaticsConfigured: Boolean(config.meteomaticsUsername && config.meteomaticsPassword),
  },
  locationService,
  forecastService,
  marineService,
  tideService,
  observationService,
  rankingService,
  responseBuilder,
  chatService,
};

export function getServices() {
  return services;
}
