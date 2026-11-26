'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import { Reveal } from './ui/Reveal';
import { faqItems } from '../data/faq';
import { useLang } from '../i18n/LanguageContext';

export default function Faq() {
  const { t, L } = useLang();
  const [openId, setOpenId] = useState<string>(faqItems[0].id);

  return (
    <section id="faq" className="relative overflow-hidden bg-canvas py-20 md:py-28">
      <AmbientPaperBackdrop variant="services" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow={t.faq.eyebrow} title={t.faq.title} intro={t.faq.intro} />

        <div className="max-w-4xl space-y-3">
          {faqItems.map((item, idx) => {
            const expanded = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-trigger-${item.id}`;

            return (
              <Reveal key={item.id} delay={idx * 0.04}>
                <div
                  className={`rounded-sm border transition-colors duration-200 ${
                    expanded
                      ? 'border-gold/55 bg-surface shadow-[0_8px_28px_rgba(201,168,106,0.08)]'
                      : 'border-line/20 bg-surface/85 hover:border-gold/40'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpenId(expanded ? '' : item.id)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-start font-heading text-base font-semibold text-ink transition-colors hover:text-accent sm:px-6 sm:text-lg"
                    >
                      <span>{L(item.question)}</span>
                      <ChevronDown
                        size={18}
                        aria-hidden
                        className={`shrink-0 text-accent transition-transform duration-300 ${
                          expanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </h3>

                  {/* Answer remains mounted in SSR DOM for search and AI crawlers */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-75'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-line/10 px-5 pb-5 pt-3.5 text-sm leading-[170%] text-inkMuted sm:px-6 sm:text-base">
                        {L(item.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
