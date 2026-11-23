'use client';

import { Linkedin } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { managers } from '../data/managers';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';

function ManagerCard({ manager, index }: { manager: (typeof managers)[number]; index: number }) {
  const { t, lang } = useLang();
  const name = lang === 'ar' ? manager.nameAr : manager.name;
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line/20 bg-surface p-6 transition-all duration-300 hover:border-gold hover:shadow-[0_12px_40px_rgba(201,168,106,0.14)] sm:p-7">
        <span
          aria-hidden
          className="absolute end-0 top-0 h-10 w-10 border-b border-s border-gold/50 transition-all duration-300 group-hover:h-14 group-hover:w-14"
        />
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label={`${name} — ${t.managers.eyebrow}`}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-line/25 bg-canvas/80 font-heading text-lg font-bold text-accent sm:h-20 sm:w-20 sm:text-xl"
          >
            {manager.initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold text-ink">{name}</h3>
            <p className="mt-0.5 text-sm font-medium text-accent">{manager.role[lang]}</p>
          </div>
        </div>
        <p className="mt-5 flex-1 text-sm leading-[160%] text-inkMuted">{manager.bio[lang]}</p>
        <a
          href={manager.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} ${t.managers.linkedinLabel}`}
          title={`${name} ${t.managers.linkedinLabel}`}
          className="mt-6 inline-flex h-[44px] w-[44px] items-center justify-center self-start rounded-sm border border-line/25 text-inkMuted transition-all duration-200 hover:border-gold hover:text-accent"
        >
          <Linkedin size={18} aria-hidden />
        </a>
      </article>
    </Reveal>
  );
}

export default function Managers() {
  const { t } = useLang();
  return (
    <section id="managers" className="relative bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.managers.eyebrow} title={t.managers.title} intro={t.managers.intro} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {managers.map((m, i) => (
            <ManagerCard key={m.id} manager={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
