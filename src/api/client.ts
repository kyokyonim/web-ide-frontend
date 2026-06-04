// 백엔드랑 통신할 때 공통으로 쓰는 fetch 함수
// 로컬은 localhost:8080, 배포는 Vercel rewrite를 통해 같은 origin의 /api로 요청한다.
const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE_URL =
  import.meta.env.PROD && configuredApiBaseUrl.startsWith('http://')
    ? ''
    : configuredApiBaseUrl || (import.meta.env.PROD ? '' : 'http://localhost:8080');

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth !== false && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'API 요청에 실패했습니다.');
  }

  return data as T;
}
