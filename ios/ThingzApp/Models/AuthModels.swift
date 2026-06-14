import Foundation

struct TokenDto: Codable {
    let accessToken: String
    let refreshToken: String
}

struct AppleLoginRequest: Encodable {
    let identityToken: String
    let fullName: String?
}

struct DeviceTokenRequest: Encodable {
    let token: String
    let platform: String = "ios"
}

struct APIError: Decodable, Error {
    let message: String
}
