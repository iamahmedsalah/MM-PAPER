'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { GoldButton, GhostLink } from './ui/Buttons';
import { LineReveal, Reveal } from './ui/Reveal';
import { stats } from '../data/site';
import Counter from './Counter';
import { useLang } from '../i18n/LanguageContext';

const Hero3D = dynamic(() => import('./three/Hero3D'), { ssr: false });

function StatsStrip() {
  const { L } = useLang();
  return (
    <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line/20 bg-line/20 sm:mt-14 md:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label.en} className="bg-surface/85 p-4 backdrop-blur-sm sm:p-5 md:p-6">
          <Reveal delay={i * 0.08}>
            <dd className="font-heading text-2xl font-bold text-accent md:text-3xl" dir="ltr">
              <Counter value={s.value} />
              {s.suffix}
            </dd>
            <dt className="tracking-brand mt-1 text-[11px] text-inkSubtle sm:text-xs">{L(s.label)}</dt>
          </Reveal>
        </div>
      ))}
    </dl>
  );
}

export default function Hero() {
  const { t, lang } = useLang();
  const scrollRef = useRef(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = heroRef.current;
        if (!el) return;
        const total = el.offsetHeight || 1;
        scrollRef.current = Math.min(1, Math.max(0, window.scrollY / total));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-[100dvh] overflow-hidden bg-canvas">
      <Hero3D scrollRef={scrollRef} />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'var(--hero-vignette)' }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-5 pb-12 pt-24 sm:pb-16 sm:pt-28 md:px-8">
        <div className="max-w-xl rounded-sm bg-canvas/55 p-4 backdrop-blur-[2px] sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <Reveal>
            <p className="tracking-brand mb-4 inline-flex items-center gap-3 text-xs font-semibold text-accent sm:mb-5">
              <span className="h-px w-8 bg-gold sm:w-10" aria-hidden />
              {t.hero.eyebrow}
            </p>
          </Reveal>

          <h1
            className={`font-heading text-[clamp(2.15rem,6.5vw,4rem)] font-extrabold text-ink ${
              lang === 'ar' ? 'leading-[125%]' : 'leading-[112%]'
            }`}
          >
            <LineReveal lines={[t.hero.titleA]} />
            <span className="relative inline-block">
              <LineReveal lines={[t.hero.titleB]} />
              <motion.span
                aria-hidden
                className="absolute -bottom-1 start-0 h-[3px] w-full origin-left rounded-full bg-gold rtl:origin-right"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </h1>

          <Reveal delay={0.35}>
            <p className="mt-5 max-w-md text-base leading-[160%] text-inkMuted sm:mt-6">{t.hero.sub}</p>
          </Reveal>

          <Reveal delay={0.48}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <GoldButton
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.hero.ctaQuote}
              </GoldButton>
              <GhostLink href="#paper-types" className="w-full sm:w-auto">
                {t.hero.ctaExplore}
              </GhostLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-auto pt-10 sm:pt-12">
          <StatsStrip />
        </div>
      </div>
    </section>
  );
}
