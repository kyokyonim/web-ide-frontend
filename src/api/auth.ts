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

  return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
  return apiFetch('/api/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });
}

export function clearAuthStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('nickname');
  localStorage.removeItem('profileColor');
}

export async function logout() {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  } finally {
    clearAuthStorage();
  }
}
