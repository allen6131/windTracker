import SwiftUI

struct ChatScreen: View {
    @StateObject var viewModel = ChatViewModel()
    @State private var input = ""
    @State private var showingSettings = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                MessageBubble(message: message)
                            }
                            if let response = viewModel.response {
                                ForecastCards(response: response)
                                    .padding(.horizontal)
                            }
                            if viewModel.isLoading {
                                ProgressView("Checking wind and marine data…")
                                    .padding()
                            }
                        }
                        .padding(.vertical)
                    }
                    .onChange(of: viewModel.messages.count) { _, _ in
                        proxy.scrollTo(viewModel.messages.last?.id, anchor: .bottom)
                    }
                }

                if let error = viewModel.errorMessage {
                    HStack {
                        Text(error).font(.footnote).foregroundStyle(.red)
                        Spacer()
                        Button("Retry") { Task { await viewModel.retry() } }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }

                if let clarification = viewModel.response?.clarification, clarification.needed {
                    LocationDisambiguationView(clarification: clarification) { choice in
                        input = choice.label
                        Task { await viewModel.send(input) }
                    }
                    .padding(.horizontal)
                }

                inputBar
            }
            .navigationTitle("Wind AI")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Use current location") { Task { await viewModel.useCurrentLocation() } }
                        .accessibilityLabel("Use current location")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showingSettings = true } label: { Image(systemName: "gearshape") }
                }
            }
            .sheet(isPresented: $showingSettings) { SettingsScreen() }
        }
    }

    private var inputBar: some View {
        HStack(alignment: .bottom) {
            TextField("Ask about wind, waves, tides…", text: $input, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(1...4)
            Button {
                let text = input
                input = ""
                Task { await viewModel.send(text) }
            } label: {
                Image(systemName: "paperplane.fill")
            }
            .disabled(input.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || viewModel.isLoading)
            .accessibilityLabel("Send message")
        }
        .padding()
        .background(.thinMaterial)
    }
}

private struct MessageBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.role == .assistant { bubble; Spacer(minLength: 40) }
            else { Spacer(minLength: 40); bubble }
        }
        .padding(.horizontal)
        .id(message.id)
    }

    private var bubble: some View {
        Text(message.text)
            .font(.body)
            .padding(12)
            .background(message.role == .user ? Color.accentColor : Color(.secondarySystemBackground))
            .foregroundStyle(message.role == .user ? .white : .primary)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}
