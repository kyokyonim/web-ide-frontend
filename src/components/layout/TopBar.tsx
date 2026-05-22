import { Bell, ChevronDown, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { figma } from '../../styles/figma-spec';

interface TopBarProps {
  showBack?: boolean;
  backLabel?: string;
  backTo?: string;
}

export function TopBar({ showBack, backLabel = '← 프로젝트 목록', backTo }: TopBarProps) {
  const { theme, basePath } = useTheme();

  return (
    <header
      className={`flex shrink-0 items-center justify-between border-b ${figma.layout.topBar} ${theme.topbar} ${theme.border}`}
    >
      <div className="flex items-center gap-5">
        <Logo to={`${basePath}/projects`} />
        {showBack && (
          <Link
            to={backTo || `${basePath}/projects`}
            className={`${figma.typography.body} ${theme.textMuted} hover:underline`}
          >
            {backLabel}
          </Link>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          className={`flex ${figma.sizes.iconBtn} items-center justify-center rounded-md ${theme.textMuted} hover:bg-black/5`}
          aria-label="레이아웃"
        >
          <LayoutGrid size={18} />
        </button>
        <button
          className={`relative flex ${figma.sizes.iconBtn} items-center justify-center rounded-md ${theme.textMuted} hover:bg-black/5`}
          aria-label="알림"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <Link
          to={`${basePath}/profile`}
          className={`ml-1 flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2 ${theme.border}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0969DA] text-xs font-bold text-white">
            J
          </span>
          <ChevronDown size={14} className={theme.textMuted} />
        </Link>
      </div>
    </header>
  );
}
