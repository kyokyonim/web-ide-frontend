// 백엔드랑 동신할 때 공통으로 쓰는 fetch 함수
// 백엔드 주소 붙이기 > accessToken Authorization 헤더 붙이기 > JSON 응답 꺼내기 > 예외처리
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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