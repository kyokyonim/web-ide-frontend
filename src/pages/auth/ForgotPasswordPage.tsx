import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import { apiFetch } from '../../api/client';

export function ForgotPasswordPage() {
  const { theme, basePath, style } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email }),
      });
      setSuccess('비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요!');
    } catch (err: any) {
      setError(err.message || '이메일 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={`${figma.typography.h1} ${theme.text}`}>비밀번호 찾기</h1>
      <p className={`mt-2 ${figma.typography.body} ${theme.textMuted}`}>
        가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className={`mb-1.5 block ${figma.typography.label} ${theme.text}`}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className={`w-full border px-3 py-2.5 text-sm outline-none ${theme.input} ${figma.sizes.inputHeight} ${theme.text}`}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-emerald-600">{success}</p>}

        <Button
          type="submit"
          disabled={loading || !email}
          className={`w-full ${figma.sizes.buttonHeight}`}
        >
          {loading ? '발송 중...' : '재설정 링크 보내기'}
        </Button>
      </form>

      <div className={`mt-5 text-center ${figma.typography.caption}`}>
        <Link
          to={`${basePath}/login`}
          className={`font-medium hover:underline ${style === 'saas' ? 'text-[#4F46E5]' : 'text-[#0969DA]'}`}
        >
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </div>
  );
}