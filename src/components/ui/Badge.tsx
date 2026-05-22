import { useTheme } from '../../context/ThemeContext';
import { roleBadgeClass } from '../../themes/tokens';
import type { UserRole } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | UserRole;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const { theme, style } = useTheme();

  const variants: Record<string, string> = {
    default: `${theme.surfaceMuted} ${theme.textMuted} border ${theme.border}`,
    success: theme.successBg,
    danger: theme.dangerBg,
    warning: theme.warningBg,
    owner: roleBadgeClass(style, 'owner'),
    editor: roleBadgeClass(style, 'editor'),
    viewer: roleBadgeClass(style, 'viewer'),
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
