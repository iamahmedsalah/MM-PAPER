'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Camera, ChevronRight, FileText, Grid2X2, Layers, Table2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { paperCategories, paperTypes, type PaperType } from '../data/papers';
import PaperModal from './PaperModal';
import { Reveal } from './ui/Reveal';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
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
              <span>{showPhoto ? t.papers.view3D : t.papers.viewPhoto}</span>
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
          <h3 className="font-heading text-xl font-semibold text-ink">{L(paper.name)}</h3>
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
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [selected, setSelected] = useState<PaperType | null>(null);
  const visible = paperTypes.filter((paper) => filter === 'All' || paper.category === filter);
  const viewOptions = [
    { value: 'grid', label: t.papers.gridView, icon: Grid2X2 },
    { value: 'table', label: t.papers.tableView, icon: Table2 },
  ] as const;

  return (
    <section id="paper-types" className="relative overflow-hidden bg-canvasAlt py-20 md:py-28">
      <AmbientPaperBackdrop variant="catalog" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.papers.eyebrow} title={t.papers.title} intro={t.papers.intro} />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.papers.filterLabel}>
            {paperCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
                className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  filter === category
                    ? 'border-gold bg-gold text-midnight'
                    : 'border-line/25 bg-surface text-inkMuted hover:border-gold hover:text-accent'
                }`}
              >
                {category === 'All' ? t.papers.all : t.categories[category]}
              </button>
            ))}
          </div>
          <div className="flex max-w-full items-center gap-1 rounded-sm border border-line/20 bg-surface p-1" role="group" aria-label={t.papers.viewLabel}>
            {viewOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-sm px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  view === value ? 'bg-gold text-midnight' : 'text-inkMuted hover:bg-canvasAlt hover:text-accent'
                }`}
              >
                <Icon size={16} className="shrink-0" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} onSpecs={() => setSelected(paper)} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-line/20 bg-surface">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="sr-only">{t.papers.tableSummary}</caption>
              <thead>
                <tr className="border-b border-line/20 bg-canvasAlt/60 text-accent">
                  <th scope="col" className="px-4 py-3 text-start font-semibold sm:px-6">
                    {t.papers.colGrade}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/15">
                {visible.map((paper) => (
                  <tr key={paper.id}>
                    <td className="p-0">
                      <Link
                        href={`/${lang}/papers/${paper.slug}`}
                        className="flex min-h-[52px] items-center justify-between gap-4 px-4 py-3 text-start text-base font-semibold text-ink transition-colors hover:bg-canvasAlt hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold sm:px-6"
                      >
                        <span className="min-w-0 break-words">{L(paper.name)}</span>
                        <ChevronRight size={18} className="shrink-0 text-accent rtl:rotate-180" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
