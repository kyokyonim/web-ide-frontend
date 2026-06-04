import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { acceptInvite, getInvitePreview } from '../../api/invite';
import type { InvitePreview } from '../../api/invite';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (!token) {
      setError('유효하지 않은 초대 링크입니다.');
      setLoading(false);
      return;
    }

    getInvitePreview(token)
      .then((res) => setPreview(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : '초대 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError('');
    try {
      const res = await acceptInvite(token);
      navigate(`/design/minimal/ide/${res.data.projectId}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '초대 수락에 실패했습니다.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <p className="text-sm text-slate-600">초대 정보를 확인하는 중…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-bold text-slate-900">프로젝트 초대</h1>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {preview && !error && (
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">{preview.projectName}</span> 프로젝트에{' '}
              <span className="font-medium">{preview.role}</span> 권한으로 초대되었습니다.
            </p>
            <p>초대 이메일: {preview.inviteeEmail}</p>
            <p>만료: {new Date(preview.expiresAt).toLocaleString('ko-KR')}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {!isLoggedIn ? (
            <Link
              to={`/design/minimal/login?redirect=${encodeURIComponent(window.location.pathname)}`}
              className="inline-flex"
            >
              <Button className="w-full">로그인 후 참여하기</Button>
            </Link>
          ) : (
            <Button className="w-full" disabled={accepting || !!error} onClick={() => void handleAccept()}>
              {accepting ? '처리 중…' : '초대 수락하기'}
            </Button>
          )}
          <Link to="/design/minimal/projects" className="text-center text-xs text-blue-600">
            프로젝트 목록으로
          </Link>
        </div>
      </Card>
    </div>
  );
}
