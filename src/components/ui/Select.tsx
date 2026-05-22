import { useTheme } from '../../context/ThemeContext';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-1.5">
      {label && (
        <label className={`block text-sm font-medium ${theme.text}`}>{label}</label>
      )}
      <select
        className={`w-full border px-3 py-2 text-sm outline-none ${theme.input} ${theme.text} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
