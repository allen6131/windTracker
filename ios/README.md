# WindAI iOS

Native SwiftUI iOS 17+ client for the Wind AI Forecast backend.

## Requirements

- Xcode 15+
- iOS 17+
- Backend running at `http://localhost:3000` for simulator testing.

## Architecture

- SwiftUI views in `WindAI/Views`
- MVVM view models in `WindAI/ViewModels`
- Codable backend contract models in `WindAI/Models`
- `URLSession` async/await networking in `WindAI/Services/APIClient.swift`
- `@AppStorage` settings in `WindAI/Storage/AppSettings.swift`
- Core Location permission is requested only when the user taps **Use current location**.

No OpenAI or provider API keys are included in this app. The app only calls the backend.

## Running

Open `WindAI.xcodeproj` in Xcode, set the `API_BASE_URL` Info.plist value if needed, then run the `WindAI` scheme on an iOS 17 simulator or device.

## Tests

Run the `WindAITests` target in Xcode. This Linux VM cannot execute `xcodebuild`, so validation should be performed on macOS.
