import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ColorMode, DesignStyle } from '../types';
import { getTheme, type ThemeTokens } from '../themes/tokens';

interface ThemeContextValue {
  style: DesignStyle;
  colorMode: ColorMode;
  isDarkMode: boolean;
  theme: ThemeTokens;
  basePath: string;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const COLOR_MODE_STORAGE_KEY = 'efide-color-mode';

function getInitialColorMode(style: DesignStyle): ColorMode {
  if (typeof window === 'undefined') return style === 'dark' ? 'dark' : 'light';

  const saved = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  return style === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({
  style,
  children,
}: {
  style: DesignStyle;
  children: ReactNode;
}) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => getInitialColorMode(style));

  useEffect(() => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
    document.documentElement.dataset.theme = colorMode;
    document.documentElement.style.colorScheme = colorMode;
  }, [colorMode]);

  const value = useMemo<ThemeContextValue>(() => {
    const themeStyle = colorMode === 'dark' ? 'dark' : style === 'dark' ? 'minimal' : style;

    return {
      style,
      colorMode,
      isDarkMode: colorMode === 'dark',
      theme: getTheme(themeStyle),
      basePath: `/design/${style === 'dark' ? 'minimal' : style}`,
      toggleColorMode: () => setColorMode((mode) => (mode === 'dark' ? 'light' : 'dark')),
    };
  }, [colorMode, style]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
