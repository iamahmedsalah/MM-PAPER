'use client';

import { Clock, Mail, Phone, MessageCircle, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { GoldLink, GhostLink } from './ui/Buttons';
import { Reveal } from './ui/Reveal';
import { COMPANY_CONTACT, COMPANY_LOCATION } from '../data/contact';
import { useLang } from '../i18n/LanguageContext';
import { scrollToSection } from '../lib/scroll';

export default function Location() {
  const { t, lang } = useLang();

  return (
    <section id="location" className="relative overflow-hidden bg-canvasAlt py-20 md:py-28">
      <AmbientPaperBackdrop variant="location" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.location.eyebrow} title={t.location.title} intro={t.location.intro} />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-sm border border-line/25 bg-canvas shadow-card">
              <iframe
                title={t.location.mapTitle}
                src={COMPANY_LOCATION.getEmbedUrl(lang)}
                className="mm-map-embed block h-[280px] w-full sm:h-[360px] md:h-[460px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line/20"
              />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-start justify-start sm:inset-x-4 sm:bottom-4">
                <div className="pointer-events-auto inline-flex max-w-md items-start gap-2.5 rounded-sm border border-line/35 bg-surface/95 px-3.5 py-2.5 text-xs font-medium leading-[160%] text-ink shadow-lg backdrop-blur-md sm:text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{t.location.address}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-sm border border-line/20 bg-surface p-6 sm:p-8">
              <div>
                <h3 className="font-heading text-xl font-semibold text-ink">{t.location.cardTitle}</h3>
                <div className="mt-4 flex items-start gap-3">
                  <MapPin size={18} className="mt-1 shrink-0 text-accent" aria-hidden />
                  <address className="not-italic leading-[160%] text-inkMuted">{t.location.address}</address>
                </div>
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
                      className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-accent"
                    >
                      <span>{t.contact.whatsapp}</span>
                      <span aria-hidden>—</span>
                      <bdi dir="ltr">{COMPANY_CONTACT.phoneDisplay}</bdi>
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
              <div className="flex flex-col gap-3">
                <GoldLink
                  href={COMPANY_LOCATION.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <span>{t.location.directions}</span>
                  <ExternalLink size={16} aria-hidden />
                </GoldLink>
                <GhostLink
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="w-full"
                >
                  <span>{t.location.scheduleVisit}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
                </GhostLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
