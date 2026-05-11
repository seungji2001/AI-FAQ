const ACCESS_TOKEN_KEY = "thingz_access_token";
const REFRESH_TOKEN_KEY = "thingz_refresh_token";

export const tokenStorage = {
  getAccessToken: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,

  getRefreshToken: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clear: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

interface JwtPayload {
  sub: string;
  username: string;
  exp: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getUserFromToken(token: string): { userId: string; username: string } | null {
  const payload = parseJwt(token);
  if (!payload) return null;
  return { userId: payload.sub, username: payload.username };
}
