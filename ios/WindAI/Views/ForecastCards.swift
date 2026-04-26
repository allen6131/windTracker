import SwiftUI

struct ForecastCards: View {
    let cards: [ForecastCard]
    let sources: [SourceAttribution]
    let warnings: [String]

    var body: some View {
        VStack(spacing: 12) {
            ForEach(cards) { card in
                ForecastCardView(card: card)
            }

            if !sources.isEmpty {
                DisclosureGroup("Data sources") {
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(sources) { source in
                            Text("\(source.provider) · \(source.dataset) · \(source.fetchedAt)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    .padding(.top, 8)
                }
                .font(.footnote)
                .padding()
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 14))
            }

            if !warnings.isEmpty {
                Text("Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

struct ForecastCardView: View {
    let card: ForecastCard

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            VStack(alignment: .leading, spacing: 2) {
                Text(card.title)
                    .font(.headline)
                if let subtitle = card.subtitle {
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }

            ForEach(card.items) { item in
                HStack(alignment: .top) {
                    Text(item.label)
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text(item.value)
                        .multilineTextAlignment(.trailing)
                        .foregroundStyle(color(for: item.severity))
                }
                .font(.body)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18))
        .accessibilityElement(children: .combine)
    }

    private func color(for severity: CardSeverity?) -> Color {
        switch severity {
        case .warning: return .red
        case .watch: return .orange
        default: return .primary
        }
    }
}
