import TokenManager, { TokenDto } from '../auth/TokenManager';

const BASE_URL = 'http://192.168.0.160:8080';

type Method = 'GET' | 'POST' | 'DELETE';

async function request<T>(
  method: Method,
  path: string,
  options: { body?: object; headers?: Record<string, string>; auth?: boolean } = {}
): Promise<T> {
  const { body, headers = {}, auth = true } = options;

  if (auth) {
    const token = await TokenManager.getAccessToken();
    if (!token) throw new Error('TOKEN_MISSING');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    await refreshTokens();
    return request(method, path, options);
  }

  if (!res.ok) throw new Error(`HTTP_${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function refreshTokens() {
  const refreshToken = await TokenManager.getRefreshToken();
  if (!refreshToken) { await TokenManager.clear(); throw new Error('TOKEN_MISSING'); }

  const dto: TokenDto = await request('POST', '/api/auth/refresh', {
    auth: false,
    headers: { 'X-Refresh-Token': refreshToken },
  });
  await TokenManager.save(dto);
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body?: object, opts?: { auth?: boolean; headers?: Record<string, string> }) =>
    request<T>('POST', path, { body, ...opts }),
  put:    <T>(path: string, body?: object) => request<T>('PUT', path, { body }),
  patch:  <T>(path: string, body?: object) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string, body?: object) => request<T>('DELETE', path, { body }),
};
