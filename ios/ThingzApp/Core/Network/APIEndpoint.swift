import Foundation

enum HTTPMethod: String {
    case GET, POST, DELETE
}

struct APIEndpoint {
    let path: String
    let method: HTTPMethod
    var requiresAuth: Bool = true
    var body: Encodable? = nil
    var customHeaders: [String: String] = [:]

    static let baseURL = "http://localhost:8080"

    var url: URL { URL(string: Self.baseURL + path)! }
}

extension APIEndpoint {
    static func appleLogin(identityToken: String, fullName: String?) -> APIEndpoint {
        APIEndpoint(
            path: "/api/auth/apple",
            method: .POST,
            requiresAuth: false,
            body: AppleLoginRequest(identityToken: identityToken, fullName: fullName)
        )
    }

    static func refresh(refreshToken: String) -> APIEndpoint {
        APIEndpoint(
            path: "/api/auth/refresh",
            method: .POST,
            requiresAuth: false,
            customHeaders: ["X-Refresh-Token": refreshToken]
        )
    }

    static func logout(refreshToken: String) -> APIEndpoint {
        APIEndpoint(
            path: "/api/auth/logout",
            method: .POST,
            requiresAuth: false,
            customHeaders: ["X-Refresh-Token": refreshToken]
        )
    }

    static func registerDeviceToken(_ token: String) -> APIEndpoint {
        APIEndpoint(
            path: "/api/fo/devices/token",
            method: .POST,
            body: DeviceTokenRequest(token: token)
        )
    }

    static func removeDeviceToken(_ token: String) -> APIEndpoint {
        APIEndpoint(
            path: "/api/fo/devices/token",
            method: .DELETE,
            body: DeviceTokenRequest(token: token)
        )
    }
}
