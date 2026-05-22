import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../context/ThemeContext';

export function SignupPage() {
  const { theme, basePath } = useTheme();

  return (
    <Card className="w-full max-w-lg" padding>
      <h1 className={`text-2xl font-bold ${theme.text}`}>회원가입</h1>
      <p className={`mt-2 text-sm ${theme.textMuted}`}>
        EFIDE Studio를 이용하려면 회원가입하세요.
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-2">
          <Input label="이메일" placeholder="이메일을 입력해주세요" className="flex-1" />
          <Button variant="secondary" size="sm" className="mt-6 shrink-0">
            중복검사
          </Button>
        </div>
        <Input
          label="비밀번호"
          type="password"
          placeholder="특수문자, 숫자가 포함된 8~32자 이내"
          error="*비밀번호는 영어, 특수문자, 숫자가 포함된 8~32자 이내여야 합니다."
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="위 비밀번호와 동일하게 입력해주세요"
        />

        <div className={`rounded border p-4 ${theme.border}`}>
          <label className={`flex items-center gap-2 text-sm font-medium ${theme.text}`}>
            <input type="checkbox" className="rounded" /> 전체 동의하기
          </label>
          <div className={`mt-3 max-h-24 overflow-auto rounded border p-3 text-xs ${theme.border} ${theme.textMuted}`}>
            [필수] 서비스 이용 약관 — EFIDE Studio 서비스 이용에 관한 약관 내용입니다...
          </div>
          <label className={`mt-2 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input type="checkbox" /> [필수] 서비스 이용 약관
          </label>
          <label className={`mt-1 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input type="checkbox" /> [필수] 전자금융거래 이용약관
          </label>
          <label className={`mt-1 flex items-center gap-2 text-xs ${theme.textMuted}`}>
            <input type="checkbox" /> [선택] 개인정보 처리방침
          </label>
        </div>

        <Button className="w-full">회원가입</Button>
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
