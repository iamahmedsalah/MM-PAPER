import { COMPANY_CONTACT } from '../data/contact.ts';
import { paperTypes } from '../data/papers.ts';
import { socialChannels } from '../data/socials.ts';
import { dictionaries } from '../i18n/translations.ts';
import type { Lang } from '../i18n/types';

export const LOCALES = ['en', 'ar'] as const;

export function isLocale(value: string): value is Lang {
  return value === 'en' || value === 'ar';
}

const rawOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mmpaperindustry.com').trim();
export const SITE_URL = rawOrigin.replace(/\/+$/, '');

export function buildJsonLd(locale: Lang) {
  const dict = dictionaries[locale];
  const localeUrl = `${SITE_URL}/${locale}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: dict.brand,
        alternateName: locale === 'en' ? dictionaries.ar.brand : dictionaries.en.brand,
        url: localeUrl,
        logo: `${SITE_URL}/android-chrome-512.png`,
        description: dict.seo.description,
        foundingDate: '2006',
        areaServed: {
          '@type': 'Country',
          name: locale === 'ar' ? 'مصر' : 'Egypt',
        },
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
          itemOffered: {
            '@type': 'Product',
            name: `${p.name[locale]} (${p.gsmRange})`,
            description: p.description[locale],
            category: dict.categories[p.category],
            brand: {
              '@type': 'Brand',
              name: dict.brand,
            },
          },
        })),
      },
    ],
  };
}
