import { tokenStorage, isTokenExpired } from "@/lib/auth/token";

const BASE = process.env.NEXT_PUBLIC_API_BASE!;
const AUTH_BASE = BASE.replace(/\/fo$/, "");

interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export async function refreshTokens(): Promise<TokenDto | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${AUTH_BASE}/auth/refresh`, {
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
    await fetch(`${AUTH_BASE}/auth/logout`, {
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

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    return json.message || "";
  } catch {
    return "";
  }
}

export async function signup(email: string, password: string, username: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res) || "회원가입에 실패했습니다.");
  }
}

export async function loginWithEmail(email: string, password: string): Promise<TokenDto> {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res) || "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return res.json() as Promise<TokenDto>;
}
