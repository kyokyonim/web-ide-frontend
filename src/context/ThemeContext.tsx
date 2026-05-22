import { createContext, useContext, type ReactNode } from 'react';
import type { DesignStyle } from '../types';
import { getTheme, type ThemeTokens } from '../themes/tokens';

interface ThemeContextValue {
  style: DesignStyle;
  theme: ThemeTokens;
  basePath: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  style,
  children,
}: {
  style: DesignStyle;
  children: ReactNode;
}) {
  const value: ThemeContextValue = {
    style,
    theme: getTheme(style),
    basePath: `/design/${style}`,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
