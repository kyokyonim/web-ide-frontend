import { Bell, ChevronDown, LayoutGrid, LogOut, Settings, UserCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { figma } from '../../styles/figma-spec';
import { BackendStatus } from './BackendStatus';
import { ThemeToggle } from './ThemeToggle';
import { logout } from '../../api/auth';

interface TopBarProps {
  showBack?: boolean;
  backLabel?: string;
  backTo?: string;
}

export function TopBar({ showBack, backLabel = '← 프로젝트 목록', backTo }: TopBarProps) {
  const { theme, basePath } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const nickname = localStorage.getItem('nickname') || '사용자';
  const profileColor = localStorage.getItem('profileColor') || '#0969DA';
  const avatarLabel = nickname.slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const goToProfile = () => {
    setMenuOpen(false);
    navigate(`${basePath}/profile`);
  };

  const goToSettings = () => {
    setMenuOpen(false);
    navigate(`${basePath}/projects/settings`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setMenuOpen(false);
      setLoggingOut(false);
      navigate(`${basePath}/login`, { replace: true });
    }
  };

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
      <div className="flex items-center gap-2">
        <BackendStatus />
        <ThemeToggle />
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
        <div ref={menuRef} className="relative ml-1">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2 ${theme.border} ${theme.surface} hover:bg-black/5`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="사용자 메뉴"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: profileColor }}
            >
              {avatarLabel}
            </span>
            <ChevronDown size={14} className={theme.textMuted} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className={`absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-md border shadow-lg ${theme.border} ${theme.surface}`}
            >
              <div className={`flex items-center gap-3 border-b px-3 py-3 ${theme.border}`}>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: profileColor }}
                >
                  {avatarLabel}
                </span>
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${theme.text}`}>{nickname}</div>
                  <div className={`text-xs ${theme.textMuted}`}>EFIDE Studio</div>
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={goToProfile}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${theme.text} hover:bg-black/5`}
              >
                <UserCircle size={16} />
                사용자 프로필
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={goToSettings}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${theme.text} hover:bg-black/5`}
              >
                <Settings size={16} />
                시스템 설정
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => void handleLogout()}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 border-t border-red-100 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? '로그아웃 중...' : '로그아웃'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
