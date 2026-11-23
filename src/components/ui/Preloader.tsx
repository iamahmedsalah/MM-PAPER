'use client';

import { useEffect, useState } from 'react';
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
const SESSION_KEY = 'mm-preloader-shown';

/** Branded first-visit entrance curtain. Skips on in-app locale switches and reduced motion. */
export default function Preloader() {
  const { t, isTransitioning } = useLang();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(SESSION_KEY) === '1';
      if (!alreadyShown) {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      }
    } catch {
      // sessionStorage unavailable
    }

    if (reduced || alreadyShown) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const logoFill = theme === 'dark' ? MM_LOGO_CREAM : MM_LOGO_NAVY;

  return (
    <AnimatePresence>
      {visible && !isTransitioning && (
        <motion.div
          role="status"
          aria-label={t.preloader.loading}
          initial={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.52, ease: PAPER_EASE }}
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
              transition={{ duration: 0.55, ease: PAPER_EASE }}
            >
              <path d={MM_SERIF_LOGO_PATH} fill={logoFill} fillRule="evenodd" />
            </motion.svg>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25, ease: PAPER_EASE }}
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
                transition={{ duration: 0.85, ease: PAPER_EASE }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
