import SwiftUI

struct DataSourcesView: View {
    let sources: [SourceAttribution]
    var body: some View {
        DisclosureGroup("Data sources") {
            ForEach(sources) { source in
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(source.provider) · \(source.dataset)").font(.caption.bold())
                    Text(source.fetchedAt).font(.caption2).foregroundStyle(.secondary)
                    if let station = source.stationName { Text(station).font(.caption2) }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, 2)
            }
            Text("Forecasts are estimates and can change. This app is not a substitute for official marine, aviation, emergency, or local safety guidance.")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}
