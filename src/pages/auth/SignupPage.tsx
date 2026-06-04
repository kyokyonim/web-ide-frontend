import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { checkEmail, signupOnly } from '../../api/auth';

export function SignupPage() {
  const { theme, basePath } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeService, setAgreeService] = useState(false);
  const [agreeFinance, setAgreeFinance] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreeFinance(checked);
    setAgreePrivacy(checked);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailChecked(false);
    setEmailError('');
  };

  const handleCheckEmail = async () => {
    const trimmedEmail = email.trim();
    setError('');

    if (!trimmedEmail) {
      setEmailChecked(false);
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    setEmailChecking(true);
    try {
      const result = await checkEmail(trimmedEmail);
      if (result.data.available) {
        setEmailChecked(true);
        setEmailError('사용 가능한 이메일입니다.');
      } else {
        setEmailChecked(false);
        setEmailError('이미 사용 중인 이메일입니다.');
      }
    } catch (err) {
      console.error(err);
      setEmailChecked(false);
      setEmailError(
        err instanceof Error ? err.message : '이메일 중복검사에 실패했습니다.',
      );
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!emailChecked) {
      setError('이메일 중복검사를 해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreeService || !agreeFinance) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    try {
      await signupOnly({
        email: email.trim(),
        password,
        agreeService,
        agreeFinance,
        agreePrivacy,
      });
      navigate(`${basePath}/login`);
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
        EFIDE Studio를 이용하려면 회원가입하세요.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSignup}>
        <div className="flex gap-2">
          <Input
            label="이메일"
            placeholder="이메일을 입력해주세요"
            className="flex-1"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-6 shrink-0"
            type="button"
            onClick={() => void handleCheckEmail()}
            disabled={emailChecking || !email.trim()}
          >
            {emailChecking ? '확인 중...' : '중복검사'}
          </Button>
        </div>
        {emailError && (
          <p className={`text-xs ${emailChecked ? 'text-green-500' : 'text-red-500'}`}>
            {emailError}
          </p>
        )}
        <Input
          label="비밀번호"
          type="password"
          placeholder="특수문자, 숫자가 포함된 8~32자 이내"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error="*비밀번호는 영어, 특수문자, 숫자가 포함된 8~32자 이내여야 합니다."
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="위 비밀번호와 동일하게 입력해주세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <div className={`rounded border p-4 ${theme.border}`}>
          <label className={`flex items-center gap-2 text-sm font-medium ${theme.text}`}>
            <input
              type="checkbox"
              className="rounded"
              checked={agreeAll}
              onChange={(e) => handleAgreeAll(e.target.checked)}
            />{' '}
            전체 동의하기
          </label>
          <div className={`mt-3 max-h-24 overflow-auto rounded border p-3 text-xs ${theme.border} ${theme.textMuted}`}>
            [필수] 서비스 이용 약관 — EFIDE Studio 서비스 이용에 관한 약관 내용입니다...
          </div>
          <label className={`mt-2 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input
              type="checkbox"
              checked={agreeService}
              onChange={(e) => setAgreeService(e.target.checked)}
            />{' '}
            [필수] 서비스 이용 약관
          </label>
          <label className={`mt-1 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input
              type="checkbox"
              checked={agreeFinance}
              onChange={(e) => setAgreeFinance(e.target.checked)}
            />{' '}
            [필수] 전자금융거래 이용약관
          </label>
          <label className={`mt-1 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />{' '}
            [선택] 개인정보 처리방침
          </label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="w-full" disabled={loading || emailChecking}>
          {loading ? '회원가입 중...' : '회원가입'}
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
