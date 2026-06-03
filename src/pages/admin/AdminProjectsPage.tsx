import { useEffect, useState } from 'react';
import {
  getAdminProjectDetail,
  getAdminProjects,
  type AdminProject,
  type AdminProjectDetail,
  type AdminProjectMemberRole,
} from '../../api/adminProjects';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useTheme } from '../../context/ThemeContext';
import type { UserRole } from '../../types';

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '-';
  return date.toLocaleString('ko-KR');
}

function roleBadgeVariant(role: AdminProjectMemberRole): UserRole {
  return role.toLowerCase() as UserRole;
}

export function AdminProjectsPage() {
  const { theme } = useTheme();
  const [detailOpen, setDetailOpen] = useState(false);
  const [projectDetail, setProjectDetail] = useState<AdminProjectDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getAdminProjects();
        if (active) setProjects(response.data);
      } catch (err) {
        console.error(err);
        if (active) {
          setError(err instanceof Error ? err.message : '프로젝트 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const openProjectDetail = async (projectId: number) => {
    setDetailOpen(true);
    setProjectDetail(null);
    setDetailLoading(true);
    setDetailError('');

    try {
      const response = await getAdminProjectDetail(projectId);
      setProjectDetail(response.data);
    } catch (err) {
      console.error(err);
      setDetailError(err instanceof Error ? err.message : '프로젝트 상세 정보를 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>프로젝트 관리</h1>
        <p className={`text-sm ${theme.textMuted}`}>전체 프로젝트 목록 및 상세 정보</p>
      </div>

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b text-left text-xs ${theme.border} ${theme.textMuted}`}>
              <th className="p-4">프로젝트명</th>
              <th className="p-4">참여자</th>
              <th className="p-4">언어</th>
              <th className="p-4">최근 수정</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className={`p-8 text-center ${theme.textMuted}`}>
                  프로젝트 목록을 불러오는 중...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && projects.length === 0 && (
              <tr>
                <td colSpan={5} className={`p-8 text-center ${theme.textMuted}`}>
                  등록된 프로젝트가 없습니다.
                </td>
              </tr>
            )}
            {!loading && !error && projects.map((p) => (
              <tr key={p.id} className={`border-b ${theme.border}`}>
                <td className={`p-4 font-medium ${theme.text}`}>{p.projectName}</td>
                <td className={`p-4 ${theme.textMuted}`}>{p.memberCount}명</td>
                <td className={`p-4 ${theme.textMuted}`}>{p.language}</td>
                <td className={`p-4 ${theme.textMuted}`}>{formatDateTime(p.updatedAt)}</td>
                <td className="p-4">
                  <Button size="sm" variant="secondary" onClick={() => void openProjectDetail(p.id)}>
                    상세 보기
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setProjectDetail(null);
          setDetailError('');
        }}
        title="프로젝트 상세 정보"
        size="xl"
      >
        {detailLoading && <p className={`text-sm ${theme.textMuted}`}>상세 정보를 불러오는 중...</p>}
        {!detailLoading && detailError && <p className="text-sm text-red-500">{detailError}</p>}
        {!detailLoading && !detailError && projectDetail && (
          <>
            <div>
              <h3 className={`mb-3 font-semibold ${theme.text}`}>{projectDetail.projectName}</h3>
              <dl className={`grid gap-2 text-sm md:grid-cols-2 ${theme.textMuted}`}>
                <div><dt className="inline font-medium text-slate-500">소유자: </dt>{projectDetail.ownerName} ({projectDetail.ownerEmail})</div>
                <div><dt className="inline font-medium text-slate-500">참여자: </dt>{projectDetail.memberCount}명</div>
                <div><dt className="inline font-medium text-slate-500">생성일: </dt>{formatDateTime(projectDetail.createdAt)}</div>
                <div><dt className="inline font-medium text-slate-500">최근 수정: </dt>{formatDateTime(projectDetail.updatedAt)}</div>
              </dl>
            </div>
            <div className="mt-6">
              <h3 className={`mb-3 font-semibold ${theme.text}`}>참여자 및 권한</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${theme.border} ${theme.textMuted}`}>
                    <th className="pb-2 text-left">이름</th>
                    <th className="pb-2 text-left">이메일</th>
                    <th className="pb-2 text-left">권한</th>
                  </tr>
                </thead>
                <tbody>
                  {projectDetail.members.length === 0 && (
                    <tr>
                      <td colSpan={3} className={`py-6 text-center ${theme.textMuted}`}>
                        참여자가 없습니다.
                      </td>
                    </tr>
                  )}
                  {projectDetail.members.map((member) => (
                    <tr key={member.userId} className={`border-b ${theme.border}`}>
                      <td className={`py-2 ${theme.text}`}>{member.nickname}</td>
                      <td className={`py-2 ${theme.textMuted}`}>{member.email}</td>
                      <td className="py-2">
                        <Badge variant={roleBadgeVariant(member.role)}>{member.role}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
