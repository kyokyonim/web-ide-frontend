import { AlertTriangle, FolderKanban, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { mockDashboardHistory, mockRecentChats, mockRecentComments } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';

export function AdminDashboardPage() {
  const { theme, basePath } = useTheme();

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
    {
      icon: AlertTriangle,
      color: 'text-red-500',
      title: '데이터 사용량 위험',
      main: '2건',
      sub: '800MB 초과 프로젝트 2건',
      to: `${basePath}/admin/projects`,
    },
    {
      icon: AlertTriangle,
      color: 'text-orange-500',
      title: '보안 이벤트',
      main: '2건',
      sub: '로그인 실패 외 1건',
      to: `${basePath}/admin/security`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>관리자 대시보드</h1>
        <p className={`text-sm ${theme.textMuted}`}>2026년 5월 13일 기준</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <ul className="space-y-3">
            {mockRecentChats.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-500 text-[10px] text-white">
                  {item.user}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm ${theme.text}`}>
                    {item.nickname}님이 {item.project}에 메시지를 보냈습니다.
                  </p>
                  <span className={`text-xs ${theme.textSubtle}`}>{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
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
