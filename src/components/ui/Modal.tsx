import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const { theme } = useTheme();

  if (!open) return null;

  const sizes = {
    sm: figma.layout.modalMd,
    md: figma.layout.modalMd,
    lg: 'max-w-[640px]',
    xl: figma.layout.modalXl,
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${theme.overlay}`}
      onClick={onClose}
    >
      <div
        className={`w-full ${sizes[size]} ${theme.modal} ${theme.shadowLg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-start justify-between border-b px-6 py-5 ${theme.border}`}>
          <div>
            <h2 className={`${figma.typography.h2} ${theme.text}`}>{title}</h2>
            {subtitle && (
              <p className={`mt-1.5 ${figma.typography.body} ${theme.textMuted}`}>{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${theme.textMuted} hover:bg-black/5`}
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className={`flex justify-end gap-3 border-t px-6 py-4 ${theme.border}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
