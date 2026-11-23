'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;
const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;

export default function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setVisible(y > 400);
      setProgress(Math.min(1, Math.max(0, y / docMax)));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const handleClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={t.a11y.backToTop}
          title={t.a11y.backToTop}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ duration: 0.22, ease: PAPER_EASE }}
          className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] end-4 z-[65] inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/30 bg-surface/90 text-accent shadow-lg backdrop-blur-md transition-colors duration-200 hover:border-gold hover:bg-surfaceHover hover:text-accentStrong sm:end-6 sm:h-12 sm:w-12"
        >
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="22"
              cy="22"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2"
            />
            <circle
              cx="22"
              cy="22"
              r={RING_R}
              fill="none"
              stroke="#C9A86A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress)}
            />
          </svg>
          <ArrowUp
            size={18}
            strokeWidth={2}
            className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
