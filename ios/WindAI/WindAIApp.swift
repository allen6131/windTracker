import SwiftUI

@main
struct WindAIApp: App {
    @StateObject private var chatViewModel = ChatViewModel()
    @StateObject private var settings = SettingsViewModel()

    var body: some Scene {
        WindowGroup {
            TabView {
                ChatScreen()
                    .environmentObject(chatViewModel)
                    .environmentObject(settings)
                    .tabItem {
                        Label("Chat", systemImage: "message.fill")
                    }

                SettingsScreen()
                    .environmentObject(settings)
                    .tabItem {
                        Label("Settings", systemImage: "gearshape.fill")
                    }
            }
        }
    }
}
