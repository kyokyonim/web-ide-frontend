import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

export function ResetPasswordPage() {
  const { theme, basePath, style } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordError = useMemo(() => {
    if (!password) return '';
    if (!PASSWORD_PATTERN.test(password)) {
      return '영문, 숫자, 특수문자 포함 8~32자로 입력해주세요.';
    }
    return '';
  }, [password]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return '';
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  }, [confirmPassword, password]);

  const canSubmit =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    !passwordError &&
    !confirmPasswordError &&
    !loading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('비밀번호 재설정 토큰이 없습니다. 이메일의 재설정 링크로 다시 접속해주세요.');
      return;
    }

    if (!canSubmit) {
      setError('새 비밀번호와 확인 비밀번호를 다시 확인해주세요.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess('비밀번호가 재설정되었습니다. 로그인 화면으로 이동합니다.');
      window.setTimeout(() => {
        navigate(`${basePath}/login`, { replace: true });
      }, 900);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm font-bold ${theme.primary}`}>
        1
      </div>
      <h1 className={`mt-4 ${figma.typography.h2} ${theme.text}`}>비밀번호 재설정</h1>
      <p className={`mt-2 ${figma.typography.body} ${theme.textMuted}`}>
        인증받은 계정 사용자를 위해 새로운 비밀번호를 설정해 주세요.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <PasswordField
          label="비밀번호"
          value={password}
          visible={showPassword}
          onVisibleChange={setShowPassword}
          onChange={setPassword}
          error={passwordError}
          helper="영문, 숫자, 특수문자를 포함한 8~32자로 입력해주세요."
        />

        <PasswordField
          label="비밀번호 확인"
          value={confirmPassword}
          visible={showConfirmPassword}
          onVisibleChange={setShowConfirmPassword}
          onChange={setConfirmPassword}
          error={confirmPasswordError}
          helper="위 비밀번호와 동일하게 입력해주세요."
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-emerald-600">{success}</p>}

        <Button
          type="submit"
          disabled={!canSubmit}
          className={`w-full ${figma.sizes.buttonHeight} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {loading ? '변경 중...' : '비밀번호 변경하기'}
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

type PasswordFieldProps = {
  label: string;
  value: string;
  visible: boolean;
  helper: string;
  error?: string;
  onChange: (value: string) => void;
  onVisibleChange: (visible: boolean) => void;
};

function PasswordField({
  label,
  value,
  visible,
  helper,
  error,
  onChange,
  onVisibleChange,
}: PasswordFieldProps) {
  const { theme } = useTheme();

  return (
    <div>
      <label className={`mb-1.5 block ${figma.typography.label} ${theme.text}`}>{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full border px-3 py-2.5 pr-10 text-sm outline-none ${theme.input} ${figma.sizes.inputHeight} ${theme.text}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textSubtle}`}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          onClick={() => onVisibleChange(!visible)}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <p className={`mt-1 text-xs ${error ? 'text-red-500' : theme.textSubtle}`}>
        {error || helper}
      </p>
    </div>
  );
}
