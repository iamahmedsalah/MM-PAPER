'use client';

import { BookOpen, Package, PenTool, Printer, Sparkles, HardHat } from 'lucide-react';
import { useCases } from '../data/site';
import { Reveal, LineReveal } from './ui/Reveal';
import BrandLogo from './ui/BrandLogo';
import { useLang } from '../i18n/LanguageContext';

const iconMap: Record<string, typeof Printer> = {
  Printer,
  Package,
  BookOpen,
  PenTool,
  Sparkles,
  HardHat,
};

export default function About() {
  const { t, L } = useLang();
  return (
    <section id="about" className="bg-contrastBand py-20 text-contrastInk md:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="tracking-brand mb-3 text-xs font-semibold text-gold">{t.about.eyebrow}</p>
          </Reveal>
          <h2 className="font-heading text-3xl font-bold leading-[120%] md:text-5xl">
            <LineReveal lines={[t.about.titleA, t.about.titleB]} />
          </h2>
          <Reveal delay={0.18}>
            <div className="mt-6 space-y-4 leading-[165%] opacity-85">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <BrandLogo variant="inverse" alt={t.about.monogramAlt} className="mt-10 h-14 w-auto" width={140} height={56} />
          </Reveal>
        </div>

        <div>
          <Reveal>
            <h3 className="font-heading text-xl font-semibold">{t.about.usesTitle}</h3>
          </Reveal>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {useCases.map((u, i) => {
              const Icon = iconMap[u.icon] ?? Printer;
              return (
                <Reveal key={u.id} delay={i * 0.06}>
                  <div className="group flex h-full flex-col items-start gap-3 rounded-sm border border-contrastInk/15 bg-contrastInk/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg">
                    <span className="inline-flex rounded-sm border border-gold/50 bg-gold/15 p-2.5 text-gold transition-colors group-hover:bg-gold group-hover:text-midnight">
                      <Icon size={20} strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="text-sm font-semibold">{L(u.title)}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
