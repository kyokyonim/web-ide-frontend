import { FolderKanban, MessageSquare, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { mockDashboardHistory, mockRecentComments } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { getAdminRecentChats, type AdminRecentChat } from '../../api/adminChats';

function formatRecentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '-';
  return date.toLocaleString('ko-KR');
}

function getInitials(nickname: string) {
  return nickname.trim().slice(0, 2).toUpperCase() || '?';
}

export function AdminDashboardPage() {
  const { theme, basePath } = useTheme();
  const [recentChats, setRecentChats] = useState<AdminRecentChat[]>([]);
  const [recentChatsLoading, setRecentChatsLoading] = useState(false);
  const [recentChatsError, setRecentChatsError] = useState('');

  useEffect(() => {
    let active = true;

    const loadRecentChats = async () => {
      setRecentChatsLoading(true);
      setRecentChatsError('');

      try {
        const response = await getAdminRecentChats(4);
        if (!active) return;
        setRecentChats(response.data);
      } catch (err) {
        console.error(err);
        if (active) {
          setRecentChatsError(
            err instanceof Error ? err.message : '최근 채팅 현황을 불러오지 못했습니다.',
          );
        }
      } finally {
        if (active) setRecentChatsLoading(false);
      }
    };

    void loadRecentChats();

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      icon: Users,
      color: 'text-blue-500',
      title: '사용자 현황',
      main: '접속 32명',
      sub: '전체 1,234',
      to: `${basePath}/admin/users`,
    },
    {
      icon: FolderKanban,
      color: 'text-green-500',
      title: '프로젝트 현황',
      main: '+신규 2개',
      sub: '전체 100',
      to: `${basePath}/admin/projects`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>관리자 대시보드</h1>
        <p className={`text-sm ${theme.textMuted}`}>2026년 5월 13일 기준</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Link key={s.title} to={s.to}>
            <Card hover>
              <div className="flex items-start gap-3">
                <s.icon className={s.color} size={24} />
                <div>
                  <div className={`text-xs ${theme.textMuted}`}>{s.title}</div>
                  <div className={`mt-1 text-lg font-bold ${theme.text}`}>{s.main}</div>
                  <div className={`text-xs ${theme.textSubtle}`}>{s.sub}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`flex items-center gap-2 font-semibold ${theme.text}`}>
              <MessageSquare size={18} /> 최근 채팅
            </h2>
            <button className={`text-xs text-blue-600`}>전체 보기</button>
          </div>
          {recentChatsLoading && (
            <p className={`text-sm ${theme.textMuted}`}>최근 채팅을 불러오는 중...</p>
          )}
          {!recentChatsLoading && recentChatsError && (
            <p className="text-sm text-red-500">{recentChatsError}</p>
          )}
          {!recentChatsLoading && !recentChatsError && recentChats.length === 0 && (
            <p className={`text-sm ${theme.textMuted}`}>최근 채팅 내역이 없습니다.</p>
          )}
          {!recentChatsLoading && !recentChatsError && recentChats.length > 0 && (
            <ul className="space-y-3">
              {recentChats.map((item) => (
                <li key={item.messageId} className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ backgroundColor: item.senderProfileColor || '#64748B' }}
                  >
                    {getInitials(item.senderNickname)}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm ${theme.text}`}>
                      {item.senderNickname}님이 {item.projectName}에 메시지를 보냈습니다.
                    </p>
                    <span className={`text-xs ${theme.textSubtle}`}>
                      {formatRecentTime(item.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`flex items-center gap-2 font-semibold ${theme.text}`}>
              <MessageSquare size={18} /> 최근 댓글
            </h2>
            <button className={`text-xs text-blue-600`}>전체 보기</button>
          </div>
          <ul className="space-y-3">
            {mockRecentComments.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                  {item.user}
                </span>
                <div className="min-w-0">
                  <div className={`text-xs font-medium ${theme.textSubtle}`}>
                    {item.project} · {item.file}
                  </div>
                  <p className={`text-sm ${theme.text}`}>{item.text}</p>
                  <span className={`text-xs ${theme.textSubtle}`}>{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`font-semibold ${theme.text}`}>프로젝트 히스토리</h2>
            <button className={`text-xs text-blue-600`}>전체 보기</button>
          </div>
          <ul className={`space-y-3 ${theme.fontMono} text-sm`}>
            {mockDashboardHistory.map((h) => (
              <li key={h.id} className={`border-l-2 border-blue-500 pl-3 ${theme.textMuted}`}>
                <p>{h.text}</p>
                <span className={`text-xs ${theme.textSubtle}`}>{h.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
