import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'thingz.accessToken',
  refreshToken: 'thingz.refreshToken',
};

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

const TokenManager = {
  async save(dto: TokenDto) {
    await SecureStore.setItemAsync(KEYS.accessToken, dto.accessToken);
    await SecureStore.setItemAsync(KEYS.refreshToken, dto.refreshToken);
  },
  async getAccessToken() {
    return SecureStore.getItemAsync(KEYS.accessToken);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(KEYS.refreshToken);
  },
  async isLoggedIn() {
    const token = await SecureStore.getItemAsync(KEYS.accessToken);
    return !!token;
  },
  async clear() {
    await SecureStore.deleteItemAsync(KEYS.accessToken);
    await SecureStore.deleteItemAsync(KEYS.refreshToken);
  },
};

export default TokenManager;
