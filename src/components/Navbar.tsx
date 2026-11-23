'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLogo from './ui/BrandLogo';
import { GoldLink } from './ui/Buttons';
import LanguageToggle from './ui/LanguageToggle';
import ThemeToggle from './ui/ThemeToggle';
import { useLang } from '../i18n/LanguageContext';
import { SECTION_IDS, scrollToSection } from '../lib/scroll';

const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const { t, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const links = [
    { href: '#home', label: t.nav.home },
    { href: '#services', label: t.nav.services },
    { href: '#paper-types', label: t.nav.paperTypes },
    { href: '#about', label: t.nav.about },
    { href: '#managers', label: t.nav.managers },
    { href: '#location', label: t.nav.location },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeDrawer = false) => {
    event.preventDefault();
    if (closeDrawer) setOpen(false);
    scrollToSection(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const slideOffset = lang === 'ar' ? '-100%' : '100%';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? 'border-b border-line/15 bg-canvas/90 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 md:px-8"
          aria-label={t.nav.mainLabel}
        >
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex min-h-[44px] min-w-0 items-center gap-2.5 rounded-sm"
            aria-label={t.a11y.backHome}
          >
            <BrandLogo className="h-7 w-auto shrink-0 sm:h-8" alt={t.brand} width={80} height={32} />
            <span className="tracking-brand hidden truncate text-xs font-semibold text-ink sm:block">
              {t.brand}
            </span>
          </a>

          <ul className="hidden items-center gap-5 xl:flex">
            {links.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`text-sm font-medium transition-colors duration-200 hover:text-accent ${
                      isActive ? 'text-accent' : 'text-inkMuted'
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LanguageToggle compact />
            <GoldLink
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden !min-h-[44px] !px-5 !py-2.5 lg:inline-flex"
            >
              {t.nav.quote}
            </GoldLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              title={open ? t.nav.closeMenu : t.nav.openMenu}
              className="relative inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-sm border border-line/25 bg-surface/85 text-ink transition-colors hover:border-gold xl:hidden"
            >
              <span className="flex h-4 w-5 flex-col justify-between" aria-hidden>
                <span
                  className={`h-[2px] w-full origin-center rounded-full bg-current transition-transform duration-200 ${
                    open ? 'translate-y-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-current transition-opacity duration-200 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`h-[2px] w-full origin-center rounded-full bg-current transition-transform duration-200 ${
                    open ? '-translate-y-[7px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mobilePanelLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] xl:hidden"
          >
            <div
              className="absolute inset-0 bg-midnight/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ x: slideOffset }}
              animate={{ x: '0%' }}
              exit={{ x: slideOffset }}
              transition={{ duration: 0.28, ease: PAPER_EASE }}
              className="absolute inset-y-0 end-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col border-s border-line/20 bg-canvas shadow-2xl"
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line/15 px-5">
                <span className="flex items-center gap-2.5">
                  <BrandLogo className="h-7 w-auto" decorative width={64} height={32} />
                  <span className="tracking-brand text-xs font-semibold text-ink">{t.brand}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-sm border border-line/25 text-ink hover:border-gold hover:text-accent"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
                    <span className="absolute h-[2px] w-4 rotate-45 rounded-full bg-current" />
                    <span className="absolute h-[2px] w-4 -rotate-45 rounded-full bg-current" />
                  </span>
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
                <ul className="flex flex-col">
                  {links.map((l) => {
                    const isActive = activeSection === l.href.slice(1);
                    return (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          onClick={(e) => handleNavClick(e, l.href, true)}
                          aria-current={isActive ? 'location' : undefined}
                          className={`flex min-h-[48px] items-center border-b border-line/10 text-base font-medium transition-colors hover:text-accent ${
                            isActive ? 'text-accent' : 'text-ink'
                          }`}
                        >
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex flex-col gap-3 rounded-sm border border-line/15 bg-surface/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <LanguageToggle />
                  </div>
                  <ThemeToggle segmented className="w-full justify-between" />
                </div>
              </div>

              <div className="border-t border-line/15 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                <GoldLink
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact', true)}
                  className="w-full"
                >
                  {t.nav.quote}
                </GoldLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
