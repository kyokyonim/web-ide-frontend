import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className = '', hover = false, padding = true }: CardProps) {
  const { theme } = useTheme();
  return (
    <div
      className={`${theme.card} ${theme.shadow} ${hover ? theme.cardHover : ''} ${padding ? 'p-4 md:p-6' : ''} transition ${className}`}
    >
      {children}
    </div>
  );
}
