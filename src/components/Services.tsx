'use client';

import { useRef } from 'react';
import { Globe, Warehouse, Scissors, SlidersHorizontal, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { services, type Service } from '../data/services';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { GoldButton } from './ui/Buttons';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';
import { scrollToSection } from '../lib/scroll';

const iconMap: Record<string, typeof Globe> = {
  Globe,
  Warehouse,
  Scissors,
  SlidersHorizontal,
  Truck,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { L } = useLang();
  const Icon = iconMap[service.icon] ?? Globe;
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(201,168,106,0.18), transparent 55%)`;
    }
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = '';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative h-full overflow-hidden rounded-sm border border-line/20 bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 will-change-transform hover:border-gold hover:shadow-[0_12px_40px_rgba(201,168,106,0.14)] sm:p-7"
      >
        <div ref={glowRef} className="pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-10">
          <span className="inline-flex rounded-sm border border-line/25 bg-canvas/70 p-3 text-accent">
            <Icon size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <h3 className="mt-5 font-heading text-lg font-semibold text-ink">{L(service.title)}</h3>
          <p className="mt-3 text-sm leading-[160%] text-inkMuted">{L(service.description)}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="relative overflow-hidden bg-canvas py-20 md:py-28">
      <AmbientPaperBackdrop variant="services" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}

          <Reveal delay={services.length * 0.06} className="h-full">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-sm border border-gold/45 bg-gradient-to-br from-surface via-surface to-gold/10 p-6 shadow-[0_10px_32px_rgba(201,168,106,0.08)] sm:p-7">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" aria-hidden />
              <div>
                <span className="inline-flex rounded-sm border border-gold/40 bg-gold/15 p-3 text-accent">
                  <ShieldCheck size={22} strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-ink">{t.services.goalTitle}</h3>
                <p className="mt-3 text-sm leading-[165%] text-inkMuted">{t.services.goalText}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-sm border border-gold/30 bg-surface/90 p-6 backdrop-blur-sm sm:p-7 md:mt-10 lg:flex-row lg:items-center lg:gap-8">
            <p className="max-w-3xl text-base font-medium leading-[160%] text-ink">{t.services.ctaPrompt}</p>
            <GoldButton
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full shrink-0 sm:w-auto"
            >
              <span>{t.services.ctaButton}</span>
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
