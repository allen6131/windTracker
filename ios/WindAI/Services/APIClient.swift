import Foundation

enum APIError: LocalizedError, Equatable {
    case invalidURL
    case transport(String)
    case server(String)
    case decoding

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "The backend URL is invalid."
        case .transport(let message): return message
        case .server(let message): return message
        case .decoding: return "The response could not be decoded."
        }
    }
}

protocol APIClientProtocol {
    func sendChatMessage(_ request: ChatRequest) async throws -> ChatResponse
}

final class APIClient: APIClientProtocol {
    static let shared = APIClient()

    private let baseURL: URL
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    init(
        baseURL: URL = URL(string: ProcessInfo.processInfo.environment["WIND_AI_API_BASE_URL"] ?? "http://localhost:3000")!,
        session: URLSession = .shared
    ) {
        self.baseURL = baseURL
        self.session = session
        decoder = JSONDecoder()
        encoder = JSONEncoder()
    }

    func sendChatMessage(_ request: ChatRequest) async throws -> ChatResponse {
        guard let url = URL(string: "/api/chat", relativeTo: baseURL) else {
            throw APIError.invalidURL
        }
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.timeoutInterval = 30
        urlRequest.httpBody = try encoder.encode(request)

        do {
            let (data, response) = try await session.data(for: urlRequest)
            if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
                let decodedError = try? decoder.decode(ErrorResponse.self, from: data)
                throw APIError.server(decodedError?.error.message ?? "Backend returned HTTP \(http.statusCode).")
            }
            do {
                return try decoder.decode(ChatResponse.self, from: data)
            } catch {
                throw APIError.decoding
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.transport(error.localizedDescription)
        }
    }
}
