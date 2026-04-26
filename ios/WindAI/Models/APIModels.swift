import Foundation

enum UnitSystem: String, Codable, CaseIterable, Identifiable {
    case metric
    case imperial
    case knots

    var id: String { rawValue }
}

enum Platform: String, Codable {
    case ios
    case android
    case web
    case unknown
}

enum Activity: String, Codable, CaseIterable, Identifiable {
    case kitesurfing
    case windsurfing
    case sailing
    case surfing
    case fishing
    case boating
    case paragliding
    case hiking
    case general

    var id: String { rawValue }
}

struct Coordinates: Codable, Equatable {
    let lat: Double
    let lon: Double
}

struct ChatRequest: Encodable {
    let conversationId: String?
    let message: String
    let userLocation: Coordinates?
    let units: UnitSystem?
    let platform: Platform
}

struct ChatResponse: Codable, Equatable {
    let conversationId: String
    let assistantMessage: String
    let location: ResponseLocation?
    let clarification: Clarification
    let cards: [ForecastCard]
    let timeSeries: [TimeSeriesPoint]
    let sources: [SourceAttribution]
    let warnings: [String]
}

struct ResponseLocation: Codable, Equatable {
    let name: String
    let admin1: String?
    let country: String?
    let lat: Double
    let lon: Double
    let timezone: String?
}

struct Clarification: Codable, Equatable {
    let needed: Bool
    let question: String?
    let choices: [LocationChoice]
}

struct LocationChoice: Codable, Identifiable, Equatable {
    let id: String
    let label: String
    let lat: Double
    let lon: Double
}

struct ForecastCard: Codable, Identifiable, Equatable {
    let id = UUID()
    let type: CardType
    let title: String
    let subtitle: String?
    let items: [ForecastCardItem]

    enum CodingKeys: String, CodingKey {
        case type, title, subtitle, items
    }
}

enum CardType: String, Codable {
    case currentConditions = "current_conditions"
    case forecastSummary = "forecast_summary"
    case bestWindows = "best_windows"
    case marine
    case tides
    case alerts
}

struct ForecastCardItem: Codable, Identifiable, Equatable {
    let id = UUID()
    let label: String
    let value: String
    let severity: Severity?

    enum CodingKeys: String, CodingKey {
        case label, value, severity
    }
}

enum Severity: String, Codable {
    case normal
    case watch
    case warning
}

struct TimeSeriesPoint: Codable, Equatable {
    let time: String
    let windSpeed: Double?
    let windSpeedUnit: String?
    let windDirectionDegrees: Double?
    let windDirectionCompass: String?
    let windGust: Double?
    let airTemperature: Double?
    let precipitationProbability: Double?
    let waveHeight: Double?
    let swellHeight: Double?
    let wavePeriod: Double?
}

struct SourceAttribution: Codable, Identifiable, Equatable {
    var id: String { "\(provider)-\(dataset)-\(stationId ?? "")-\(fetchedAt)" }
    let provider: String
    let dataset: String
    let url: String?
    let fetchedAt: String
    let stationName: String?
    let stationId: String?
    let distanceKm: Double?
}
