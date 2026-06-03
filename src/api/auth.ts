import { apiFetch } from './client';

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    nickname: string;
    profileColor: string;
    role: 'USER' | 'ADMIN';
  };
};

export async function login(email: string, password: string) {
  const response = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({
      email,
      password,
    }),
  });

  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  localStorage.setItem('userId', String(response.data.userId));
  localStorage.setItem('nickname', response.data.nickname);
  localStorage.setItem('profileColor', response.data.profileColor);
  localStorage.setItem('role', response.data.role);

  return response.data;
}
