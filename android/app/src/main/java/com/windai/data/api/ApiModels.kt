package com.windai.data.api

import kotlinx.serialization.Serializable

@Serializable
data class CoordinatesDto(val lat: Double, val lon: Double)

@Serializable
data class ChatRequestDto(
    val conversationId: String? = null,
    val message: String,
    val userLocation: CoordinatesDto? = null,
    val units: String? = null,
    val platform: String = "android"
)

@Serializable
data class ChatResponseDto(
    val conversationId: String,
    val assistantMessage: String,
    val location: LocationDto? = null,
    val clarification: ClarificationDto = ClarificationDto(false, null, emptyList()),
    val cards: List<ForecastCardDto> = emptyList(),
    val timeSeries: List<TimeSeriesPointDto> = emptyList(),
    val sources: List<SourceDto> = emptyList(),
    val warnings: List<String> = emptyList()
)

@Serializable
data class LocationDto(
    val name: String,
    val admin1: String? = null,
    val country: String? = null,
    val lat: Double,
    val lon: Double,
    val timezone: String? = null
)

@Serializable
data class ClarificationDto(
    val needed: Boolean,
    val question: String? = null,
    val choices: List<LocationChoiceDto> = emptyList()
)

@Serializable
data class LocationChoiceDto(
    val id: String,
    val label: String,
    val lat: Double,
    val lon: Double
)

@Serializable
data class ForecastCardDto(
    val type: String,
    val title: String,
    val subtitle: String? = null,
    val items: List<ForecastCardItemDto> = emptyList()
)

@Serializable
data class ForecastCardItemDto(
    val label: String,
    val value: String,
    val severity: String? = null
)

@Serializable
data class TimeSeriesPointDto(
    val time: String,
    val windSpeed: Double? = null,
    val windSpeedUnit: String? = null,
    val windDirectionDegrees: Double? = null,
    val windDirectionCompass: String? = null,
    val windGust: Double? = null,
    val airTemperature: Double? = null,
    val precipitationProbability: Double? = null,
    val waveHeight: Double? = null,
    val swellHeight: Double? = null,
    val wavePeriod: Double? = null
)

@Serializable
data class SourceDto(
    val provider: String,
    val dataset: String,
    val url: String? = null,
    val fetchedAt: String,
    val stationName: String? = null,
    val stationId: String? = null,
    val distanceKm: Double? = null
)
