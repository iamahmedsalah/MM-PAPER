'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Lang, Localized } from './types';
import { dictionaries, type Translation } from './translations';
import { saveCurrentSectionForLangSwitch } from '../lib/scroll';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  switchLang: (next: Lang) => void;
  isTransitioning: boolean;
  transitionTarget: Lang | null;
  t: Translation;
  L: (v: Localized) => string;
}

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = 'mm-lang';

export function LanguageProvider({
  children,
  initialLang = 'en',
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<Lang | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    setLangState(initialLang);
  }, [initialLang]);

  useEffect(() => {
    const dict = dictionaries[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined' && /^\/(en|ar)\/?$/.test(window.location.pathname)) {
      document.title = dict.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', dict.seo.description);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage disabled
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const switchLang = useCallback(
    (next: Lang) => {
      if (next === lang || isTransitioning) return;
      const reduced =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const targetPath =
        pathname && /^\/(en|ar)(\/|$)/.test(pathname)
          ? pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`)
          : `/${next}`;

      try {
        window.localStorage.setItem(STORAGE_KEY, next);
        if (!reduced) {
          window.sessionStorage.setItem('mm-lang-switching', '1');
        }
      } catch {
        // storage disabled
      }

      if (/^\/(en|ar)\/?$/.test(pathname || '')) {
        saveCurrentSectionForLangSwitch();
      }

      if (reduced) {
        setLangState(next);
        router.push(targetPath, { scroll: false });
        return;
      }

      clearTimers();
      setTransitionTarget(next);
      setIsTransitioning(true);

      const swapId = window.setTimeout(() => {
        setLangState(next);
        router.push(targetPath, { scroll: false });
      }, 200);

      const doneId = window.setTimeout(() => {
        setIsTransitioning(false);
        setTransitionTarget(null);
      }, 500);

      timersRef.current.push(swapId, doneId);
    },
    [lang, isTransitioning, clearTimers, router, pathname]
  );

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      switchLang,
      isTransitioning,
      transitionTarget,
      t: dictionaries[lang],
      L: (v: Localized) => v[lang],
    }),
    [lang, setLang, switchLang, isTransitioning, transitionTarget]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
