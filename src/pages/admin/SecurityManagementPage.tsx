import { Shield } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { mockSecurityEvents } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';

export function SecurityManagementPage() {
  const { theme } = useTheme();

  const severityVariant = (s: string) => {
    if (s === 'high') return 'danger';
    if (s === 'medium') return 'warning';
    return 'default';
  };

  const severityLabel = (s: string) => {
    if (s === 'high') return '높음';
    if (s === 'medium') return '중간';
    return '낮음';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="text-red-500" size={28} />
        <div>
          <h1 className={`text-2xl font-bold ${theme.text}`}>보안 관리</h1>
          <p className={`text-sm ${theme.textMuted}`}>
            비인가 접근, 로그인 실패, 권한 변경 이력을 모니터링합니다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className={`text-xs ${theme.textMuted}`}>오늘 보안 이벤트</div>
          <div className={`mt-1 text-2xl font-bold text-red-500`}>5건</div>
        </Card>
        <Card>
          <div className={`text-xs ${theme.textMuted}`}>로그인 실패</div>
          <div className={`mt-1 text-2xl font-bold ${theme.text}`}>12건</div>
        </Card>
        <Card>
          <div className={`text-xs ${theme.textMuted}`}>권한 변경</div>
          <div className={`mt-1 text-2xl font-bold ${theme.text}`}>3건</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <Select
            label="이벤트 유형"
            options={[
              { value: 'all', label: '전체' },
              { value: 'login', label: '로그인 실패' },
              { value: 'access', label: '비정상 접근' },
              { value: 'permission', label: '권한 변경' },
            ]}
          />
          <Select
            label="심각도"
            options={[
              { value: 'all', label: '전체' },
              { value: 'high', label: '높음' },
              { value: 'medium', label: '중간' },
              { value: 'low', label: '낮음' },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left text-xs ${theme.border} ${theme.textMuted}`}>
                <th className="pb-3 pr-4">유형</th>
                <th className="pb-3 pr-4">사용자</th>
                <th className="pb-3 pr-4">IP</th>
                <th className="pb-3 pr-4">시간</th>
                <th className="pb-3">심각도</th>
              </tr>
            </thead>
            <tbody>
              {mockSecurityEvents.map((e) => (
                <tr key={e.id} className={`border-b ${theme.border}`}>
                  <td className={`py-3 pr-4 font-medium ${theme.text}`}>{e.type}</td>
                  <td className={`py-3 pr-4 ${theme.textMuted}`}>{e.user}</td>
                  <td className={`py-3 pr-4 font-mono text-xs ${theme.textMuted}`}>{e.ip}</td>
                  <td className={`py-3 pr-4 ${theme.textSubtle}`}>{e.time}</td>
                  <td className="py-3">
                    <Badge variant={severityVariant(e.severity)}>
                      {severityLabel(e.severity)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
