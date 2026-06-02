import { Eye } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import { login } from '../../api/auth';

export function LoginPage() {
  const { theme, basePath, style } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('owner1@test.com');
  const [password, setPassword] = useState('Test1234!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(`${basePath}/projects`);
    } catch (err) {
      console.error(err);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={`${figma.typography.h1} ${theme.text}`}>Hello World</h1>
      <p className={`mt-2 ${figma.typography.body} ${theme.textMuted}`}>
        Please login to use EFIDE Studio.
      </p>

      <button
        type="button"
        className={`mt-8 flex ${figma.sizes.inputHeight} w-full items-center justify-center gap-2 border font-medium transition ${theme.border} ${theme.radius} ${theme.text} hover:opacity-90`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google Login
      </button>

      <div className={`my-8 flex items-center gap-4 ${figma.typography.caption} ${theme.textSubtle}`}>
        <div className={`h-px flex-1 border-t ${theme.border}`} />
        or login with email address
        <div className={`h-px flex-1 border-t ${theme.border}`} />
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={figma.sizes.inputHeight}
        />

        <div>
          <label className={`mb-1.5 block ${figma.typography.label} ${theme.text}`}>Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border px-3 py-2.5 pr-10 text-sm outline-none ${theme.input} ${figma.sizes.inputHeight} ${theme.text}`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSubtle}`}
              aria-label="비밀번호 표시"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="text-right">
          <Link
            to={`${basePath}/reset-password`}
            className={`${figma.typography.caption} text-[#0969DA] hover:underline ${style === 'saas' ? '!text-[#4F46E5]' : ''}`}
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${figma.sizes.buttonHeight}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className={`mt-8 text-center ${figma.typography.body} ${theme.textMuted}`}>
        Don&apos;t have an account?{' '}
        <Link
          to={`${basePath}/signup`}
          className={`font-semibold hover:underline ${style === 'saas' ? 'text-[#4F46E5]' : 'text-[#0969DA]'}`}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
