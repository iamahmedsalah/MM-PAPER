'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SectionHeader from './SectionHeader';
import { managers } from '../data/managers';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';

function ManagerCard({ manager, index }: { manager: (typeof managers)[number]; index: number }) {
  const { lang } = useLang();
  const name = lang === 'ar' ? manager.nameAr : manager.name;
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(950px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(201,168,106,0.18), transparent 56%)`;
    }
  };

  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line/20 bg-surface transition-[border-color,box-shadow,transform] duration-300 will-change-transform hover:border-gold hover:shadow-[0_12px_40px_rgba(201,168,106,0.14)]"
      >
        <div ref={glowRef} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-line/15 bg-canvasAlt">
          <Image
            src={`${manager.photo}?v=${manager.photoVersion}`}
            alt={`${name} — ${manager.role[lang]}`}
            fill
            loading={index === 0 ? 'eager' : 'lazy'}
            quality={82}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B1020]/85 via-[#0B1020]/30 to-transparent"
          />
          <span
            dir="ltr"
            className="tracking-brand absolute bottom-3 start-3 inline-flex items-center rounded-sm border border-gold/45 bg-[#0B1020]/85 px-2.5 py-1 text-[11px] font-bold text-gold backdrop-blur-sm"
          >
            {manager.positionCode}
          </span>
        </div>

        <div className="relative z-[2] flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-heading text-lg font-semibold text-ink">{name}</h3>
          <p className="mt-1 text-sm font-medium text-accent">{manager.role[lang]}</p>
          <p className="mt-4 flex-1 text-sm leading-[160%] text-inkMuted">{manager.bio[lang]}</p>
        </div>
      </article>
    </Reveal>
  );
}

export default function Managers() {
  const { t } = useLang();
  return (
    <section id="managers" className="relative overflow-hidden bg-canvas py-20 md:py-28">
      <AmbientPaperBackdrop variant="leadership" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.managers.eyebrow} title={t.managers.title} intro={t.managers.intro} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {managers.map((m, i) => (
            <ManagerCard key={m.id} manager={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
