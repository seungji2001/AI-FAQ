import SwiftUI
import FirebaseMessaging

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var isLoggedIn: Bool = TokenManager.shared.isLoggedIn
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil

    func signInWithApple() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            _ = try await AuthService.shared.signInWithApple()
            isLoggedIn = true
        } catch AuthError.cancelled {
            // 사용자가 직접 취소한 경우 에러 미표시
        } catch {
            errorMessage = "로그인에 실패했습니다. 다시 시도해 주세요."
        }
    }

    func logout() async {
        isLoading = true
        defer { isLoading = false }
        do {
            // 로그아웃 전 FCM 토큰 제거
            if let fcmToken = await currentFCMToken() {
                await DeviceTokenService.shared.remove(fcmToken)
            }
            try await AuthService.shared.logout()
            isLoggedIn = false
        } catch {
            errorMessage = "로그아웃 중 오류가 발생했습니다."
        }
    }

    private func currentFCMToken() async -> String? {
        await withCheckedContinuation { continuation in
            import FirebaseMessaging
            Messaging.messaging().token { token, _ in
                continuation.resume(returning: token)
            }
        }
    }
}
