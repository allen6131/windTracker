import XCTest
@testable import WindAI

final class ChatViewModelTests: XCTestCase {
    func testInitialState() {
        let viewModel = ChatViewModel(apiClient: APIClient(baseURL: URL(string: "http://localhost:3000")!))
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertEqual(viewModel.messages.count, 1)
    }
}
