import type { MetadataRoute } from 'next';
import { managers } from '../data/managers';
import { paperTypes } from '../data/papers';
import { CONTENT_LAST_MODIFIED, LOCALES, SITE_URL } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_LAST_MODIFIED);
  const homeImages = [
    `${SITE_URL}/android-chrome-512.png`,
    `${SITE_URL}/brand/mm-logo-dark.svg`,
    `${SITE_URL}/brand/mm-logo-light.svg`,
    ...managers.map((m) => `${SITE_URL}${m.photo}`),
    ...paperTypes.map((p) => `${SITE_URL}${p.image}`),
  ];

  const homeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
    images: homeImages,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        'x-default': `${SITE_URL}/en`,
      },
    },
  }));

  const productEntries: MetadataRoute.Sitemap = paperTypes.flatMap((paper) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}/papers/${paper.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      images: [`${SITE_URL}${paper.image}`],
      alternates: {
        languages: {
          en: `${SITE_URL}/en/papers/${paper.slug}`,
          ar: `${SITE_URL}/ar/papers/${paper.slug}`,
          'x-default': `${SITE_URL}/en/papers/${paper.slug}`,
        },
      },
    }))
  );

  return [...homeEntries, ...productEntries];
}
