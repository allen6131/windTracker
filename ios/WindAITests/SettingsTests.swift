import XCTest
@testable import WindAI

final class SettingsTests: XCTestCase {
    func testSettingsDefaults() {
        let settings = SettingsViewModel()
        XCTAssertFalse(settings.units.isEmpty)
        settings.units = "knots"
        XCTAssertEqual(settings.units, "knots")
    }
}
