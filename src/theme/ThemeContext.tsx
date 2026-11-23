'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  /** Resolved visual theme active on the document ('dark' or 'light'). */
  theme: ThemeMode;
  /** User-selected theme preference ('system', 'light', or 'dark'). */
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  setTheme: (next: ThemePreference) => void;
  cycleTheme: () => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = 'mm-theme';
const CYCLE_ORDER: readonly ThemePreference[] = ['system', 'light', 'dark'];

function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function resolveTheme(pref: ThemePreference): ThemeMode {
  if (pref === 'light' || pref === 'dark') return pref;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyDomTheme(pref: ThemePreference): ThemeMode {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePref = pref;
  root.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Always hydrate from localStorage first so Next.js locale switches never reset user theme choice
  useEffect(() => {
    let saved: ThemePreference = 'system';
    try {
      const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemePreference(raw)) saved = raw;
    } catch {
      // storage disabled
    }
    setPreferenceState(saved);
    setThemeState(applyDomTheme(saved));
  }, []);

  // Follow live OS color-scheme updates whenever preference is 'system'
  useEffect(() => {
    setThemeState(applyDomTheme(preference));
    if (preference !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setThemeState(applyDomTheme('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setThemeState(applyDomTheme(next));
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage disabled
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      const idx = CYCLE_ORDER.indexOf(prev);
      const next = CYCLE_ORDER[(idx + 1) % CYCLE_ORDER.length];
      setThemeState(applyDomTheme(next));
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // storage disabled
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      setPreference,
      setTheme: setPreference,
      cycleTheme,
      toggleTheme: cycleTheme,
    }),
    [theme, preference, setPreference, cycleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
