import CoreLocation
import Foundation

@MainActor
final class LocationPermissionService: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    @Published var currentCoordinate: Coordinates?
    @Published var errorMessage: String?

    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<Coordinates, Error>?

    override init() {
        super.init()
        manager.delegate = self
        authorizationStatus = manager.authorizationStatus
    }

    func requestCurrentLocation() async throws -> Coordinates {
        authorizationStatus = manager.authorizationStatus
        if authorizationStatus == .notDetermined {
            manager.requestWhenInUseAuthorization()
            return try await withCheckedThrowingContinuation { continuation in
                self.continuation = continuation
            }
        }
        guard authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways else {
            throw LocationError.permissionDenied
        }
        return try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
            manager.requestLocation()
        }
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
        if authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways {
            manager.requestLocation()
        } else if authorizationStatus == .denied || authorizationStatus == .restricted {
            continuation?.resume(throwing: LocationError.permissionDenied)
            continuation = nil
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let coordinate = locations.last?.coordinate else { return }
        let value = Coordinates(lat: coordinate.latitude, lon: coordinate.longitude)
        currentCoordinate = value
        continuation?.resume(returning: value)
        continuation = nil
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        errorMessage = error.localizedDescription
        continuation?.resume(throwing: error)
        continuation = nil
    }
}

enum LocationError: LocalizedError {
    case permissionDenied

    var errorDescription: String? {
        "Location permission is needed only when you tap Use current location."
    }
}
