import XCTest
@testable import WindAI

final class SettingsTests: XCTestCase {
    func testSettingsDefaults() {
        let settings = SettingsViewModel()
        XCTAssertEqual(settings.units, .imperial)
        settings.units = .knots
        XCTAssertEqual(settings.units, .knots)
    }
}
