'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MM_LOGO_CREAM,
  MM_LOGO_NAVY,
  MM_LOGO_VIEWBOX,
  MM_SERIF_LOGO_PATH,
} from './logoPaths';
import { useLang } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;
const SWITCH_KEY = 'mm-lang-switching';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Branded curtain that plays on initial load (480ms) and lifts upward cleanly after language switches (420ms). */
export default function Preloader() {
  const { t } = useLang();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);
  const [barDuration, setBarDuration] = useState(0.44);

  useIsomorphicLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    let isLangSwitch = false;
    try {
      isLangSwitch = window.sessionStorage.getItem(SWITCH_KEY) === '1';
      window.sessionStorage.removeItem(SWITCH_KEY);
    } catch {
      // sessionStorage unavailable
    }

    const durationMs = isLangSwitch ? 420 : 480;
    setBarDuration(isLangSwitch ? 0.38 : 0.44);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const logoFill = theme === 'dark' ? MM_LOGO_CREAM : MM_LOGO_NAVY;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label={t.preloader.loading}
          initial={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.38, ease: PAPER_EASE }}
          className="mm-preloader fixed inset-0 z-[100] flex h-[100dvh] flex-col items-center justify-center bg-canvas px-6"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={MM_LOGO_VIEWBOX}
              className="h-16 w-auto sm:h-20"
              aria-hidden
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: PAPER_EASE }}
            >
              <path d={MM_SERIF_LOGO_PATH} fill={logoFill} fillRule="evenodd" />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2, ease: PAPER_EASE }}
              className="space-y-2"
            >
              <p className="tracking-brand font-heading text-xs font-semibold text-ink sm:text-sm">
                {t.brand}
              </p>
              <p className="text-xs text-inkSubtle">{t.preloader.tagline}</p>
            </motion.div>

            <div className="h-[2px] w-44 overflow-hidden rounded-full bg-line/20">
              <motion.div
                className="h-full origin-left bg-gold rtl:origin-right"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: barDuration, ease: PAPER_EASE }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
