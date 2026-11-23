import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        'x-default': `${SITE_URL}/en`,
      },
    },
  }));
}
