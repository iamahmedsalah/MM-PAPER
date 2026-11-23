'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = 'mm-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Sync with the anti-FOUC inline script value on client mount to avoid SSR hydration mismatches
  useEffect(() => {
    const attr = document.documentElement.dataset.theme;
    if (attr === 'light' || attr === 'dark') {
      setThemeState(attr);
      return;
    }
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
        return;
      }
    } catch {
      // storage disabled
    }
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }
  }, []);

  const applyTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    const root = document.documentElement;
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage disabled
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      root.dataset.theme = next;
      root.style.colorScheme = next;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // storage disabled
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: applyTheme, toggleTheme }),
    [theme, applyTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
