'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../i18n/LanguageContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';
  const label = isDark ? t.theme.toLight : t.theme.toDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={!isDark}
      className={`inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-line/25 bg-surface/85 text-accent backdrop-blur-sm transition-colors duration-200 hover:border-gold hover:bg-surfaceHover ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -60, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 60, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
          >
            <Sun size={18} strokeWidth={1.8} aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 60, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -60, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
          >
            <Moon size={18} strokeWidth={1.8} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
