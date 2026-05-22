import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  compact?: boolean;
}

export function Logo({ to, compact = false }: LogoProps) {
  const { theme, basePath } = useTheme();

  const content = (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center text-xs font-bold ${theme.primary} ${theme.radius}`}
      >
        EF
      </div>
      {!compact && (
        <div>
          <div className={`text-sm font-bold leading-tight ${theme.text}`}>EFIDE Studio</div>
          <div className={`text-[10px] ${theme.textSubtle}`}>Web IDE</div>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to || `${basePath}/projects`}>{content}</Link>;
  }
  return content;
}
