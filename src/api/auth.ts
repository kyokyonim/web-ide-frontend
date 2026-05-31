const BASE_URL = 'http://localhost:8080';

export const authApi = {
  // 이메일 로그인
  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // 회원가입
  signup: async (data: {
    email: string;
    password: string;
    agreeService: boolean;
    agreeFinance: boolean;
    agreePrivacy: boolean;
  }) => {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 이메일 중복검사
  checkEmail: async (email: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email?email=${email}`);
    return response.json();
  },

  // 구글 로그인
  googleLogin: () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  },
};

// 토큰 저장
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// 토큰 가져오기
export const getAccessToken = () => localStorage.getItem('accessToken');

// 토큰 삭제
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};