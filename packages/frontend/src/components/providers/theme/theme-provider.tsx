import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  supportsSystemTheme: boolean;
}

const safeStorage = {
  get: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(key, value);
    } catch {
      // Ignoré si stockage désactivé ou quota atteint
    }
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
  supportsSystemTheme: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMatchMediaSupported =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (safeStorage.get('tipi-theme-mode') as ThemeMode) || 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (!isMatchMediaSupported) return false;
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!isMatchMediaSupported) return;

    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemIsDark(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof (mediaQuery as any).addListener === 'function') {
      (mediaQuery as any).addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (typeof (mediaQuery as any).removeListener === 'function') {
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, [isMatchMediaSupported]);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system'
      ? (isMatchMediaSupported && systemIsDark ? 'dark' : 'light')
      : theme;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);

    if (root.style && 'colorScheme' in root.style) {
      root.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    safeStorage.set('tipi-theme-mode', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        supportsSystemTheme: isMatchMediaSupported,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
