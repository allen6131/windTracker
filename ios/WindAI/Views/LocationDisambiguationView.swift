import SwiftUI

struct LocationDisambiguationView: View {
    let clarification: Clarification
    let onSelect: (LocationChoice) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(clarification.question ?? "Choose a location").font(.headline)
            ForEach(clarification.choices) { choice in
                Button(action: { onSelect(choice) }) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(choice.label).font(.body)
                            Text("\(choice.lat, specifier: "%.3f"), \(choice.lon, specifier: "%.3f")")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                    }
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16))
        .accessibilityElement(children: .contain)
    }
}
