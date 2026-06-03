import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useTheme } from '../../context/ThemeContext';
import {
  activateAdminUser,
  getAdminUsers,
  suspendAdminUser,
  type AdminUser,
  type AdminUserCategory,
  type AdminUserStatusFilter,
} from '../../api/adminUsers';

const PAGE_SIZE = 20;

function formatJoinedAt(joinedAt: string) {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return joinedAt || '-';
  return date.toLocaleDateString('ko-KR');
}

function statusLabel(status: AdminUser['status']) {
  if (status === 'ACTIVE') return '활성';
  if (status === 'BANNED') return '정지';
  return '탈퇴';
}

export function UserManagementPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [category, setCategory] = useState<AdminUserCategory>('ALL');
  const [status, setStatus] = useState<AdminUserStatusFilter>('ALL');
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [menuUser, setMenuUser] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAdminUsers({
        category,
        status,
        keyword,
        page,
        size: PAGE_SIZE,
      });

      setUsers(response.data.users);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setLastUpdatedAt(new Date().toLocaleString('ko-KR'));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [category, status, keyword, page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const pageNumbers = useMemo(() => {
    const visibleCount = 5;
    const start = Math.max(0, Math.min(page - 2, Math.max(totalPages - visibleCount, 0)));
    const end = Math.min(totalPages, start + visibleCount);
    return Array.from({ length: end - start }, (_, index) => start + index);
  }, [page, totalPages]);

  const handleSearch = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  const openStatusModal = (user: AdminUser) => {
    setSelectedUser(user);
    setConfirmOpen(true);
    setMenuUser(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    setError('');

    try {
      const response =
        selectedUser.status === 'ACTIVE'
          ? await suspendAdminUser(selectedUser.userId)
          : await activateAdminUser(selectedUser.userId);

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === response.data.userId
            ? { ...user, status: response.data.status }
            : user,
        ),
      );
      setConfirmOpen(false);
      setSelectedUser(null);
      setLastUpdatedAt(new Date().toLocaleString('ko-KR'));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '계정 상태 변경에 실패했습니다.');
    } finally {
      setActionLoading(false);
    }
  };

  const isSuspendAction = selectedUser?.status === 'ACTIVE';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text}`}>사용자 관리</h1>
          <p className={`text-sm ${theme.textMuted}`}>
            최근 업데이트 : {lastUpdatedAt ?? '-'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void loadUsers()} disabled={loading}>
          <RefreshCw size={14} /> 새로고침
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Card>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <Select
            label="사용자 분류"
            value={category}
            onChange={(e) => {
              setPage(0);
              setCategory(e.target.value as AdminUserCategory);
            }}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'NEW', label: '신규' },
            ]}
          />
          <Select
            label="계정 상태"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as AdminUserStatusFilter);
            }}
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'ACTIVE', label: '활성' },
              { value: 'BANNED', label: '정지' },
            ]}
          />
          <div className="flex min-w-[240px] flex-1 items-center gap-2">
            <input
              placeholder="닉네임 또는 이메일 검색"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className={`h-10 flex-1 border px-3 text-sm outline-none ${theme.input}`}
            />
            <Button size="sm" className="h-10 shrink-0" onClick={handleSearch}>
              검색
            </Button>
          </div>
        </div>
        <p className={`mb-4 text-sm ${theme.textMuted}`}>
          {loading ? '불러오는 중...' : `총 ${totalCount.toLocaleString('ko-KR')}명`}
        </p>

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
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className={`py-8 text-center text-sm ${theme.textMuted}`}>
                    조건에 맞는 사용자가 없습니다.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.userId} className={`border-b ${theme.border}`}>
                  <td className={`py-3 pr-4 font-mono text-xs ${theme.text}`}>{u.userId}</td>
                  <td className={`py-3 pr-4 ${theme.text}`}>{u.nickname}</td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{u.email}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {statusLabel(u.status)}
                    </Badge>
                  </td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{formatJoinedAt(u.joinedAt)}</td>
                  <td className="relative py-3">
                    <button
                      onClick={() => setMenuUser(menuUser === u.userId ? null : u.userId)}
                      className={`rounded p-1 ${theme.textMuted} hover:opacity-70`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {menuUser === u.userId && (
                      <div className={`absolute right-0 z-10 mt-1 w-36 rounded border py-1 shadow-lg ${theme.modal} ${theme.border}`}>
                        <button
                          className={`block w-full px-3 py-2 text-left text-xs hover:opacity-80 ${theme.text}`}
                          onClick={() => openStatusModal(u)}
                        >
                          {u.status === 'ACTIVE' ? '계정 정지' : '계정 활성화'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className={`mt-6 flex justify-center gap-1 text-sm ${theme.textMuted}`}>
            <button
              className="px-2 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              &lt;
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                className={`h-8 w-8 rounded ${n === page ? theme.primary : ''}`}
                onClick={() => setPage(n)}
              >
                {n + 1}
              </button>
            ))}
            <button
              className="px-2 disabled:opacity-40"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            >
              &gt;
            </button>
          </div>
        )}
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => {
          if (!actionLoading) {
            setConfirmOpen(false);
            setSelectedUser(null);
          }
        }}
        title={isSuspendAction ? '사용자 이용 제한' : '사용자 계정 활성화'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                setSelectedUser(null);
              }}
              disabled={actionLoading}
            >
              아니오
            </Button>
            <button
              type="button"
              onClick={() => void handleConfirmStatusChange()}
              disabled={actionLoading}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
                isSuspendAction
                  ? `bg-red-600 text-white ${theme.radius} hover:bg-red-700`
                  : `${theme.primary} ${theme.primaryHover} ${theme.radius}`
              }`}
            >
              {actionLoading ? '처리 중...' : '네'}
            </button>
          </>
        }
      >
        <p className={theme.textMuted}>
          {selectedUser
            ? isSuspendAction
              ? `${selectedUser.nickname}님의 계정을 정지하시겠습니까? 정지 시 사용자는 서비스 이용 및 로그인이 제한됩니다.`
              : `${selectedUser.nickname}님의 계정을 활성화하시겠습니까? 활성화 시 사용자는 다시 서비스를 이용할 수 있습니다.`
            : ''}
        </p>
      </Modal>
    </div>
  );
}
