import Foundation
import AuthenticationServices

final class AuthService: NSObject {
    static let shared = AuthService()
    private override init() {}

    // MARK: - Apple Login

    func signInWithApple() async throws -> TokenDto {
        let credential = try await requestAppleCredential()
        guard let tokenData = credential.identityToken,
              let identityToken = String(data: tokenData, encoding: .utf8) else {
            throw AuthError.invalidCredential
        }
        let fullName = formatFullName(credential.fullName)
        let dto = try await APIClient.shared.request(
            .appleLogin(identityToken: identityToken, fullName: fullName),
            as: TokenDto.self
        )
        TokenManager.shared.save(dto)
        return dto
    }

    // MARK: - Logout

    func logout() async throws {
        guard let refreshToken = TokenManager.shared.refreshToken else { return }
        try await APIClient.shared.requestVoid(.logout(refreshToken: refreshToken))
        TokenManager.shared.clear()
    }

    // MARK: - Private

    private func requestAppleCredential() async throws -> ASAuthorizationAppleIDCredential {
        try await withCheckedThrowingContinuation { continuation in
            let provider  = ASAuthorizationAppleIDProvider()
            let request   = provider.createRequest()
            request.requestedScopes = [.fullName, .email]

            let controller = ASAuthorizationController(authorizationRequests: [request])
            let delegate   = AppleAuthDelegate(continuation: continuation)
            controller.delegate            = delegate
            controller.presentationContextProvider = delegate
            objc_setAssociatedObject(controller, "delegate", delegate, .OBJC_ASSOCIATION_RETAIN)
            controller.performRequests()
        }
    }

    private func formatFullName(_ components: PersonNameComponents?) -> String? {
        guard let c = components else { return nil }
        return [c.givenName, c.familyName].compactMap { $0 }.joined(separator: " ")
    }
}

enum AuthError: Error {
    case invalidCredential
    case cancelled
}

// ASAuthorizationControllerDelegate 브리지
private final class AppleAuthDelegate: NSObject,
    ASAuthorizationControllerDelegate,
    ASAuthorizationControllerPresentationContextProviding {

    private let continuation: CheckedContinuation<ASAuthorizationAppleIDCredential, Error>

    init(continuation: CheckedContinuation<ASAuthorizationAppleIDCredential, Error>) {
        self.continuation = continuation
    }

    func authorizationController(controller: ASAuthorizationController,
                                 didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            continuation.resume(throwing: AuthError.invalidCredential)
            return
        }
        continuation.resume(returning: credential)
    }

    func authorizationController(controller: ASAuthorizationController,
                                 didCompleteWithError error: Error) {
        if (error as? ASAuthorizationError)?.code == .canceled {
            continuation.resume(throwing: AuthError.cancelled)
        } else {
            continuation.resume(throwing: error)
        }
    }

    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap { $0.windows }
            .first { $0.isKeyWindow }!
    }
}
