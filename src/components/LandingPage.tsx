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
import Faq from './Faq';
import ContactForm from './ContactForm';
import Footer from './Footer';
import { useLang } from '../i18n/LanguageContext';
import {
  consumePendingLangSwitchSection,
  SCROLL_SECTION_EVENT,
  SCROLL_TOP_EVENT,
  scrollToSection,
  type ScrollEventDetail,
} from '../lib/scroll';

export default function LandingPage() {
  const { t } = useLang();
  const [quotePaperId, setQuotePaperId] = useState<string>('');

  useEffect(() => {
    const paramPaper = new URLSearchParams(window.location.search).get('paper');
    if (paramPaper) {
      setQuotePaperId(paramPaper);
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let lenis: Lenis | null = null;
    let raf = 0;

    if (!reduced && !coarse) {
      lenis = new Lenis({
        duration: 1.05,
        anchors: false,
        easing: (p: number) => Math.min(1, 1.001 - Math.pow(2, -10 * p)),
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onScrollTop = (event: Event) => {
      const detail = (event as CustomEvent<ScrollEventDetail>).detail;
      lenis?.scrollTo(0, { immediate: Boolean(detail?.instant) });
    };

    const onScrollSection = (event: Event) => {
      const detail = (event as CustomEvent<ScrollEventDetail>).detail;
      if (!detail?.id || !lenis) return;
      const target = document.getElementById(detail.id);
      if (target) {
        lenis.scrollTo(target, { immediate: Boolean(detail.instant) });
      }
    };

    window.addEventListener(SCROLL_TOP_EVENT, onScrollTop);
    window.addEventListener(SCROLL_SECTION_EVENT, onScrollSection);

    const pendingSection = consumePendingLangSwitchSection();
    let restoreRaf = 0;
    let restoreSettleTimer = 0;
    let hashTimer = 0;

    if (pendingSection) {
      const restoreSection = () => {
        if (pendingSection === 'home') {
          lenis?.scrollTo(0, { immediate: true });
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          return;
        }
        const target = document.getElementById(pendingSection);
        if (target) {
          lenis?.scrollTo(target, { immediate: true });
          target.scrollIntoView({ behavior: 'instant' });
        }
      };
      restoreRaf = window.requestAnimationFrame(restoreSection);
      restoreSettleTimer = window.setTimeout(restoreSection, 80);
    } else if (window.location.hash) {
      // Handle direct external deep links (e.g. /ar#paper-types) once initial Preloader settles.
      const targetId = window.location.hash.slice(1);
      hashTimer = window.setTimeout(
        () => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
        },
        reduced ? 120 : 950
      );
    }

    return () => {
      window.cancelAnimationFrame(restoreRaf);
      window.clearTimeout(restoreSettleTimer);
      window.clearTimeout(hashTimer);
      window.removeEventListener(SCROLL_TOP_EVENT, onScrollTop);
      window.removeEventListener(SCROLL_SECTION_EVENT, onScrollSection);
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  const handleRequestQuote = useCallback((paperId: string) => {
    setQuotePaperId(paperId);
    window.setTimeout(() => {
      scrollToSection('contact');
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
        <Faq />
        <ContactForm preselectedPaperId={quotePaperId} />
      </main>

      <Footer />
      <SocialDock />
      <BackToTop />
    </div>
  );
}
