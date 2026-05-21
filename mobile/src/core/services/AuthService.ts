import * as AppleAuthentication from 'expo-apple-authentication';
import { api } from '../network/APIClient';
import TokenManager, { TokenDto } from '../auth/TokenManager';

const AuthService = {
  async signInWithApple() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
      .filter(Boolean).join(' ') || undefined;

    const dto = await api.post<TokenDto>('/api/auth/apple', {
      identityToken: credential.identityToken,
      fullName,
    }, { auth: false });

    await TokenManager.save(dto);
    return dto;
  },

  async logout() {
    const refreshToken = await TokenManager.getRefreshToken();
    if (refreshToken) {
      await api.post('/api/auth/logout', undefined, {
        auth: false,
        headers: { 'X-Refresh-Token': refreshToken },
      });
    }
    await TokenManager.clear();
  },
};

export default AuthService;
