import Foundation

final class DeviceTokenService {
    static let shared = DeviceTokenService()
    private init() {}

    func register(_ fcmToken: String) async {
        guard TokenManager.shared.isLoggedIn else { return }
        do {
            try await APIClient.shared.requestVoid(.registerDeviceToken(fcmToken))
        } catch {
            print("[DeviceTokenService] register failed: \(error)")
        }
    }

    func remove(_ fcmToken: String) async {
        do {
            try await APIClient.shared.requestVoid(.removeDeviceToken(fcmToken))
        } catch {
            print("[DeviceTokenService] remove failed: \(error)")
        }
    }
}
