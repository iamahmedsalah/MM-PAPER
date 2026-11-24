import type { Localized } from '../i18n/types';

export interface Stat {
  value: number;
  suffix: string;
  label: Localized;
}

export const stats: Stat[] = [
  { value: 20, suffix: '+', label: { en: 'Years since 2006', ar: 'عاماً من العراقة منذ 2006' } },
  { value: 12000, suffix: '', label: { en: 'Tons supplied per month', ar: 'طن توريد شهرياً' } },
  { value: 450, suffix: '+', label: { en: 'Clients served', ar: 'عميل يثق بنا' } },
  { value: 10, suffix: '', label: { en: 'Paper grades', ar: 'أصناف ورق' } },
];

export interface UseCase {
  id: string;
  title: Localized;
  icon: string;
}

export const useCases: UseCase[] = [
  { id: 'printing', title: { en: 'Printing', ar: 'الطباعة' }, icon: 'Printer' },
  { id: 'packaging', title: { en: 'Packaging', ar: 'التعبئة' }, icon: 'Package' },
  { id: 'publishing', title: { en: 'Publishing', ar: 'النشر' }, icon: 'BookOpen' },
  { id: 'stationery', title: { en: 'Stationery', ar: 'القرطاسية' }, icon: 'PenTool' },
  { id: 'hygiene', title: { en: 'Food & Hygiene', ar: 'الأغذية والنظافة' }, icon: 'Sparkles' },
  { id: 'construction', title: { en: 'Construction', ar: 'البناء' }, icon: 'HardHat' },
];
