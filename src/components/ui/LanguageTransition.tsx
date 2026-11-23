'use client';

import { AnimatePresence, motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { useLang } from '../../i18n/LanguageContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

/** Directional paper-sheet curtain that choreographs EN <-> AR + LTR <-> RTL shifts cleanly. */
export default function LanguageTransition() {
  const { isTransitioning, transitionTarget, t } = useLang();
  const goingArabic = transitionTarget === 'ar';

  return (
    <>
      <div className="sr-only" aria-live="polite" role="status">
        {isTransitioning && transitionTarget
          ? goingArabic
            ? t.langSwitch.transitioningToAr
            : t.langSwitch.transitioningToEn
          : ''}
      </div>

      <AnimatePresence>
        {isTransitioning && transitionTarget && (
          <motion.div
            key={`lang-curtain-${transitionTarget}`}
            aria-hidden
            initial={{ x: goingArabic ? '100%' : '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: goingArabic ? '-100%' : '100%' }}
            transition={{ duration: 0.24, ease: PAPER_EASE }}
            className="pointer-events-none fixed inset-0 z-[95] flex h-[100dvh] flex-col items-center justify-center border-x border-gold/40 bg-surface shadow-2xl"
          >
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <BrandLogo className="h-10 w-auto sm:h-12" decorative width={120} height={48} />
              <div className="h-[2px] w-24 rounded-full bg-gold" />
              <p className="font-heading text-lg font-bold tracking-wide text-ink">
                {goingArabic ? t.langSwitch.targetAr : t.langSwitch.targetEn}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
