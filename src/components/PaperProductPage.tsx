'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Package,
  Printer,
  Sparkles,
} from 'lucide-react';
import type { PaperType } from '../data/papers';
import type { PaperDetail } from '../data/paper-details';
import { COMPANY_CONTACT } from '../data/contact';
import { useLang } from '../i18n/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LanguageTransition from './ui/LanguageTransition';
import SocialDock from './ui/SocialDock';
import BackToTop from './ui/BackToTop';
import AmbientPaperBackdrop from './ui/AmbientPaperBackdrop';
import PaperProductStage from './PaperProductStage';

export default function PaperProductPage({
  paper,
  detail,
}: {
  paper: PaperType;
  detail: PaperDetail;
}) {
  const { lang, t, L } = useLang();
  const [openFaq, setOpenFaq] = useState<number>(0);

  const isAr = lang === 'ar';
  const quoteHref = `/${lang}?paper=${paper.id}#contact`;
  const whatsappMessage = isAr
    ? `السلام عليكم، أرغب في عرض سعر لصنف: ${paper.name.ar} من إم إم لصناعة الورق.`
    : `Hello MM Paper Industry, I would like to request a quotation for ${paper.name.en}.`;
  const whatsappHref = `${COMPANY_CONTACT.whatsappHref}?text=${encodeURIComponent(whatsappMessage)}`;

  const specRows = [
    {
      label: isAr ? 'المقاسات المتاحة' : 'Available Dimensions',
      value: L(detail.technical.sizes),
    },
    {
      label: isAr ? 'طبيعة السطح والتشطيب' : 'Surface Finish',
      value: L(paper.surfaceFinish),
    },
    {
      label: isAr ? 'طرق الطباعة والتجهيز المتوافقة' : 'Print & Finishing Compatibility',
      value: L(paper.printMethod),
    },
    {
      label: isAr ? 'الشكل والتجهيز (بكر / شيت)' : 'Supplied Formats',
      value: L(detail.technical.formats),
    },
    {
      label: isAr ? 'أسلوب التغليف' : 'Packaging & Protection',
      value: L(detail.technical.packaging),
    },
    {
      label: isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order Quantity',
      value: L(detail.technical.moq),
    },
    {
      label: isAr ? 'نطاق الشحن والتوريد' : 'Supply & Dispatch Coverage',
      value: L(detail.technical.supplyScope),
    },
  ];

  return (
    <div className="grain-overlay min-h-screen bg-canvas font-body text-ink">
      <LanguageTransition />
      <Navbar />

      <main className="pt-[72px]">
        {/* Hero & Media Showcase */}
        <section className="relative overflow-hidden bg-canvas pb-16 pt-8 md:pb-24 md:pt-12">
          <AmbientPaperBackdrop variant="catalog" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
            {/* Breadcrumb */}
            <nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'} className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-inkSubtle sm:text-sm">
                <li>
                  <Link href={`/${lang}`} className="transition-colors hover:text-accent">
                    {t.nav.home}
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight size={14} className="rtl:rotate-180" />
                </li>
                <li>
                  <Link href={`/${lang}#paper-types`} className="transition-colors hover:text-accent">
                    {t.nav.paperTypes}
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight size={14} className="rtl:rotate-180" />
                </li>
                <li aria-current="page" className="font-semibold text-ink">
                  {L(paper.name)}
                </li>
              </ol>
            </nav>

            <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
              {/* Product Info + CTAs */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-accent">
                    <Sparkles size={13} aria-hidden />
                    <span>{t.categories[paper.category]}</span>
                  </span>
                </div>

                <h1 className="mt-4 font-heading text-3xl font-bold leading-[1.2] text-ink sm:text-4xl lg:text-[2.65rem]">
                  {L(paper.name)}
                </h1>

                <p className="mt-4 text-base leading-[175%] text-inkMuted sm:text-lg">{L(detail.heroSummary)}</p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {paper.specs.map((spec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-sm border border-line/15 bg-surface/70 px-3.5 py-2.5 text-sm text-ink"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                      <span>{L(spec)}</span>
                    </li>
                  ))}
                </ul>

                {/* Primary Conversion Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={quoteHref}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-midnight shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-goldLight hover:shadow-[0_10px_28px_rgba(201,168,106,0.3)]"
                  >
                    <span>{t.papers.requestQuoteFor(L(paper.name))}</span>
                    <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
                  </Link>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-line/35 bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-accent"
                  >
                    <MessageCircle size={17} className="text-accent" aria-hidden />
                    <span>{isAr ? 'واتساب سريع بالصنف' : 'WhatsApp Inquiry'}</span>
                  </a>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/${lang}#paper-types`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-inkSubtle transition-colors hover:text-accent sm:text-sm"
                  >
                    <ArrowLeft size={14} className="rtl:rotate-180" aria-hidden />
                    <span>{isAr ? 'العودة إلى جميع أصناف الورق (10 أصناف)' : 'Back to all 10 paper grades'}</span>
                  </Link>
                </div>
              </div>

              {/* Studio Media Stage (Video / Photo 2.4x Loupe / 3D) */}
              <div>
                <PaperProductStage paper={paper} video={detail.video} />
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specification Table */}
        <section className="relative overflow-hidden bg-canvasAlt py-16 md:py-22">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-2xl">
              <p className="tracking-brand text-xs font-semibold text-accent">
                {isAr ? 'المواصفات الفنية والتوريد' : 'Technical Specifications'}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
                {isAr ? `جدول مواصفات ${L(paper.name)}` : `${L(paper.name)} Technical Datasheet`}
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-sm border border-line/20 bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-start text-sm">
                  <caption className="sr-only">
                    {isAr ? `المواصفات الفنية الكاملة لصنف ${L(paper.name)}` : `Full technical specifications for ${L(paper.name)}`}
                  </caption>
                  <tbody className="divide-y divide-line/15">
                    {specRows.map((row) => (
                      <tr key={row.label} className="transition-colors hover:bg-canvas/40">
                        <th
                          scope="row"
                          className="w-[38%] bg-canvas/45 px-5 py-4 text-start font-semibold text-accent sm:w-[32%] sm:px-6"
                        >
                          {row.label}
                        </th>
                        <td className="px-5 py-4 leading-[165%] text-ink sm:px-6">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Applications & Target Industries */}
        <section className="relative overflow-hidden bg-canvas py-16 md:py-22">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-2xl">
              <p className="tracking-brand text-xs font-semibold text-accent">
                {isAr ? 'الاستخدامات والقطاعات المناسبة' : 'Applications & Target Industries'}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
                {isAr ? `أين يُستخدم ${L(paper.name)}؟` : `Where ${L(paper.name)} Performs Best`}
              </h2>
              <p className="mt-3 text-sm leading-[170%] text-inkMuted sm:text-base">{L(paper.bestUse)}</p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {detail.applications.map((app, idx) => (
                <article
                  key={idx}
                  className="rounded-sm border border-line/20 bg-surface p-6 transition-colors hover:border-gold/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/35 bg-gold/10 text-accent">
                      {idx % 2 === 0 ? <Package size={17} aria-hidden /> : <Printer size={17} aria-hidden />}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-ink">{L(app.title)}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-[170%] text-inkMuted">{L(app.detail)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Product-Specific FAQ (Always mounted in SSR DOM for SEO & AI Crawlers) */}
        <section className="relative overflow-hidden bg-canvasAlt py-16 md:py-22">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="text-center">
              <p className="tracking-brand text-xs font-semibold text-accent">
                {isAr ? 'أسئلة فنية شائعة' : 'Product FAQ'}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
                {isAr ? `الأسئلة الشائعة حول ${L(paper.name)}` : `Frequently Asked Questions — ${L(paper.name)}`}
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {detail.faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-sm border border-line/20 bg-surface transition-colors hover:border-gold/50"
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-semibold text-ink sm:px-6 sm:text-base"
                      >
                        <span>{L(item.question)}</span>
                        <ChevronDown
                          size={18}
                          aria-hidden
                          className={`shrink-0 text-accent transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </h3>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-line/10 px-5 pb-4 pt-3 text-sm leading-[175%] text-inkMuted sm:px-6">
                          {L(item.answer)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-canvas px-5 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto max-w-7xl">
            {/* Bottom Conversion Band */}
            <div className="rounded-sm border border-gold/35 bg-surface p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
              <div className="max-w-2xl">
                <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                  {isAr
                    ? `جاهز لطلب ${L(paper.name)} بمقاساتك وأوزانك؟`
                    : `Ready to source ${L(paper.name)} to your exact specs?`}
                </h2>
                <p className="mt-2 text-sm leading-[165%] text-inkMuted">
                  {isAr
                    ? 'فريق إم إم لصناعة الورق في برج العرب الجديدة يجهّز عرض سعر فوري للأفرخ والبكرات مع شحن منتظم لجميع المحافظات.'
                    : 'Our New Borg El Arab converting and sales team prepares fast wholesale quotes for sheets and reels with nationwide Egypt dispatch.'}
                </p>
              </div>
              <div className="mt-5 flex shrink-0 flex-wrap gap-3 md:mt-0">
                <Link
                  href={quoteHref}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-midnight transition-colors hover:bg-goldLight"
                >
                  <span>{isAr ? 'اطلب عرض سعر الآن' : 'Request a Quote'}</span>
                  <ArrowRight size={15} className="rtl:rotate-180" aria-hidden />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-sm border border-line/35 bg-canvas px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-accent"
                >
                  <MessageCircle size={16} className="text-accent" aria-hidden />
                  <span>{t.contact.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SocialDock />
      <BackToTop />
    </div>
  );
}
