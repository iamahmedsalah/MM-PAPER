import type { Localized } from '../i18n/types';

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';

export interface SocialChannel {
  id: SocialPlatform;
  name: Localized;
  handle: string;
  href: string;
}

export const socialChannels: readonly SocialChannel[] = [
  {
    id: 'facebook',
    name: { en: 'Facebook', ar: 'فيسبوك' },
    handle: 'MM.paper.industry',
    href: 'https://www.facebook.com/MM.paper.industry',
  },
  {
    id: 'instagram',
    name: { en: 'Instagram', ar: 'إنستغرام' },
    handle: '@mmpaperindustry',
    href: 'https://www.instagram.com/mmpaperindustry/',
  },
  {
    id: 'tiktok',
    name: { en: 'TikTok', ar: 'تيك توك' },
    handle: '@mmpaperindustry',
    href: 'https://www.tiktok.com/@mmpaperindustry',
  },
  {
    id: 'linkedin',
    name: { en: 'LinkedIn', ar: 'لينكدإن' },
    handle: 'mm-paper-industry',
    href: 'https://www.linkedin.com/company/mm-paper-industry/',
  },
];
