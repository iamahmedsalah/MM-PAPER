'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemePreference } from '../../theme/ThemeContext';
import { useLang } from '../../i18n/LanguageContext';

export default function ThemeToggle({
  className = '',
  segmented = false,
}: {
  className?: string;
  segmented?: boolean;
}) {
  const { preference, setPreference, cycleTheme } = useTheme();
  const { t } = useLang();

  const options: ReadonlyArray<{
    id: ThemePreference;
    label: string;
    toLabel: string;
    Icon: typeof Monitor;
  }> = [
    { id: 'system', label: t.theme.systemLabel, toLabel: t.theme.toSystem, Icon: Monitor },
    { id: 'light', label: t.theme.lightLabel, toLabel: t.theme.toLight, Icon: Sun },
    { id: 'dark', label: t.theme.darkLabel, toLabel: t.theme.toDark, Icon: Moon },
  ];

  if (segmented) {
    return (
      <div
        role="radiogroup"
        aria-label={t.theme.groupLabel}
        className={`inline-flex items-center rounded-sm border border-line/25 bg-surface/85 p-1 backdrop-blur-sm ${className}`}
      >
        {options.map(({ id, label, toLabel, Icon }) => {
          const active = preference === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={toLabel}
              title={label}
              onClick={() => setPreference(id)}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-sm px-2.5 text-xs font-semibold transition-colors duration-200 ${
                active
                  ? 'bg-gold text-midnight shadow-sm'
                  : 'text-inkMuted hover:bg-surfaceHover hover:text-ink'
              }`}
            >
              <Icon size={15} strokeWidth={1.9} aria-hidden />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const currentIdx = options.findIndex((o) => o.id === preference);
  const current = options[currentIdx >= 0 ? currentIdx : 0];
  const next = options[(currentIdx + 1) % options.length];
  const CurrentIcon = current.Icon;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`${current.label} — ${next.toLabel}`}
      title={`${current.label} — ${next.toLabel}`}
      className={`inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-line/25 bg-surface/85 text-accent backdrop-blur-sm transition-colors duration-200 hover:border-gold hover:bg-surfaceHover ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current.id}
          initial={{ rotate: -45, scale: 0.65, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 45, scale: 0.65, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <CurrentIcon size={18} strokeWidth={1.85} aria-hidden />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
