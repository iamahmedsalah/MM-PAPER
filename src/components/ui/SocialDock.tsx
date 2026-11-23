'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import { socialChannels } from '../../data/socials';
import { SocialIcon } from './SocialIcons';
import { useLang } from '../../i18n/LanguageContext';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Semantic dual-theme ON/OFF floating social dock.
 * Anchored on inline-start opposite BackToTop so phones (320px+) have zero overlap.
 */
export default function SocialDock() {
  const { t, L } = useLang();
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] start-4 z-[65] flex flex-col items-start sm:start-6"
    >
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mm-social-dock-list"
            aria-label={t.socials.dockLabel}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduced ? 0.01 : 0.2, ease: PAPER_EASE }}
            className="mb-2.5 flex flex-col items-start gap-2"
          >
            {socialChannels.map((channel, index) => (
              <motion.li
                key={channel.id}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.94 }}
                transition={{
                  duration: reduced ? 0.01 : 0.22,
                  delay: reduced ? 0 : index * 0.045,
                  ease: PAPER_EASE,
                }}
              >
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label={`${L(channel.name)} — ${channel.handle}`}
                  className="group flex min-h-[44px] items-center gap-2.5 rounded-full border border-line/25 bg-surface/95 pe-4 ps-1.5 py-1.5 text-sm font-medium text-ink shadow-lg backdrop-blur-md transition-colors duration-200 hover:border-gold hover:bg-surfaceHover"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/20 bg-canvas/80 text-accent transition-colors duration-200 group-hover:border-gold group-hover:bg-gold group-hover:text-midnight">
                    <SocialIcon platform={channel.id} size={16} />
                  </span>
                  <span className="whitespace-nowrap">{L(channel.name)}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mm-social-dock-list"
        aria-label={open ? t.socials.hideAria : t.socials.showAria}
        title={open ? t.socials.hideAria : t.socials.showAria}
        className={`group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-200 ${
          open
            ? 'border-gold bg-gold text-midnight shadow-[0_8px_24px_rgba(201,168,106,0.3)] hover:bg-goldLight'
            : 'border-line/30 bg-surface/90 text-ink hover:border-gold hover:bg-surfaceHover'
        }`}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden>
          {open ? (
            <X size={16} strokeWidth={2.2} />
          ) : (
            <Share2 size={16} strokeWidth={1.9} className="text-accent" />
          )}
        </span>

        <span>{open ? t.socials.closeLabel : t.socials.toggleLabel}</span>

        <span
          aria-hidden
          className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200 ${
            open ? 'border-midnight/25 bg-midnight/20' : 'border-line/25 bg-canvas/70'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
              open
                ? 'translate-x-3 bg-midnight rtl:-translate-x-3'
                : 'translate-x-0 bg-accent'
            }`}
          />
        </span>
      </button>
    </div>
  );
}
