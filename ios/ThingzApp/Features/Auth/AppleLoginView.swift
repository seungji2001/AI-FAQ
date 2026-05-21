import SwiftUI
import AuthenticationServices

struct AppleLoginView: View {
    @StateObject private var vm = AuthViewModel()

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "circle.hexagongrid.fill")
                .font(.system(size: 72))
                .foregroundStyle(.primary)

            Text("Thingz")
                .font(.largeTitle.bold())

            Spacer()

            if vm.isLoading {
                ProgressView()
            } else {
                SignInWithAppleButton(.signIn) { request in
                    request.requestedScopes = [.fullName, .email]
                } onCompletion: { _ in
                    // ASAuthorizationController는 AuthService 내부에서 관리
                }
                .signInWithAppleButtonStyle(.black)
                .frame(height: 50)
                .padding(.horizontal, 32)
                .onTapGesture {
                    Task { await vm.signInWithApple() }
                }
            }

            if let error = vm.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
                    .font(.caption)
            }

            Spacer().frame(height: 40)
        }
        .fullScreenCover(isPresented: $vm.isLoggedIn) {
            // 로그인 후 메인 화면으로 교체
            Text("메인 화면")
        }
    }
}
