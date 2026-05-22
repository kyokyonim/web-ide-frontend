import { useTheme } from '../../context/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className = '', ...props }: InputProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-sm font-medium ${theme.text}`}>{label}</label>
      )}
      <input
        className={`w-full border px-3 py-2 text-sm outline-none transition ${theme.input} ${theme.text} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className={`text-xs ${theme.textSubtle}`}>{hint}</p>}
    </div>
  );
}
