import { tokenStorage, isTokenExpired } from "@/lib/auth/token";

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export async function refreshTokens(): Promise<TokenDto | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "X-Refresh-Token": refreshToken },
  });

  if (!res.ok) {
    tokenStorage.clear();
    return null;
  }

  const data: TokenDto = await res.json();
  tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (refreshToken) {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      headers: { "X-Refresh-Token": refreshToken },
    }).catch(() => {});
  }
  tokenStorage.clear();
}

export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) return null;
  if (!isTokenExpired(accessToken)) return accessToken;

  const refreshed = await refreshTokens();
  return refreshed?.accessToken ?? null;
}

export function getKakaoLoginUrl(): string {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"}/oauth2/authorization/kakao`;
}
