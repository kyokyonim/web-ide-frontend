import { Camera, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { profileColors } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';

export function ProfilePage() {
  const { theme } = useTheme();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [color, setColor] = useState(profileColors[0]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>프로필 설정</h1>
        <p className={`text-sm ${theme.textMuted}`}>
          나의 프로필 정보와 계정 설정을 관리합니다.
        </p>
      </div>

      <Card>
        <h2 className={`mb-1 font-semibold ${theme.text}`}>프로필</h2>
        <p className={`mb-6 text-xs ${theme.textMuted}`}>
          다른 사람들에게 보이는 모습입니다. 프로필 색상과 닉네임은 실시간으로 동기화됩니다.
        </p>

        <div className="relative mb-6 inline-block">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: color }}
          >
            J
          </div>
          <button className="absolute bottom-0 right-0 rounded-full bg-slate-800 p-1.5 text-white">
            <Camera size={14} />
          </button>
        </div>

        <div className="mb-4">
          <label className={`mb-2 block text-sm font-medium ${theme.text}`}>프로필 색상</label>
          <div className="flex gap-2">
            {profileColors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <Input label="닉네임" defaultValue="jisu" className="flex-1" />
          <Button variant="secondary" size="sm" className="mt-6">
            중복 확인
          </Button>
        </div>
        <p className={`mb-4 text-xs text-green-600`}>사용 가능한 닉네임입니다.</p>

        <Input
          label="이메일"
          defaultValue="sludbot12@google.com"
          readOnly
          hint="로그인 이메일은 변경할 수 없습니다."
        />

        <div className={`mt-6 flex items-center justify-between border-t pt-4 ${theme.border}`}>
          <span className={`text-xs ${theme.textSubtle}`}>마지막 저장 방금 전</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              되돌리기
            </Button>
            <Button size="sm">저장</Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className={`mb-1 font-semibold ${theme.text}`}>비밀번호 변경</h2>
        <p className={`mb-4 text-xs ${theme.textMuted}`}>
          비밀번호를 변경하면 로그인된 다른 기기에서는 자동으로 로그아웃됩니다.
        </p>
        <div className="space-y-4">
          <Input label="현재 비밀번호" type="password" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="새 비밀번호" type="password" />
            <Input label="새 비밀번호 확인" type="password" error="비밀번호가 일치하지 않습니다" />
          </div>
        </div>
        <div className={`mt-6 flex items-center justify-between border-t pt-4 ${theme.border}`}>
          <span className={`text-xs ${theme.textSubtle}`}>마지막 저장 방금 전</span>
          <Button size="sm">비밀번호 변경</Button>
        </div>
      </Card>

      <Card>
        <h2 className={`font-semibold ${theme.text}`}>회원 탈퇴</h2>
        <p className={`mt-2 text-sm ${theme.textMuted}`}>
          계정과 개인 데이터를 영구히 삭제합니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 border-red-300 text-red-600"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 size={14} /> 회원 탈퇴
        </Button>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="정말 탈퇴하시겠습니까?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              아니오
            </Button>
            <Button variant="danger">회원 탈퇴</Button>
          </>
        }
      >
        <p className={theme.textMuted}>
          탈퇴 시 모든 프로젝트 데이터와 개인 정보가 영구 삭제됩니다.
        </p>
      </Modal>
    </div>
  );
}
