'use client';

import { Clock, Mail, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { GoldLink } from './ui/Buttons';
import { Reveal } from './ui/Reveal';
import { COMPANY_CONTACT } from '../data/contact';
import { useLang } from '../i18n/LanguageContext';
import { scrollToSection } from '../lib/scroll';
import { useTheme } from '../theme/ThemeContext';

export default function Location() {
  const { t } = useLang();
  const { theme } = useTheme();

  return (
    <section id="location" className="relative overflow-hidden bg-canvasAlt py-20 md:py-28">
      <AmbientPaperBackdrop variant="location" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.location.eyebrow} title={t.location.title} intro={t.location.intro} />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-sm border border-line/20 bg-surface">
              <iframe
                title={t.location.mapTitle}
                src="https://www.openstreetmap.org/export/embed.html?bbox=31.05%2C29.90%2C31.55%2C30.20&layer=mapnik&marker=30.0444%2C31.2357"
                className={`h-[280px] w-full sm:h-[360px] md:h-[460px] ${
                  theme === 'dark' ? 'grayscale-[30%] contrast-[1.06] brightness-90' : ''
                }`}
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-sm border border-line/20 bg-surface p-6 sm:p-8">
              <div>
                <h3 className="font-heading text-xl font-semibold text-ink">{t.location.cardTitle}</h3>
                <address className="mt-4 not-italic leading-[160%] text-inkMuted">{t.location.address}</address>
                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-start gap-3 py-2 text-inkMuted">
                    <Clock size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    <span>
                      {t.location.hoursSat}
                      <br />
                      {t.location.hoursFri}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-inkMuted">
                    <Phone size={18} className="shrink-0 text-accent" aria-hidden />
                    <a
                      href={COMPANY_CONTACT.phoneHref}
                      className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent"
                      dir="ltr"
                    >
                      {COMPANY_CONTACT.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-inkMuted">
                    <MessageCircle size={18} className="shrink-0 text-accent" aria-hidden />
                    <a
                      href={COMPANY_CONTACT.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent"
                      dir="rtl"
                    >
                      {t.contact.whatsapp} — {COMPANY_CONTACT.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-inkMuted">
                    <Mail size={18} className="shrink-0 text-accent" aria-hidden />
                    <a
                      href={COMPANY_CONTACT.salesEmailHref}
                      className="inline-flex min-h-[44px] items-center transition-colors hover:text-accent"
                      dir="ltr"
                    >
                      {COMPANY_CONTACT.salesEmail}
                    </a>
                  </li>
                </ul>
              </div>
              <GoldLink
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="w-full"
              >
                <span>{t.location.directions}</span>
                <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
              </GoldLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
