'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { paperCategories, paperTypes } from '../data/papers';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { useLang } from '../i18n/LanguageContext';

export default function PaperTypes() {
  const { lang, t, L } = useLang();
  const [filter, setFilter] = useState<(typeof paperCategories)[number]>('All');
  const visible = paperTypes.filter((paper) => filter === 'All' || paper.category === filter);

  return (
    <section id="paper-types" className="relative overflow-hidden bg-canvasAlt py-20 md:py-28">
      <AmbientPaperBackdrop variant="catalog" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.papers.eyebrow} title={t.papers.title} intro={t.papers.intro} />

        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t.papers.filterLabel}>
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
      </div>
    </section>
  );
}
