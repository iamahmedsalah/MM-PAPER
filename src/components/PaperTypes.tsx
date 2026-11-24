'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FileText, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { paperTypes, paperCategories, type PaperType } from '../data/papers';
import PaperModal from './PaperModal';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';

const PaperStack3D = dynamic(() => import('./three/PaperStack3D'), { ssr: false });

function PaperCard({ paper, index, onSpecs }: { paper: PaperType; index: number; onSpecs: () => void }) {
  const { t, L } = useLang();
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [fanned, setFanned] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(201,168,106,0.16), transparent 58%)`;
    }
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <Reveal delay={index * 0.05} className="h-full">
      <article
        ref={cardRef}
        data-card-host
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative flex h-full flex-col overflow-hidden rounded-sm border border-line/20 bg-surface transition-[border-color,box-shadow,transform] duration-300 will-change-transform hover:border-gold hover:shadow-[0_12px_40px_rgba(201,168,106,0.14)]"
      >
        <div ref={glowRef} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div
          className="relative h-44 overflow-hidden border-b border-line/15 sm:h-48"
          style={{
            background: 'linear-gradient(160deg, var(--thumb-grad-a), var(--thumb-grad-b))',
          }}
        >
          <PaperStack3D type={paper.id} active={fanned} className="h-full w-full" />

          <button
            type="button"
            onClick={() => setFanned((v) => !v)}
            aria-pressed={fanned}
            aria-label={`${L(paper.name)} — ${fanned ? t.papers.fanClose : t.papers.fanOpen}`}
            title={fanned ? t.papers.fanClose : t.papers.fanOpen}
            className={`absolute end-2 top-2 z-10 inline-flex h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold backdrop-blur-sm transition-colors duration-200 ${
              fanned
                ? 'border-gold bg-gold text-midnight'
                : 'border-line/30 bg-canvas/75 text-ink hover:border-gold hover:text-accent'
            }`}
          >
            <Layers size={14} aria-hidden />
            <span>3D</span>
          </button>
        </div>

        <div className="relative z-[2] flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-heading text-xl font-semibold text-ink">{L(paper.name)}</h3>
            <span className="shrink-0 text-xs font-semibold tracking-wide text-accent" dir="ltr">
              {paper.gsmRange}
            </span>
          </div>
          <p className="mt-3 flex-1 text-sm leading-[160%] text-inkMuted">{L(paper.description)}</p>
          <p className="tracking-brand mt-4 text-[11px] text-inkSubtle">
            {t.categories[paper.category]} — {L(paper.bestUse)}
          </p>
          <button
            type="button"
            onClick={onSpecs}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 self-start rounded-sm px-1 text-sm font-semibold text-accent transition-colors hover:text-accentStrong"
            aria-label={t.a11y.specsBtn(L(paper.name))}
          >
            <FileText size={16} aria-hidden />
            <span>{t.papers.getSpecs}</span>
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function PaperTypes({ onRequestQuote }: { onRequestQuote: (paperId: string) => void }) {
  const { t } = useLang();
  const [filter, setFilter] = useState<(typeof paperCategories)[number]>('All');
  const [selected, setSelected] = useState<PaperType | null>(null);
  const visible = paperTypes.filter((p) => filter === 'All' || p.category === filter);

  return (
    <section id="paper-types" className="relative overflow-hidden bg-canvasAlt py-20 md:py-28">
      <AmbientPaperBackdrop variant="catalog" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.papers.eyebrow} title={t.papers.title} intro={t.papers.intro} />

        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label={t.papers.filterLabel}
            >
              {paperCategories.map((cat) => {
                const active = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(cat)}
                    className={`relative inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? 'border-gold text-midnight'
                        : 'border-line/25 bg-surface/60 text-inkMuted hover:border-gold hover:text-accent'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="paper-filter-pill"
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 rounded-full bg-gold"
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10">{cat === 'All' ? t.papers.all : t.categories[cat]}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-inkSubtle">
              <span>{t.papers.count(visible.length)}</span>
              <span aria-hidden>·</span>
              <span>{t.papers.interactiveHint}</span>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <PaperCard key={p.id} paper={p} index={i} onSpecs={() => setSelected(p)} />
          ))}
        </div>
      </div>

      <PaperModal
        paper={selected}
        onClose={() => setSelected(null)}
        onRequestQuote={(paperId) => {
          setSelected(null);
          onRequestQuote(paperId);
        }}
      />
    </section>
  );
}
