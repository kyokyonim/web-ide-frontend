import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteProject,
  getProject,
  getProjectMembers,
  removeProjectMember,
  sendProjectInvite,
  updateProject,
  updateProjectMemberRole,
  type BackendProject,
  type BackendProjectMember,
  type ProjectLanguage,
  type ProjectRole,
} from '../../api/projects';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useTheme } from '../../context/ThemeContext';
import type { UserRole } from '../../types';

const languageOptions: { value: ProjectLanguage; label: string }[] = [
  { value: 'JAVA', label: 'JAVA' },
  { value: 'JAVASCRIPT', label: 'JAVASCRIPT' },
  { value: 'PYTHON', label: 'PYTHON' },
];

const editableRoleOptions: { value: Exclude<ProjectRole, 'OWNER'>; label: string }[] = [
  { value: 'EDITOR', label: 'editor' },
  { value: 'VIEWER', label: 'viewer' },
];

function getCurrentUserId() {
  const storedUserId = localStorage.getItem('userId');
  return storedUserId ? Number(storedUserId) : null;
}

function toUserRole(role?: string): UserRole {
  const lower = role?.toLowerCase();
  if (lower === 'owner') return 'owner';
  if (lower === 'editor') return 'editor';
  return 'viewer';
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('ko-KR');
}

export function ProjectSettingsPage() {
  const { theme, basePath } = useTheme();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [project, setProject] = useState<BackendProject | null>(null);
  const [members, setMembers] = useState<BackendProjectMember[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<number, ProjectRole>>({});
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState<ProjectLanguage>('JAVA');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Exclude<ProjectRole, 'OWNER'>>('VIEWER');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const currentMember = useMemo(
    () => members.find((member) => member.userId === currentUserId),
    [currentUserId, members]
  );

  const loadSettings = useCallback(async () => {
    if (!projectId || currentUserId == null) {
      setAccessDenied(true);
      setError('프로젝트 설정을 확인할 수 없습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setNotice('');

    try {
      const [projectResponse, memberResponse] = await Promise.all([
        getProject(projectId),
        getProjectMembers(projectId),
      ]);
      const nextMembers = memberResponse.data;
      const me = nextMembers.find((member) => member.userId === currentUserId);

      setProject(projectResponse.data);
      setMembers(nextMembers);
      setSelectedRoles(
        Object.fromEntries(nextMembers.map((member) => [member.memberId, member.role]))
      );
      setProjectName(projectResponse.data.projectName ?? projectResponse.data.name ?? '');
      setLanguage(projectResponse.data.language ?? 'JAVA');
      setAccessDenied(me?.role !== 'OWNER');
    } catch (err) {
      console.error(err);
      setError('프로젝트 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, projectId]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const hasProjectChanges =
    project != null &&
    (projectName.trim() !== (project.projectName ?? project.name ?? '') ||
      language !== project.language);

  const changedRoleMembers = members.filter((member) => {
    const nextRole = selectedRoles[member.memberId];
    return member.role !== 'OWNER' && nextRole !== undefined && nextRole !== member.role;
  });

  const handleSave = async () => {
    if (!projectId || !project) return;

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const requests: Promise<unknown>[] = [];

      if (hasProjectChanges) {
        requests.push(updateProject(projectId, { projectName: trimmedName, language }));
      }

      changedRoleMembers.forEach((member) => {
        const nextRole = selectedRoles[member.memberId];
        if (nextRole === 'EDITOR' || nextRole === 'VIEWER') {
          requests.push(updateProjectMemberRole(projectId, member.memberId, nextRole));
        }
      });

      if (requests.length === 0) {
        setNotice('변경된 내용이 없습니다.');
        return;
      }

      await Promise.all(requests);
      setNotice('변경 사항을 저장했습니다.');
      await loadSettings();
    } catch (err) {
      console.error(err);
      setError('변경 사항 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;

    const email = inviteEmail.trim();
    if (!email) {
      setError('초대할 이메일을 입력해주세요.');
      return;
    }

    setInviteSending(true);
    setError('');
    setNotice('');

    try {
      const response = await sendProjectInvite(projectId, email, inviteRole);
      setInviteEmail('');
      setNotice(
        response.data.inviteUrl
          ? `초대 링크를 생성했습니다. 메일 설정이 정상이라면 메일도 발송됩니다: ${response.data.inviteUrl}`
          : '초대 요청을 보냈습니다.'
      );
    } catch (err) {
      console.error(err);
      setError('초대 링크 발송에 실패했습니다.');
    } finally {
      setInviteSending(false);
    }
  };

  const handleRemoveMember = async (member: BackendProjectMember) => {
    if (!projectId || member.role === 'OWNER') return;
    if (!window.confirm(`${member.nickname}님을 프로젝트에서 제거할까요?`)) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      await removeProjectMember(projectId, member.memberId);
      setNotice('팀원을 제거했습니다.');
      await loadSettings();
    } catch (err) {
      console.error(err);
      setError('팀원 제거에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    setSaving(true);
    setError('');

    try {
      await deleteProject(projectId);
      navigate(`${basePath}/projects`, { replace: true });
    } catch (err) {
      console.error(err);
      setError('프로젝트 삭제에 실패했습니다.');
      setSaving(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <p className={theme.textMuted}>프로젝트 설정을 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <h1 className={`text-xl font-bold ${theme.text}`}>프로젝트 설정 권한이 없습니다</h1>
          <p className={`mt-2 text-sm ${theme.textMuted}`}>
            프로젝트 설정은 OWNER만 관리할 수 있습니다.
          </p>
          <div className="mt-5">
            <Link to={`${basePath}/projects`}>
              <Button variant="secondary">프로젝트 목록으로</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>프로젝트 설정</h1>
        <p className={`text-sm ${theme.textMuted}`}>
          {project?.projectName ?? project?.name ?? '프로젝트'} · OWNER 전용 설정
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {notice && <p className={`text-sm ${theme.success}`}>{notice}</p>}

      <Card>
        <h2 className={`mb-4 font-semibold ${theme.text}`}>프로젝트 기본 정보</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <Input
            label="프로젝트 이름"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
          <Select
            label="언어"
            value={language}
            onChange={(event) => setLanguage(event.target.value as ProjectLanguage)}
            options={languageOptions}
          />
        </div>
        <div className={`mt-4 flex flex-wrap gap-4 text-xs ${theme.textMuted}`}>
          <span>소유자 {project?.ownerNickname ?? '-'}</span>
          <span>생성 {formatDate(project?.createdAt)}</span>
          <span>수정 {formatDate(project?.updatedAt)}</span>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`font-semibold ${theme.text}`}>팀원 관리</h2>
            <p className={`text-xs ${theme.textMuted}`}>
              실제 프로젝트 참여자 {members.length}명
            </p>
          </div>
          {currentMember && (
            <Badge variant={toUserRole(currentMember.role)}>
              내 권한 {toUserRole(currentMember.role)}
            </Badge>
          )}
        </div>

        <form className="mb-4 grid gap-2 sm:grid-cols-[1fr_140px_auto]" onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="초대할 이메일"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
          />
          <Select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as Exclude<ProjectRole, 'OWNER'>)}
            options={editableRoleOptions}
          />
          <Button type="submit" disabled={inviteSending}>
            {inviteSending ? '발송 중...' : '초대 링크 보내기'}
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left text-xs ${theme.border} ${theme.textMuted}`}>
                <th className="pb-2 pr-4">이름</th>
                <th className="pb-2 pr-4">이메일</th>
                <th className="pb-2 pr-4">권한</th>
                <th className="pb-2 pr-4">상태</th>
                <th className="pb-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const isOwner = member.role === 'OWNER';
                const isMe = member.userId === currentUserId;

                return (
                  <tr key={member.memberId} className={`border-b ${theme.border}`}>
                    <td className={`py-3 pr-4 ${theme.text}`}>
                      {member.nickname}
                      {isMe && <span className={theme.textMuted}> (나)</span>}
                    </td>
                    <td className={`py-3 pr-4 ${theme.textMuted}`}>{member.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        className={`border px-2 py-1 text-xs ${theme.input}`}
                        value={selectedRoles[member.memberId] ?? member.role}
                        onChange={(event) =>
                          setSelectedRoles((prev) => ({
                            ...prev,
                            [member.memberId]: event.target.value as ProjectRole,
                          }))
                        }
                        disabled={isOwner || saving}
                      >
                        {isOwner && <option value="OWNER">owner</option>}
                        {editableRoleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant="success">참여 중</Badge>
                    </td>
                    <td className="py-3">
                      {!isOwner && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={saving}
                          onClick={() => void handleRemoveMember(member)}
                        >
                          제거
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className={`py-8 text-center ${theme.textMuted}`}>
                    참여 중인 팀원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Link to={`${basePath}/projects`}>
            <Button type="button" variant="secondary">
              취소
            </Button>
          </Link>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || (!hasProjectChanges && changedRoleMembers.length === 0)}
          >
            {saving ? '저장 중...' : '변경 사항 저장'}
          </Button>
        </div>
      </Card>

      <Card className={`!border-red-300 ${theme.dangerBg}`}>
        <div className="flex items-start gap-3">
          <Trash2 className="text-red-500" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700">프로젝트 삭제</h3>
            <p className="mt-1 text-sm text-red-600">
              이 작업은 되돌릴 수 없습니다. 프로젝트의 파일, 댓글, 채팅 모두 삭제됩니다.
            </p>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="mt-4"
              onClick={() => setDeleteOpen(true)}
            >
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
            <Button variant="danger" disabled={saving} onClick={() => void handleDeleteProject()}>
              네
            </Button>
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
