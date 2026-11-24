import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/en',
          '/ar',
          '/favicon.ico',
          '/favicon.svg',
          '/favicon-light.svg',
          '/favicon-dark.svg',
          '/apple-touch-icon.png',
          '/android-chrome-192.png',
          '/android-chrome-512.png',
          '/brand/mm-logo-dark.svg',
          '/brand/mm-logo-light.svg',
          '/media/mm-logo-paper-motion.webm',
          '/team/mohamed-morad.webp',
          '/team/khaled-morad.webp',
          '/team/ahmed-morad.webp',
          '/team/mohamed-mohamed-morad.webp',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
