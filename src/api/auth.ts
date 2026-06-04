import { apiFetch } from './client';

type AuthResponse = {
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

type CheckEmailResponse = {
  success: boolean;
  message: string;
  data: {
    available: boolean;
  };
};

type SignupPayload = {
  email: string;
  password: string;
  agreeService: boolean;
  agreeFinance: boolean;
  agreePrivacy: boolean;
};

function storeAuthData(data: AuthResponse['data']) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', String(data.userId));
  localStorage.setItem('nickname', data.nickname);
  localStorage.setItem('profileColor', data.profileColor);
}

export async function login(email: string, password: string) {
  const response = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({
      email,
      password,
    }),
  });

  storeAuthData(response.data);

  return response.data;
}

export function checkEmail(email: string) {
  const query = new URLSearchParams({ email });
  return apiFetch<CheckEmailResponse>(`/api/auth/check-email?${query.toString()}`, {
    method: 'GET',
    auth: false,
  });
}

export async function signup(email: string, password: string, _nickname?: string) {
  await signupOnly({
    email,
    password,
    agreeService: true,
    agreeFinance: true,
    agreePrivacy: true,
  });

  return login(email, password);
}

export function signupOnly(payload: SignupPayload) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });
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
