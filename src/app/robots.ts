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
          '/apple-touch-icon.png',
          '/android-chrome-192.png',
          '/android-chrome-512.png',
          '/mm-logo-dark.svg',
          '/mm-logo-light.svg',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
