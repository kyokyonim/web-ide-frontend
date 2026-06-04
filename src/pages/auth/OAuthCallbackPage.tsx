import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';

function readOAuthParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return {
    accessToken: hashParams.get('accessToken') || searchParams.get('accessToken'),
    refreshToken: hashParams.get('refreshToken') || searchParams.get('refreshToken'),
    userId: hashParams.get('userId') || searchParams.get('userId'),
    nickname: hashParams.get('nickname') || searchParams.get('nickname'),
    profileColor: hashParams.get('profileColor') || searchParams.get('profileColor'),
    error: hashParams.get('error') || searchParams.get('error'),
  };
}

export function OAuthCallbackPage() {
  const { theme, basePath } = useTheme();
  const navigate = useNavigate();
  const params = useMemo(() => readOAuthParams(), []);
  const [error, setError] = useState(params.error || '');

  useEffect(() => {
    if (params.error) {
      setError(params.error);
      return;
    }

    if (!params.accessToken || !params.refreshToken || !params.userId) {
      setError('구글 로그인 응답이 올바르지 않습니다.');
      return;
    }

    localStorage.setItem('accessToken', params.accessToken);
    localStorage.setItem('refreshToken', params.refreshToken);
    localStorage.setItem('userId', params.userId);
    if (params.nickname) localStorage.setItem('nickname', params.nickname);
    if (params.profileColor) localStorage.setItem('profileColor', params.profileColor);

    navigate(`${basePath}/projects`, { replace: true });
  }, [basePath, navigate, params]);

  return (
    <Card className="w-full max-w-md" padding>
      <h1 className={`text-xl font-bold ${theme.text}`}>구글 로그인</h1>
      {error ? (
        <>
          <p className="mt-3 text-sm text-red-500">{error}</p>
          <Link to={`${basePath}/login`} className="mt-5 inline-block text-sm text-blue-600 hover:underline">
            로그인으로 돌아가기
          </Link>
        </>
      ) : (
        <p className={`mt-3 text-sm ${theme.textMuted}`}>로그인 처리 중...</p>
      )}
    </Card>
  );
}
