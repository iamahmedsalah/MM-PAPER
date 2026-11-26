'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Camera, FileText, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { paperTypes, paperCategories, type PaperType } from '../data/papers';
import PaperModal from './PaperModal';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';

const PaperStack3D = dynamic(() => import('./three/PaperStack3D'), { ssr: false });

function PaperCard({ paper, index, onSpecs }: { paper: PaperType; index: number; onSpecs: () => void }) {
  const { lang, t, L } = useLang();
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [fanned, setFanned] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

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
          {showPhoto ? (
            <button
              type="button"
              onClick={onSpecs}
              className="group/photo relative block h-full w-full text-start"
              aria-label={t.a11y.specsBtn(L(paper.name))}
            >
              <Image
                src={paper.image}
                alt={`${L(paper.name)} — ${L(paper.surfaceFinish)}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover/photo:scale-105"
              />
            </button>
          ) : (
            <PaperStack3D type={paper.id} active={fanned} className="h-full w-full" />
          )}

          <div className="absolute end-2 top-2 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPhoto((v) => !v)}
              aria-pressed={showPhoto}
              aria-label={`${L(paper.name)} — ${showPhoto ? t.papers.view3D : t.papers.viewPhoto}`}
              title={showPhoto ? t.papers.view3D : t.papers.viewPhoto}
              className={`inline-flex h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold backdrop-blur-sm transition-colors duration-200 ${
                showPhoto
                  ? 'border-gold bg-gold text-midnight'
                  : 'border-line/30 bg-canvas/75 text-ink hover:border-gold hover:text-accent'
              }`}
            >
              <Camera size={13} aria-hidden />
              <span>{t.papers.viewPhoto}</span>
            </button>

            {!showPhoto && (
              <button
                type="button"
                onClick={() => setFanned((v) => !v)}
                aria-pressed={fanned}
                aria-label={`${L(paper.name)} — ${fanned ? t.papers.fanClose : t.papers.fanOpen}`}
                title={fanned ? t.papers.fanClose : t.papers.fanOpen}
                className={`inline-flex h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold backdrop-blur-sm transition-colors duration-200 ${
                  fanned
                    ? 'border-gold bg-gold text-midnight'
                    : 'border-line/30 bg-canvas/75 text-ink hover:border-gold hover:text-accent'
                }`}
              >
                <Layers size={14} aria-hidden />
                <span>3D</span>
              </button>
            )}
          </div>
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onSpecs}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm px-1 text-sm font-semibold text-accent transition-colors hover:text-accentStrong"
              aria-label={t.a11y.specsBtn(L(paper.name))}
            >
              <FileText size={16} aria-hidden />
              <span>{t.papers.getSpecs}</span>
            </button>
            <Link
              href={`/${lang}/papers/${paper.slug}`}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-sm px-1.5 text-xs font-medium text-inkSubtle transition-colors hover:text-accent"
            >
              <span>{lang === 'ar' ? 'صفحة الصنف' : 'Full Page'}</span>
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function PaperTypes({ onRequestQuote }: { onRequestQuote: (paperId: string) => void }) {
  const { lang, t, L } = useLang();
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

        <Reveal delay={0.12}>
          <div className="mt-12 overflow-hidden rounded-sm border border-line/20 bg-surface md:mt-16">
            <div className="border-b border-line/15 px-5 py-4 sm:px-6">
              <h3 className="font-heading text-base font-semibold text-ink sm:text-lg">{t.papers.tableTitle}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-start text-sm">
                <caption className="sr-only">{t.papers.tableSummary}</caption>
                <thead>
                  <tr className="border-b border-line/15 bg-canvasAlt/60 text-xs font-semibold text-accent">
                    <th scope="col" className="px-5 py-3.5 text-start sm:px-6">
                      {t.papers.colGrade}
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-start">
                      {t.papers.colCategory}
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-start">
                      {t.papers.colGsm}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-start sm:px-6">
                      {t.papers.colBestUse}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/10">
                  {paperTypes.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-canvas/40">
                      <td className="px-5 py-3.5 font-medium text-ink sm:px-6">
                        <Link
                          href={`/${lang}/papers/${p.slug}`}
                          className="transition-colors hover:text-accent hover:underline"
                        >
                          {L(p.name)}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-inkSubtle">{t.categories[p.category]}</td>
                      <td className="px-4 py-3.5 font-medium text-accent" dir="ltr">
                        {p.gsmRange}
                      </td>
                      <td className="px-5 py-3.5 text-inkMuted sm:px-6">{L(p.bestUse)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
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
