import {
  FolderKanban,
  LayoutDashboard,
  Shield,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

const navItems = [
  { to: 'admin', label: '대시보드', icon: LayoutDashboard, end: true, badge: null },
  { to: 'admin/users', label: '사용자 관리', icon: Users, badge: null },
  { to: 'admin/projects', label: '전체 프로젝트', icon: FolderKanban, badge: '12' },
  { to: 'admin/security', label: '보안 관리', icon: Shield, badge: null },
];

export function AdminSidebar() {
  const { theme, basePath } = useTheme();

  return (
    <aside
      className={`flex ${figma.layout.adminSidebar} shrink-0 flex-col border-r ${theme.sidebar} ${theme.border}`}
    >
      <div className={`px-4 py-5 ${figma.typography.caption} font-semibold uppercase tracking-wider ${theme.textSubtle}`}>
        Main
      </div>
      <nav className="flex-1 space-y-0.5 px-3 pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={`${basePath}/${item.to}`}
            end={item.end}
            className={({ isActive }) =>
              `flex h-10 items-center gap-2.5 rounded-md px-3 ${figma.typography.body} transition ${
                isActive
                  ? `font-medium ${theme.surfaceMuted} ${theme.text}`
                  : `${theme.textMuted} hover:opacity-90`
              }`
            }
          >
            <item.icon size={18} strokeWidth={1.75} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${theme.surfaceMuted} ${theme.textMuted}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
