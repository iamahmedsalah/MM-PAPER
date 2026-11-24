'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { PaperType } from '../data/papers';
import { useLang } from '../i18n/LanguageContext';
import { GoldButton } from './ui/Buttons';

const PaperStack3D = dynamic(() => import('./three/PaperStack3D'), { ssr: false });

export default function PaperModal({
  paper,
  onClose,
  onRequestQuote,
}: {
  paper: PaperType | null;
  onClose: () => void;
  onRequestQuote: (paperId: string) => void;
}) {
  const { t, L } = useLang();

  useEffect(() => {
    if (!paper) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [paper, onClose]);

  return (
    <AnimatePresence>
      {paper && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${L(paper.name)} ${t.papers.modalLabel}`}
            className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-sm border border-line/25 bg-surface shadow-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative h-44 border-b border-line/15 sm:h-48"
              style={{
                background: 'linear-gradient(160deg, var(--thumb-grad-a), var(--thumb-grad-b))',
              }}
            >
              <PaperStack3D type={paper.id} sizeVariant="modal" active className="h-full w-full" />
              <button
                type="button"
                onClick={onClose}
                aria-label={t.papers.close}
                title={t.papers.close}
                autoFocus
                className="absolute end-3 top-3 z-10 inline-flex h-[44px] w-[44px] items-center justify-center rounded-sm border border-line/30 bg-canvas/85 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-accent"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 shrink-0 rounded-[2px] border border-line/20 shadow-[0_2px_6px_rgba(11,16,32,0.22)]"
                  style={{ background: paper.swatch.base, borderTopColor: paper.swatch.edge }}
                  role="img"
                  aria-label={t.a11y.stack(L(paper.name))}
                />
                <div>
                  <h3 className="font-heading text-2xl font-bold text-ink">{L(paper.name)}</h3>
                  <p className="text-sm font-semibold text-accent" dir="ltr">
                    {paper.gsmRange}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-[160%] text-inkMuted">{L(paper.description)}</p>

              <ul className="mt-5 space-y-2.5">
                {paper.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-[8px] h-1 w-3 shrink-0 bg-gold" aria-hidden />
                    <span>{L(spec)}</span>
                  </li>
                ))}
              </ul>

              <p className="tracking-brand mt-6 border-t border-line/15 pt-4 text-xs text-inkSubtle">
                {t.papers.bestFor} —{' '}
                <span className="font-medium normal-case tracking-normal text-ink">{L(paper.bestUse)}</span>
              </p>

              <div className="mt-6">
                <GoldButton type="button" className="w-full" onClick={() => onRequestQuote(paper.id)}>
                  {t.papers.requestQuoteFor(L(paper.name))}
                </GoldButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
