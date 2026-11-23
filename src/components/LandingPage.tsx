'use client';

import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import Preloader from './ui/Preloader';
import LanguageTransition from './ui/LanguageTransition';
import BackToTop from './ui/BackToTop';
import SocialDock from './ui/SocialDock';
import Navbar from './Navbar';
import Hero from './Hero';
import Marquee from './Marquee';
import Services from './Services';
import PaperTypes from './PaperTypes';
import About from './About';
import Managers from './Managers';
import Location from './Location';
import ContactForm from './ContactForm';
import Footer from './Footer';
import { useLang } from '../i18n/LanguageContext';

export default function LandingPage() {
  const { t } = useLang();
  const [quotePaperId, setQuotePaperId] = useState<string>('kraft');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      anchors: true,
      easing: (p: number) => Math.min(1, 1.001 - Math.pow(2, -10 * p)),
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const handleRequestQuote = useCallback((paperId: string) => {
    setQuotePaperId(paperId);
    window.setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <div className="grain-overlay min-h-screen bg-canvas font-body text-ink">
      <Preloader />
      <LanguageTransition />

      <a
        href="#paper-types"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[110] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-midnight focus:shadow-lg"
      >
        {t.a11y.skip}
      </a>

      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Services />
        <PaperTypes onRequestQuote={handleRequestQuote} />
        <About />
        <Managers />
        <Location />
        <ContactForm preselectedPaperId={quotePaperId} />
      </main>

      <Footer />
      <SocialDock />
      <BackToTop />
    </div>
  );
}
