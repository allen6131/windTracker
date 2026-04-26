import Foundation
import CoreLocation

@MainActor
final class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = [
        ChatMessage(role: .assistant, text: "Ask about wind, waves, tides, or the best time to get on the water.")
    ]
    @Published var inputText = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var latestResponse: ChatResponse?
    @Published var pendingClarification: Clarification?

    private let apiClient: APIClient
    private let locationService: LocationPermissionService
    private var conversationId: String?
    private var lastRequestMessage: String?

    init(apiClient: APIClient = APIClient(), locationService: LocationPermissionService = LocationPermissionService()) {
        self.apiClient = apiClient
        self.locationService = locationService
    }

    func sendCurrentMessage(units: UnitSystem, platform: Platform = .ios) async {
        let trimmed = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        inputText = ""
        await send(message: trimmed, units: units, platform: platform, userLocation: nil)
    }

    func useCurrentLocationAndSend(units: UnitSystem) async {
        do {
            let location = try await locationService.requestCurrentLocation()
            let message = inputText.isEmpty ? "What are conditions like here?" : inputText
            inputText = ""
            await send(
                message: message,
                units: units,
                userLocation: Coordinates(lat: location.coordinate.latitude, lon: location.coordinate.longitude)
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func select(choice: ClarificationChoice, units: UnitSystem) async {
        let message = "Use \(choice.label) at \(choice.lat), \(choice.lon). \(lastRequestMessage ?? "")"
        pendingClarification = nil
        await send(message: message, units: units, userLocation: Coordinates(lat: choice.lat, lon: choice.lon))
    }

    func retry(units: UnitSystem) async {
        guard let lastRequestMessage else { return }
        await send(message: lastRequestMessage, units: units)
    }

    private func send(message: String, units: UnitSystem, platform: Platform = .ios, userLocation: Coordinates? = nil) async {
        messages.append(ChatMessage(role: .user, text: message))
        isLoading = true
        errorMessage = nil
        lastRequestMessage = message
        do {
            let response = try await apiClient.sendChatMessage(
                ChatRequest(conversationId: conversationId, message: message, userLocation: userLocation, units: units, platform: platform)
            )
            conversationId = response.conversationId
            latestResponse = response
            pendingClarification = response.clarification.needed ? response.clarification : nil
            messages.append(ChatMessage(role: .assistant, text: response.assistantMessage))
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}
