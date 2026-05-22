import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { mockAdminUsers } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';

export function UserManagementPage() {
  const { theme } = useTheme();
  const [menuUser, setMenuUser] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text}`}>사용자 관리</h1>
          <p className={`text-sm ${theme.textMuted}`}>최근 업데이트 : 2026.05.12 08:30:45</p>
        </div>
        <Button variant="secondary" size="sm">
          <RefreshCw size={14} /> 새로고침
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <Select
            label="사용자 분류"
            options={[
              { value: 'all', label: '전체' },
              { value: 'new', label: '신규' },
            ]}
          />
          <Select
            label="계정 상태"
            options={[
              { value: 'all', label: '전체' },
              { value: 'active', label: '활성' },
              { value: 'suspended', label: '정지' },
            ]}
          />
          <div className="flex flex-1 gap-2 min-w-[240px]">
            <input
              placeholder="닉네임 또는 이메일 검색"
              className={`flex-1 border px-3 py-2 text-sm ${theme.input}`}
            />
            <Button size="sm">검색</Button>
          </div>
        </div>
        <p className={`mb-4 text-sm ${theme.textMuted}`}>총 1,248명</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left text-xs ${theme.border} ${theme.textMuted}`}>
                <th className="pb-3 pr-4">사용자 ID</th>
                <th className="pb-3 pr-4">닉네임</th>
                <th className="pb-3 pr-4">이메일</th>
                <th className="pb-3 pr-4">계정 상태</th>
                <th className="pb-3 pr-4">가입일</th>
                <th className="pb-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {mockAdminUsers.map((u) => (
                <tr key={u.id} className={`border-b ${theme.border}`}>
                  <td className={`py-3 pr-4 font-mono text-xs ${theme.text}`}>{u.id}</td>
                  <td className={`py-3 pr-4 ${theme.text}`}>{u.nickname}</td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{u.email}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                      {u.status === 'active' ? '활성' : '정지'}
                    </Badge>
                  </td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{u.joinDate}</td>
                  <td className="relative py-3">
                    <button
                      onClick={() => setMenuUser(menuUser === u.id ? null : u.id)}
                      className={`rounded p-1 ${theme.textMuted} hover:opacity-70`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuUser === u.id && (
                      <div className={`absolute right-0 z-10 mt-1 w-36 rounded border py-1 shadow-lg ${theme.modal} ${theme.border}`}>
                        <button
                          className={`block w-full px-3 py-2 text-left text-xs hover:opacity-80 ${theme.text}`}
                          onClick={() => {
                            setConfirmOpen(true);
                            setMenuUser(null);
                          }}
                        >
                          {u.status === 'active' ? '계정 정지' : '계정 활성화'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`mt-6 flex justify-center gap-1 text-sm ${theme.textMuted}`}>
          <button className="px-2">&lt;</button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`h-8 w-8 rounded ${n === 1 ? theme.primary : ''}`}
            >
              {n}
            </button>
          ))}
          <span className="px-2">...</span>
          <button className="h-8 w-8 rounded">125</button>
          <button className="px-2">&gt;</button>
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="사용자 이용 제한"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              아니오
            </Button>
            <Button variant="danger">네</Button>
          </>
        }
      >
        <p className={theme.textMuted}>
          해당 사용자의 계정을 정지하시겠습니까? 정지 시 사용자는 서비스 이용 및 로그인이 제한됩니다.
        </p>
      </Modal>
    </div>
  );
}
