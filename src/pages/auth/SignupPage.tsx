import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { signup } from '../../api/auth';

export function SignupPage() {
  const { theme, basePath } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!agreed) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim(), password, nickname.trim());
      navigate(`${basePath}/projects`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg" padding>
      <h1 className={`text-2xl font-bold ${theme.text}`}>회원가입</h1>
      <p className={`mt-2 text-sm ${theme.textMuted}`}>
        초대받은 이메일로 가입하면 해당 초대 링크를 수락할 수 있습니다.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="이메일"
          type="email"
          placeholder="초대받은 이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="닉네임"
          placeholder="화면에 표시될 이름"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상 권장"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="위 비밀번호와 동일하게 입력해주세요"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />

        <label className={`flex items-center gap-2 text-sm font-medium ${theme.text}`}>
          <input
            type="checkbox"
            className="rounded"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          필수 약관에 동의합니다
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <p className={`mt-4 text-center text-sm ${theme.textMuted}`}>
        이미 계정이 있으신가요?{' '}
        <Link to={`${basePath}/login`} className="font-medium text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </Card>
  );
}
