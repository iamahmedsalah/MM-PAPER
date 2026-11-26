'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Camera, Layers, Printer, Sparkles, X, ZoomIn } from 'lucide-react';
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
  const { lang, t, L } = useLang();
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [loupeEnabled, setLoupeEnabled] = useState(true);
  const [loupeActive, setLoupeActive] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paper) return;
    setViewMode('photo');
    setLoupeActive(false);

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

  // Direct DOM mutation for 120fps pointer tracking with zero React re-renders per frame
  const updateLoupePosition = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    const loupe = loupeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.min(92, Math.max(8, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(88, Math.max(14, ((clientY - rect.top) / rect.height) * 100));
    if (!loupeActive) setLoupeActive(true);
    if (loupe) {
      loupe.style.left = `${x}%`;
      loupe.style.top = `${y}%`;
      loupe.style.backgroundPosition = `${x}% ${y}%`;
    }
  };

  return (
    <AnimatePresence>
      {paper && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-midnight/85 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            aria-label={`${L(paper.name)} ${t.papers.modalLabel}`}
            className="no-scrollbar relative z-10 max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-sm border border-line/25 bg-surface shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Interactive Studio Inspector Stage — compact height fits laptop & mobile viewports cleanly */}
            <div
              ref={stageRef}
              onPointerMove={(e) => {
                if (viewMode === 'photo' && loupeEnabled) {
                  updateLoupePosition(e.clientX, e.clientY);
                }
              }}
              onPointerEnter={(e) => {
                if (viewMode === 'photo' && loupeEnabled) {
                  updateLoupePosition(e.clientX, e.clientY);
                }
              }}
              onPointerLeave={() => setLoupeActive(false)}
              className="relative h-44 select-none overflow-hidden border-b border-line/15 sm:h-52"
              style={{
                background: 'linear-gradient(160deg, var(--thumb-grad-a), var(--thumb-grad-b))',
              }}
            >
              {viewMode === 'photo' ? (
                <>
                  <Image
                    src={paper.image}
                    alt={`${L(paper.name)} — ${L(paper.surfaceFinish)}`}
                    fill
                    quality={82}
                    sizes="(max-width: 640px) 100vw, 576px"
                    priority
                    className="object-cover"
                  />

                  {/* Ref-driven 2.4x Macro Texture Loupe */}
                  <div
                    ref={loupeRef}
                    aria-hidden
                    className={`pointer-events-none absolute z-20 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold shadow-[0_10px_28px_rgba(11,16,32,0.65),inset_0_0_12px_rgba(201,168,106,0.35)] transition-opacity duration-150 sm:h-32 sm:w-32 ${
                      loupeEnabled && loupeActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      left: '50%',
                      top: '50%',
                      backgroundImage: `url(${paper.image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '240% 240%',
                      backgroundPosition: '50% 50%',
                    }}
                  >
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-midnight/85 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold">
                      2.4×
                    </span>
                  </div>

                  {/* Bottom studio caption bar */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 via-midnight/45 to-transparent px-4 pb-2 pt-7 text-[11px] text-cream/90 sm:px-5">
                    <p className="flex items-center gap-1.5">
                      <ZoomIn size={13} className="shrink-0 text-gold" aria-hidden />
                      <span className="truncate">{t.papers.loupeHint}</span>
                    </p>
                  </div>
                </>
              ) : (
                <PaperStack3D type={paper.id} sizeVariant="modal" active className="h-full w-full" />
              )}

              {/* Top Controls Bar — hides loupe while hovering controls so X and tabs stay unobstructed */}
              <div
                onPointerEnter={() => setLoupeActive(false)}
                onPointerMove={(e) => e.stopPropagation()}
                className="absolute inset-x-2.5 top-2.5 z-30 flex items-center justify-between gap-2 sm:inset-x-3 sm:top-3"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <div
                    role="tablist"
                    aria-label={L(paper.name)}
                    className="inline-flex rounded-full border border-line/35 bg-canvas/85 p-0.5 backdrop-blur-md"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === 'photo'}
                      onClick={() => setViewMode('photo')}
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                        viewMode === 'photo'
                          ? 'bg-gold text-midnight shadow-sm'
                          : 'text-ink hover:text-accent'
                      }`}
                    >
                      <Camera size={13} aria-hidden />
                      <span>{t.papers.viewPhoto}</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === '3d'}
                      onClick={() => setViewMode('3d')}
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                        viewMode === '3d'
                          ? 'bg-gold text-midnight shadow-sm'
                          : 'text-ink hover:text-accent'
                      }`}
                    >
                      <Layers size={13} aria-hidden />
                      <span>{t.papers.view3D}</span>
                    </button>
                  </div>

                  {viewMode === 'photo' && (
                    <button
                      type="button"
                      aria-pressed={loupeEnabled}
                      onClick={() => setLoupeEnabled((v) => !v)}
                      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold backdrop-blur-md transition-colors ${
                        loupeEnabled
                          ? 'border-gold/70 bg-midnight/80 text-gold'
                          : 'border-line/30 bg-canvas/75 text-inkMuted hover:border-gold'
                      }`}
                    >
                      <ZoomIn size={12} aria-hidden />
                      <span>{t.papers.loupeToggle}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.papers.close}
                  title={t.papers.close}
                  autoFocus
                  className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-sm border border-line/30 bg-canvas/85 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-accent"
                >
                  <X size={17} aria-hidden />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-[2px] border border-line/20 shadow-[0_2px_6px_rgba(11,16,32,0.22)]"
                    style={{ background: paper.swatch.base, borderTopColor: paper.swatch.edge }}
                    role="img"
                    aria-label={t.a11y.stack(L(paper.name))}
                  />
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink sm:text-xl">{L(paper.name)}</h3>
                  </div>
                </div>
                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-accent">
                  {t.categories[paper.category]}
                </span>
              </div>

              <p className="mt-3 text-xs leading-[160%] text-inkMuted sm:text-sm">{L(paper.description)}</p>

              {/* Surface Finish & Print Method Inspector Cards */}
              <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-sm border border-line/20 bg-canvas/60 p-2.5 sm:p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-accent sm:text-xs">
                    <Sparkles size={13} aria-hidden />
                    <span>{t.papers.surfaceLabel}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium leading-[150%] text-ink">{L(paper.surfaceFinish)}</p>
                </div>
                <div className="rounded-sm border border-line/20 bg-canvas/60 p-2.5 sm:p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-accent sm:text-xs">
                    <Printer size={13} aria-hidden />
                    <span>{t.papers.printMethodLabel}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium leading-[150%] text-ink">{L(paper.printMethod)}</p>
                </div>
              </div>

              <ul className="mt-3.5 grid gap-1.5 sm:grid-cols-2">
                {paper.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink sm:text-sm">
                    <span className="mt-[7px] h-1 w-2.5 shrink-0 bg-gold" aria-hidden />
                    <span>{L(spec)}</span>
                  </li>
                ))}
              </ul>

              <p className="tracking-brand mt-4 border-t border-line/15 pt-3 text-xs text-inkSubtle">
                {t.papers.bestFor} —{' '}
                <span className="font-medium normal-case tracking-normal text-ink">{L(paper.bestUse)}</span>
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <GoldButton type="button" className="w-full sm:flex-1" onClick={() => onRequestQuote(paper.id)}>
                  {t.papers.requestQuoteFor(L(paper.name))}
                </GoldButton>
                <Link
                  href={`/${lang}/papers/${paper.slug}`}
                  onClick={onClose}
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-sm border border-line/30 bg-canvas/70 px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-gold hover:text-accent sm:text-sm"
                >
                  <span>{lang === 'ar' ? 'الصفحة الكاملة' : 'Full Page'}</span>
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
