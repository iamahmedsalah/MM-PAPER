'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

const THEME_META_COLOR: Record<ThemeMode, string> = {
  dark: '#0B1020',
  light: '#F7F4EC',
};

const THEME_FAVICON_HREF: Record<ThemeMode, string> = {
  dark: '/favicon-dark.svg?v=dark',
  light: '/favicon-light.svg?v=light',
};

function syncHeadThemeMetadata(resolved: ThemeMode) {
  const color = THEME_META_COLOR[resolved];
  const href = THEME_FAVICON_HREF[resolved];

  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
    el.setAttribute('content', color);
  });

  let customMeta = document.querySelector('meta[name="theme-color"][data-mm-theme-color]');
  if (!customMeta) {
    customMeta = document.createElement('meta');
    customMeta.setAttribute('name', 'theme-color');
    customMeta.setAttribute('data-mm-theme-color', 'true');
    document.head.appendChild(customMeta);
  }
  customMeta.setAttribute('content', color);

  // Mutate Next-rendered icon links in place without removing React-managed nodes
  document
    .querySelectorAll('link[rel="icon"]:not([data-mm-dynamic-icon]), link[rel="shortcut icon"]')
    .forEach((el) => {
      el.setAttribute('href', href);
      el.setAttribute('type', 'image/svg+xml');
      el.removeAttribute('media');
    });

  // Replace our own dynamic link node so Chromium repaints the tab icon immediately
  document.querySelector('link[data-mm-dynamic-icon]')?.remove();
  const dynamicIcon = document.createElement('link');
  dynamicIcon.setAttribute('rel', 'icon');
  dynamicIcon.setAttribute('type', 'image/svg+xml');
  dynamicIcon.setAttribute('sizes', 'any');
  dynamicIcon.setAttribute('data-mm-dynamic-icon', 'true');
  dynamicIcon.setAttribute('href', href);
  document.head.appendChild(dynamicIcon);
}

function applyDomTheme(pref: ThemePreference): ThemeMode {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePref = pref;
  root.style.colorScheme = resolved;
  if (typeof document !== 'undefined' && document.head) {
    syncHeadThemeMetadata(resolved);
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const hydratedRef = useRef(false);

  // Sync synchronously before paint from localStorage so locale switches never flicker dark
  useIsomorphicLayoutEffect(() => {
    let saved: ThemePreference = 'system';
    try {
      const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemePreference(raw)) saved = raw;
    } catch {
      // storage disabled
    }
    hydratedRef.current = true;
    setPreferenceState(saved);
    setThemeState(applyDomTheme(saved));
  }, []);

  // Follow live OS color-scheme updates whenever preference is 'system'
  useIsomorphicLayoutEffect(() => {
    if (!hydratedRef.current) return;
    setThemeState(applyDomTheme(preference));
    if (preference !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setThemeState(applyDomTheme('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  // Re-sync head theme-color & favicon after locale route navigation metadata settles
  useIsomorphicLayoutEffect(() => {
    if (!hydratedRef.current || typeof document === 'undefined' || !document.head) return;
    syncHeadThemeMetadata(theme);
  }, [pathname, theme]);

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
