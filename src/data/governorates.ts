export interface Governorate {
  id: string;
  ar: string;
  en: string;
}

export const governorates = [
  { id: 'cairo', ar: 'القاهرة', en: 'Cairo' },
  { id: 'giza', ar: 'الجيزة', en: 'Giza' },
  { id: 'alexandria', ar: 'الإسكندرية', en: 'Alexandria' },
  { id: 'qalyubia', ar: 'القليوبية', en: 'Qalyubia' },
  { id: 'dakahlia', ar: 'الدقهلية', en: 'Dakahlia' },
  { id: 'sharqia', ar: 'الشرقية', en: 'Sharqia' },
  { id: 'gharbia', ar: 'الغربية', en: 'Gharbia' },
  { id: 'monufia', ar: 'المنوفية', en: 'Monufia' },
  { id: 'beheira', ar: 'البحيرة', en: 'Beheira' },
  { id: 'kafr-el-sheikh', ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  { id: 'damietta', ar: 'دمياط', en: 'Damietta' },
  { id: 'port-said', ar: 'بورسعيد', en: 'Port Said' },
  { id: 'ismailia', ar: 'الإسماعيلية', en: 'Ismailia' },
  { id: 'suez', ar: 'السويس', en: 'Suez' },
  { id: 'fayoum', ar: 'الفيوم', en: 'Fayoum' },
  { id: 'beni-suef', ar: 'بني سويف', en: 'Beni Suef' },
  { id: 'minya', ar: 'المنيا', en: 'Minya' },
  { id: 'asyut', ar: 'أسيوط', en: 'Asyut' },
  { id: 'sohag', ar: 'سوهاج', en: 'Sohag' },
  { id: 'qena', ar: 'قنا', en: 'Qena' },
  { id: 'luxor', ar: 'الأقصر', en: 'Luxor' },
  { id: 'aswan', ar: 'أسوان', en: 'Aswan' },
  { id: 'red-sea', ar: 'البحر الأحمر', en: 'Red Sea' },
  { id: 'matrouh', ar: 'مطروح', en: 'Matrouh' },
  { id: 'new-valley', ar: 'الوادي الجديد', en: 'New Valley' },
  { id: 'north-sinai', ar: 'شمال سيناء', en: 'North Sinai' },
  { id: 'south-sinai', ar: 'جنوب سيناء', en: 'South Sinai' },
] as const satisfies readonly Governorate[];

export const GOVERNORATE_IDS: readonly string[] = governorates.map((g) => g.id);

export function getGovernorateLabel(id: string, lang: 'ar' | 'en' = 'ar'): string {
  const match = governorates.find((g) => g.id === id);
  return match ? match[lang] : id;
}
