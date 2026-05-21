import Foundation

enum APIClientError: Error {
    case invalidResponse
    case httpError(Int)
    case decodingError(Error)
    case tokenMissing
}

final class APIClient {
    static let shared = APIClient()
    private let session = URLSession.shared
    private let decoder = JSONDecoder()
    private init() {}

    func request<T: Decodable>(_ endpoint: APIEndpoint, as type: T.Type) async throws -> T {
        let data = try await send(endpoint)
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIClientError.decodingError(error)
        }
    }

    func requestVoid(_ endpoint: APIEndpoint) async throws {
        _ = try await send(endpoint)
    }

    private func send(_ endpoint: APIEndpoint) async throws -> Data {
        var request = URLRequest(url: endpoint.url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if endpoint.requiresAuth {
            guard let token = TokenManager.shared.accessToken else {
                throw APIClientError.tokenMissing
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        for (key, value) in endpoint.customHeaders {
            request.setValue(value, forHTTPHeaderField: key)
        }

        if let body = endpoint.body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await session.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw APIClientError.invalidResponse
        }

        if http.statusCode == 401, endpoint.requiresAuth {
            // 토큰 만료 시 재발급 시도
            try await refreshIfNeeded()
            return try await send(endpoint)
        }

        guard (200..<300).contains(http.statusCode) else {
            throw APIClientError.httpError(http.statusCode)
        }

        return data
    }

    private func refreshIfNeeded() async throws {
        guard let refreshToken = TokenManager.shared.refreshToken else {
            TokenManager.shared.clear()
            throw APIClientError.tokenMissing
        }
        let dto = try await request(.refresh(refreshToken: refreshToken), as: TokenDto.self)
        TokenManager.shared.save(dto)
    }
}
