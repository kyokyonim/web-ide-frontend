import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { mockMembers } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../../components/ui/Badge';

export function ProjectSettingsPage() {
  const { theme } = useTheme();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>프로젝트 설정</h1>
        <p className={`text-sm ${theme.textMuted}`}>
          프로젝트 정보, 초대 링크, 팀원 권한을 관리할 수 있습니다.
        </p>
      </div>

      <Card>
        <h2 className={`mb-4 font-semibold ${theme.text}`}>프로젝트 기본 정보</h2>
        <div className="space-y-4">
          <Input label="프로젝트 이름" defaultValue="e-commerce-frontend" />
          <div>
            <label className={`mb-2 block text-sm font-medium ${theme.text}`}>언어</label>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded border px-3 py-1 text-sm ${theme.border}`}>
                JAVA <button className={theme.textSubtle}>×</button>
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`font-semibold ${theme.text}`}>팀원 관리</h2>
          <Button size="sm">초대 링크 보내기</Button>
        </div>
        <div className="mb-4 flex gap-2">
          <Input placeholder="siehgolahleg@gmail.com" className="flex-1" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left text-xs ${theme.border} ${theme.textMuted}`}>
                <th className="pb-2 pr-4">이름</th>
                <th className="pb-2 pr-4">이메일</th>
                <th className="pb-2 pr-4">권한</th>
                <th className="pb-2 pr-4">초대 상태</th>
                <th className="pb-2 pr-4">계정 상태</th>
                <th className="pb-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((m, i) => (
                <tr key={i} className={`border-b ${theme.border}`}>
                  <td className={`py-3 pr-4 ${theme.text}`}>{m.name}</td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{m.email}</td>
                  <td className="py-3 pr-4">
                    <select className={`border px-2 py-1 text-xs ${theme.input}`} defaultValue={m.role}>
                      <option>owner</option>
                      <option>editor</option>
                      <option>viewer</option>
                    </select>
                  </td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{m.inviteStatus}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="success">활성</Badge>
                  </td>
                  <td className="py-3">
                    {!m.isMe && (
                      <Button variant="ghost" size="sm">
                        제거
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary">취소</Button>
          <Button>변경 사항 저장</Button>
        </div>
      </Card>

      <Card className={`!border-red-300 ${theme.dangerBg}`}>
        <div className="flex items-start gap-3">
          <Trash2 className="text-red-500" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700">프로젝트 삭제</h3>
            <p className="mt-1 text-sm text-red-600">
              이 작업은 되돌릴 수 없습니다. (프로젝트의 파일, 댓글, 채팅 모두 삭제됩니다.)
            </p>
            <Button variant="danger" size="sm" className="mt-4" onClick={() => setDeleteOpen(true)}>
              프로젝트 삭제
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="프로젝트 삭제"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              아니오
            </Button>
            <Button variant="danger">네</Button>
          </>
        }
      >
        <p className={theme.textMuted}>
          프로젝트를 삭제하면 모든 파일, 팀 정보, 설정이 제거되며 복구할 수 없습니다. 삭제하시겠습니까?
        </p>
      </Modal>
    </div>
  );
}
