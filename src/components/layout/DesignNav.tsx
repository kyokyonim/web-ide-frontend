import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import type { DesignStyle } from '../../types';

const allStyles: { id: DesignStyle; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'saas', label: 'SaaS' },
  { id: 'dark', label: 'Dark' },
];

export function DesignNav() {
  const { style, basePath } = useTheme();
  const location = useLocation();
  const pathSuffix = location.pathname.replace(`/design/${style}`, '') || '/login';

  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 text-xs text-white shadow-xl backdrop-blur">
      <Link to="/" className="opacity-60 hover:opacity-100">
        홈
      </Link>
      <span className="opacity-30">|</span>
      {allStyles.map((s) => (
        <Link
          key={s.id}
          to={`/design/${s.id}${pathSuffix}`}
          className={`rounded-full px-2 py-0.5 ${style === s.id ? 'bg-white/20 font-bold' : 'opacity-60 hover:opacity-100'}`}
        >
          {s.label}
        </Link>
      ))}
      <span className="opacity-30">|</span>
      <span className="opacity-50">화면 탐색</span>
      <NavLink to={`${basePath}/login`}>로그인</NavLink>
      <NavLink to={`${basePath}/projects`}>프로젝트</NavLink>
      <NavLink to={`${basePath}/ide`}>IDE</NavLink>
      <NavLink to={`${basePath}/profile`}>프로필</NavLink>
      <NavLink to={`${basePath}/admin`}>관리자</NavLink>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`rounded px-1.5 py-0.5 ${active ? 'bg-indigo-500/40' : 'opacity-60 hover:opacity-100'}`}
    >
      {children}
    </Link>
  );
}
