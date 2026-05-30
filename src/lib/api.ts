type ParseAs = 'json' | 'text' | 'void';

interface ApiRequestOptions extends RequestInit {
  parseAs?: ParseAs;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function toApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!API_BASE_URL) return path;

  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { parseAs = 'json', headers, ...requestOptions } = options;
  const response = await fetch(toApiUrl(path), {
    ...requestOptions,
    headers: {
      Accept: parseAs === 'json' ? 'application/json' : 'text/plain',
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (parseAs === 'void') return undefined as T;
  if (parseAs === 'text') return response.text() as Promise<T>;

  return response.json() as Promise<T>;
}

export function getBackendHello() {
  return apiRequest<string>('/api/v1/hello', { parseAs: 'text' });
}
