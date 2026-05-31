import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { isDarkMode, theme, toggleColorMode } = useTheme();

  return (
    <button
      type="button"
      aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
      aria-pressed={isDarkMode}
      title={isDarkMode ? '라이트 모드' : '다크 모드'}
      onClick={toggleColorMode}
      className={`relative flex h-9 w-[68px] items-center rounded-full border p-1 transition ${theme.border} ${theme.surfaceMuted}`}
    >
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full transition-transform ${theme.surface} ${theme.shadow} ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <Sun size={15} className={isDarkMode ? theme.textSubtle : 'text-amber-500'} />
        <Moon size={15} className={isDarkMode ? 'text-sky-300' : theme.textSubtle} />
      </span>
    </button>
  );
}
