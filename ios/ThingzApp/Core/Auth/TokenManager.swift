import Foundation

final class TokenManager {
    static let shared = TokenManager()
    private init() {}

    var accessToken: String? {
        get { KeychainManager.shared.load(for: .accessToken) }
        set {
            if let token = newValue {
                KeychainManager.shared.save(token, for: .accessToken)
            } else {
                KeychainManager.shared.delete(for: .accessToken)
            }
        }
    }

    var refreshToken: String? {
        get { KeychainManager.shared.load(for: .refreshToken) }
        set {
            if let token = newValue {
                KeychainManager.shared.save(token, for: .refreshToken)
            } else {
                KeychainManager.shared.delete(for: .refreshToken)
            }
        }
    }

    var isLoggedIn: Bool { accessToken != nil }

    func save(_ dto: TokenDto) {
        accessToken  = dto.accessToken
        refreshToken = dto.refreshToken
    }

    func clear() {
        KeychainManager.shared.clearAll()
    }
}
