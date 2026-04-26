import SwiftUI

struct SettingsScreen: View {
    @StateObject private var viewModel = SettingsViewModel()

    var body: some View {
        NavigationStack {
            Form {
                Section("Forecast preferences") {
                    Picker("Units", selection: $viewModel.units) {
                        Text("Imperial").tag(UnitSystem.imperial)
                        Text("Metric").tag(UnitSystem.metric)
                        Text("Knots").tag(UnitSystem.knots)
                    }
                    Picker("Default activity", selection: $viewModel.defaultActivity) {
                        ForEach(["general", "kitesurfing", "windsurfing", "sailing", "surfing", "fishing", "boating", "paragliding", "hiking"], id: \.self) {
                            Text($0.capitalized).tag($0)
                        }
                    }
                }

                Section("Location") {
                    Text("Location is requested only when you tap Use current location.")
                }

                Section("About and safety") {
                    Text("Data sources: Open-Meteo, NOAA, NWS, and optional backend-configured providers.")
                    Text("Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Settings")
        }
    }
}
