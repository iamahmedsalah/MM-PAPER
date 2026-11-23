'use client';

import { useRef } from 'react';
import { Factory, Scissors, FlaskConical, Package, Warehouse, Truck } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { services, type Service } from '../data/services';
import { Reveal } from './ui/Reveal';
import { useLang } from '../i18n/LanguageContext';

const iconMap: Record<string, typeof Factory> = {
  Factory,
  Scissors,
  FlaskConical,
  Package,
  Warehouse,
  Truck,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { L } = useLang();
  const Icon = iconMap[service.icon] ?? Factory;
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
    <section id="services" className="relative bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
