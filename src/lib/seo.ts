import { COMPANY_CONTACT, COMPANY_LOCATION } from '../data/contact.ts';
import { faqItems } from '../data/faq.ts';
import { managers } from '../data/managers.ts';
import { getPaperDetail } from '../data/paper-details.ts';
import { paperTypes, type PaperType } from '../data/papers.ts';
import { services } from '../data/services.ts';
import { socialChannels } from '../data/socials.ts';
import { dictionaries } from '../i18n/translations.ts';
import type { Lang } from '../i18n/types';

export const LOCALES = ['en', 'ar'] as const;
export const CONTENT_LAST_MODIFIED = '2026-11-25';

export function isLocale(value: string): value is Lang {
  return value === 'en' || value === 'ar';
}

const rawOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mm-eg.co').trim();
export const SITE_URL = rawOrigin.replace(/\/+$/, '');

export function buildJsonLd(locale: Lang) {
  const dict = dictionaries[locale];
  const localeUrl = `${SITE_URL}/${locale}`;
  const areaCountry = {
    '@type': 'Country',
    name: locale === 'ar' ? 'مصر' : 'Egypt',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: dict.brand,
        alternateName: locale === 'en' ? dictionaries.ar.brand : dictionaries.en.brand,
        url: localeUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/android-chrome-512.png`,
          contentUrl: `${SITE_URL}/android-chrome-512.png`,
          width: 512,
          height: 512,
          caption: dict.brand,
        },
        image: `${SITE_URL}/android-chrome-512.png`,
        description: dict.seo.description,
        foundingDate: '2006',
        areaServed: areaCountry,
        address: {
          '@type': 'PostalAddress',
          streetAddress:
            locale === 'ar'
              ? 'قطعة 10 - بلوك 2، منطقة الورش والمخازن - شرق المنطقة الصناعية الثانية'
              : 'Plot 10, Block 2, Workshops & Warehouses Zone, East 2nd Industrial Zone',
          addressLocality: locale === 'ar' ? 'برج العرب الجديدة' : 'New Borg El Arab City',
          addressRegion: locale === 'ar' ? 'الإسكندرية' : 'Alexandria',
          addressCountry: 'EG',
        },
        hasMap: COMPANY_LOCATION.googleMapsUrl,
        hasOfferCatalog: { '@id': `${localeUrl}#catalog` },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '09:00',
            closes: '17:00',
          },
        ],
        employee: managers.map((m) => ({
          '@type': 'Person',
          name: locale === 'ar' ? m.nameAr : m.name,
          jobTitle: m.role[locale],
          image: `${SITE_URL}${m.photo}`,
        })),
        sameAs: socialChannels.map((c) => c.href),
        knowsAbout: [
          'Sticker Paper',
          'Coloured Parchment',
          'Bristol Board',
          'Duplex Board — Grey Back',
          'Duplex Board — White Back',
          'Butter Paper',
          'Printing Paper',
          'Copy Paper A4 & A3',
          'Coated Paper (Couche)',
          'Carbon Paper',
          'Paper Importing & Converting',
          'Paper Trading & Wholesale Supply',
          'Custom Paper Cutting & Slitting',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: COMPANY_CONTACT.phoneSchema,
          email: COMPANY_CONTACT.salesEmail,
          contactType: 'sales',
          availableLanguage: ['English', 'Arabic'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: dict.brand,
        alternateName: locale === 'en' ? dictionaries.ar.brand : dictionaries.en.brand,
        inLanguage: locale,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'OfferCatalog',
        '@id': `${localeUrl}#catalog`,
        name: `${dict.brand} — ${dict.papers.eyebrow}`,
        url: `${localeUrl}#paper-types`,
        itemListElement: paperTypes.map((p) => ({
          '@type': 'Offer',
          url: `${SITE_URL}/${locale}/papers/${p.slug}`,
          itemOffered: {
            '@type': 'Product',
            name: `${p.name[locale]} (${p.gsmRange})`,
            url: `${SITE_URL}/${locale}/papers/${p.slug}`,
            description: p.description[locale],
            image: `${SITE_URL}${p.image}`,
            category: dict.categories[p.category],
            brand: {
              '@type': 'Brand',
              name: dict.brand,
            },
          },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${localeUrl}#webpage`,
        url: localeUrl,
        name: dict.seo.title,
        description: dict.seo.description,
        inLanguage: locale,
        dateModified: CONTENT_LAST_MODIFIED,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        primaryImageOfPage: { '@id': `${SITE_URL}/#logo` },
        breadcrumb: { '@id': `${localeUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${localeUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: dict.brand,
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: dict.nav.home,
            item: localeUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${localeUrl}#services`,
        name: dict.services.eyebrow,
        url: `${localeUrl}#services`,
        itemListElement: services.map((s, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Service',
            name: s.title[locale],
            description: s.description[locale],
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: areaCountry,
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${localeUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question[locale],
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer[locale],
          },
        })),
      },
    ],
  };
}

export function buildProductJsonLd(locale: Lang, paper: PaperType) {
  const dict = dictionaries[locale];
  const detail = getPaperDetail(paper.id);
  const localeUrl = `${SITE_URL}/${locale}`;
  const productUrl = `${localeUrl}/papers/${paper.slug}`;
  const imageUrl = `${SITE_URL}${paper.image}`;
  const areaCountry = {
    '@type': 'Country',
    name: locale === 'ar' ? 'مصر' : 'Egypt',
  };

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: `${paper.name[locale]} (${paper.gsmRange})`,
      alternateName: paper.name[locale === 'en' ? 'ar' : 'en'],
      sku: `MM-${paper.id.toUpperCase()}`,
      url: productUrl,
      image: [imageUrl],
      description: detail.heroSummary[locale],
      category: dict.categories[paper.category],
      brand: {
        '@type': 'Brand',
        name: dict.brand,
      },
      manufacturer: {
        '@id': `${SITE_URL}/#organization`,
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'نطاق الوزن (GSM)' : 'GSM Weight Range',
          value: paper.gsmRange,
        },
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'ملمس السطح والتشطيب' : 'Surface Finish',
          value: paper.surfaceFinish[locale],
        },
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'طرق الطباعة المتوافقة' : 'Print Compatibility',
          value: paper.printMethod[locale],
        },
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'المقاسات المتاحة' : 'Available Sizes',
          value: detail.technical.sizes[locale],
        },
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'الشكل والتجهيز' : 'Supplied Formats',
          value: detail.technical.formats[locale],
        },
        {
          '@type': 'PropertyValue',
          name: locale === 'ar' ? 'التغليف والتوريد' : 'Packaging',
          value: detail.technical.packaging[locale],
        },
      ],
      offers: {
        '@type': 'Offer',
        url: productUrl,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        areaServed: areaCountry,
        seller: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: dict.brand,
        },
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${productUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dict.nav.home,
          item: localeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dict.nav.paperTypes,
          item: `${localeUrl}#paper-types`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: paper.name[locale],
          item: productUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${productUrl}#faq`,
      mainEntity: detail.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question[locale],
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer[locale],
        },
      })),
    },
  ];

  const videoSrc = detail.video?.mp4 || detail.video?.webm;
  if (videoSrc) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${productUrl}#video`,
      name: `${paper.name[locale]} — ${dict.brand}`,
      description: detail.heroSummary[locale],
      thumbnailUrl: [detail.video?.poster ? `${SITE_URL}${detail.video.poster}` : imageUrl],
      contentUrl: `${SITE_URL}${videoSrc}`,
      uploadDate: CONTENT_LAST_MODIFIED,
      duration: detail.video?.duration ?? 'PT10S',
      inLanguage: locale,
      publisher: { '@id': `${SITE_URL}/#organization` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
