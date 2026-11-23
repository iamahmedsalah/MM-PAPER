'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, switchLang, isTransitioning, t } = useLang();

  return (
    <div
      className={`inline-flex min-h-[44px] items-center rounded-full border border-line/25 bg-surface/85 backdrop-blur-sm ${
        compact ? 'px-1 py-0.5' : 'px-1.5 py-1'
      }`}
      role="group"
      aria-label={t.langSwitch.label}
    >
      <Globe size={15} className="mx-1.5 shrink-0 text-accent" aria-hidden />
      {(['en', 'ar'] as const).map((l) => {
        const active = lang === l;
        const label = l === 'en' ? 'EN' : compact ? 'ع' : 'عربي';
        const ariaTitle = l === 'en' ? t.langSwitch.switchToEn : t.langSwitch.switchToAr;
        return (
          <button
            key={l}
            type="button"
            disabled={isTransitioning}
            onClick={() => switchLang(l)}
            aria-pressed={active}
            aria-label={ariaTitle}
            title={ariaTitle}
            className={`relative inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors duration-200 ${
              active ? 'text-midnight' : 'text-inkMuted hover:text-accent'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill-active"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-full bg-gold shadow-sm"
                aria-hidden
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
