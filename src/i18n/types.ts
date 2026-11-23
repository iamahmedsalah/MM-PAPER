export type Lang = 'en' | 'ar';

export interface Localized {
  en: string;
  ar: string;
}

export const loc = (v: Localized, lang: Lang) => v[lang];
