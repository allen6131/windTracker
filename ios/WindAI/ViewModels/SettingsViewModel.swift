import Foundation
import SwiftUI

@MainActor
final class SettingsViewModel: ObservableObject {
    @AppStorage("units") var unitsRawValue: String = UnitSystem.imperial.rawValue
    @AppStorage("defaultActivity") var defaultActivity: String = "general"
    @Published var locationPermissionText: String = "Ask when using current location"

    var units: UnitSystem {
        get { UnitSystem(rawValue: unitsRawValue) ?? .imperial }
        set { unitsRawValue = newValue.rawValue }
    }

    let disclaimer = "Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance."
}
