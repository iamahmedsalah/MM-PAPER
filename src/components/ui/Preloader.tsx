'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MM_LOGO_PATHS } from './logoPaths';
import { useLang } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

/** Branded initial paper-strip entrance curtain. Bypasses instantaneously under reduced motion. */
export default function Preloader() {
  const { t } = useLang();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  const primaryColor = theme === 'dark' ? '#F4EFE3' : '#193051';
  const accentColor = '#C9A86A';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label={t.preloader.loading}
          initial={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.52, ease: PAPER_EASE }}
          className="mm-preloader fixed inset-0 z-[100] flex h-[100dvh] flex-col items-center justify-center bg-canvas px-6"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-20 -20 760 440"
              className="h-20 w-auto sm:h-24"
              aria-hidden
            >
              {MM_LOGO_PATHS.map((strip, idx) => (
                <motion.path
                  key={idx}
                  d={strip.d}
                  fill={strip.letter === 0 ? primaryColor : accentColor}
                  initial={{
                    opacity: 0,
                    x: strip.initialOffset.x,
                    y: strip.initialOffset.y,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.045,
                    ease: PAPER_EASE,
                  }}
                />
              ))}
            </svg>

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
