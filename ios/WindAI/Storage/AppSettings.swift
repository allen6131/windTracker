import SwiftUI

final class AppSettings: ObservableObject {
    @AppStorage("units") var units: UnitSystem = .imperial
    @AppStorage("defaultActivity") var defaultActivity: String = "general"
}
