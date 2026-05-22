import { useTheme } from '../../context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants: Record<Variant, string> = {
    primary: `${theme.primary} ${theme.primaryHover} ${theme.radius}`,
    secondary: `${theme.surface} ${theme.text} border ${theme.border} ${theme.radius} hover:opacity-90`,
    danger: `bg-red-600 text-white ${theme.radius} hover:bg-red-700`,
    ghost: `${theme.textMuted} ${theme.radius} hover:opacity-80`,
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
