import XCTest
@testable import WindAI

final class ChatResponseDecodingTests: XCTestCase {
    func testDecodesChatResponse() throws {
        let json = """
        {"conversationId":"c1","assistantMessage":"Looks good","clarification":{"needed":false,"question":null,"choices":[]},"cards":[{"type":"current_conditions","title":"Wind","items":[{"label":"Wind","value":"15 mph"}]}],"timeSeries":[],"sources":[{"provider":"Open-Meteo","dataset":"Forecast API","fetchedAt":"2026-04-26T12:00:00.000Z"}],"warnings":[]}
        """.data(using: .utf8)!
        let response = try JSONDecoder().decode(ChatResponse.self, from: json)
        XCTAssertEqual(response.conversationId, "c1")
        XCTAssertEqual(response.cards.first?.title, "Wind")
    }
}
