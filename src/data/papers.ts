import type { Localized } from '../i18n/types';

export interface PaperType {
  id: string;
  name: Localized;
  gsmRange: string;
  description: Localized;
  bestUse: Localized;
  specs: Localized[];
  swatch: { base: string; edge: string };
  category: 'Packaging' | 'Print' | 'Specialty';
}

export const paperCategories: Array<'All' | 'Packaging' | 'Print' | 'Specialty'> = [
  'All',
  'Packaging',
  'Print',
  'Specialty',
];

export const paperTypes: PaperType[] = [
  {
    id: 'kraft',
    name: { en: 'Kraft', ar: 'كرافت' },
    gsmRange: '70 – 200 GSM',
    description: {
      en: 'High-strength brown paper made from long pine fibres. Excellent tear resistance and burst strength for demanding packaging lines.',
      ar: 'ورق بني عالي المقاومة من ألياف الصنوبر الطويلة. مقاومة ممتازة للتمزق وقوة انفجار عالية لخطوط التعبئة الشاقة.',
    },
    bestUse: { en: 'Bags, wrapping, sacks, industrial packaging', ar: 'الأكياس، التغليف، الأكياس السائبة، التعبئة الصناعية' },
    specs: [
      { en: 'Burst factor 28–42', ar: 'معامل الانفجار 28–42' },
      { en: 'Machine-finished or MG glazed', ar: 'تشطيب آلي أو لماع MG' },
      { en: 'FSC-certified fibre options', ar: 'خيارات ألياف معتمدة FSC' },
      { en: 'Reels 600–2,400 mm width', ar: 'بكرات بعرض 600–2,400 ملم' },
    ],
    swatch: { base: '#B08A5A', edge: '#8A6A42' },
    category: 'Packaging',
  },
  {
    id: 'offset',
    name: { en: 'White Offset', ar: 'أوفسيت أبيض' },
    gsmRange: '60 – 160 GSM',
    description: {
      en: 'Uncoated, high-whiteness printing paper with a smooth, even surface that holds fine text and dense solids without show-through.',
      ar: 'ورق طباعة غير مطلي ببياض عالٍ وسطح أملس متجانس يحافظ على النصوص الدقيقة والمناطق الداكنة دون تسلل للخلف.',
    },
    bestUse: { en: 'Books, forms, letterheads, envelopes', ar: 'الكتب، النماذج، أوراق المراسلات، الأظرف' },
    specs: [
      { en: 'CIE whiteness 140–160', ar: 'بياض CIE بين 140–160' },
      { en: 'Opacity 92% minimum', ar: 'عتامة لا تقل عن 92%' },
      { en: 'Sheeted or reel form', ar: 'أوراق أو بكرات' },
      { en: 'Acid-free archival option', ar: 'خيار خالٍ من الحموضة للأرشفة' },
    ],
    swatch: { base: '#F4EFE3', edge: '#D8D2C2' },
    category: 'Print',
  },
  {
    id: 'coated',
    name: { en: 'Coated', ar: 'مطلي' },
    gsmRange: '90 – 300 GSM',
    description: {
      en: 'Gloss and silk coated papers with a sealed surface for sharp halftones, rich colour gamut and premium catalogue finishes.',
      ar: 'أوراق مطلية بلمعان أو حريرية بسطح مغلق يمنح درجات لونية حادة ونطاق ألوان غني وتشطيبات كتالوجات فاخرة.',
    },
    bestUse: { en: 'Brochures, catalogues, magazines, covers', ar: 'البروشورات، الكتالوجات، المجلات، الأغلفة' },
    specs: [
      { en: 'Gloss / silk / matte finish', ar: 'تشطيب لامع / حريري / مطفي' },
      { en: 'ISO brightness 96+', ar: 'إشراقة ISO أعلى من 96' },
      { en: 'Low-coat and double-coat', ar: 'طلاء مفرد مزدوج' },
      { en: 'UV and offset press rated', ar: 'مناسب لمطابع الأوفسيت و UV' },
    ],
    swatch: { base: '#E8E2D2', edge: '#CFC8B4' },
    category: 'Print',
  },
  {
    id: 'newsprint',
    name: { en: 'Newsprint', ar: 'ورق جرائد' },
    gsmRange: '45 – 52 GSM',
    description: {
      en: 'Lightweight, opaque paper engineered for high-speed web presses — clean runnability with minimal ink set-off at speed.',
      ar: 'ورق خفيف عالي العتامة مصمم لمطابع الويب عالية السرعة — تشغيل نظيف مع أدنى انتقال حبر عند السرعة.',
    },
    bestUse: { en: 'Newspapers, inserts, directories', ar: 'الجرائد، الملاحق، الأدلة' },
    specs: [
      { en: 'Standard 45 / 48.8 / 52 GSM', ar: 'المقاسات القياسية 45 / 48.8 / 52 جراماً' },
      { en: 'High opacity for weight class', ar: 'عتامة عالية لفئته الوزنية' },
      { en: 'Reel or folded options', ar: 'خيارات بكرات أو طيّ' },
      { en: 'Recycled-content grades', ar: 'درجات بمحتوى معاد تدويره' },
    ],
    swatch: { base: '#D9D4C6', edge: '#BFB9A8' },
    category: 'Print',
  },
  {
    id: 'cardboard',
    name: { en: 'Cardboard', ar: 'ورق مقوى' },
    gsmRange: '230 – 450 GSM',
    description: {
      en: 'Rigid duplex and chipboard with high stacking strength. Calendered for clean die-cutting, creasing and glue-line performance.',
      ar: 'ورق مزدوج ومضلع عالي الصلابة وقدرة تحمّل للتكديس، مصقول للقص بالقوالب والثني واللصق بنظافة.',
    },
    bestUse: { en: 'Boxes, cartons, laminates, bookbinding', ar: 'الصناديق، الكراتين، التصفيح، تجليد الكتب' },
    specs: [
      { en: 'Grey-back and white-back duplex', ar: 'مزدوج بظهر رمادي أو أبيض' },
      { en: 'Stiffness up to 120 mN·m²', ar: 'صلابة تصل إلى 120 ملي نيوتن·م²' },
      { en: 'Food-safe laminating grades', ar: 'درجات تصفيح آمنة غذائياً' },
      { en: 'Sheet sizes to 1,400 × 1,000 mm', ar: 'مقاسات أوراق حتى 1,400 × 1,000 ملم' },
    ],
    swatch: { base: '#9C815F', edge: '#77613F' },
    category: 'Packaging',
  },
  {
    id: 'tissue',
    name: { en: 'Tissue', ar: 'نسيجية' },
    gsmRange: '14 – 40 GSM',
    description: {
      en: 'Soft, absorbent crepe and flat tissue produced on dedicated hygienic machines with full process-water control.',
      ar: 'ورق نسيجي ناعم ماص، مجعّد أو أملس، يُنتج على آلات نظافة مخصصة بتحكم كامل بمياه التشغيل.',
    },
    bestUse: { en: 'Hygiene, food wrap, protective interleaving', ar: 'النظافة، تغليف الأغذية، الفصل الواقي بين الطبقات' },
    specs: [
      { en: 'Crepe and flat finishes', ar: 'تشطيبات مجعّدة وأملسة' },
      { en: 'Food-contact certified options', ar: 'خيارات معتمدة للملامسة الغذائية' },
      { en: 'White and custom shades', ar: 'درجات بيضاء وألوان خاصة' },
      { en: 'Parent reels to 2,800 mm', ar: 'بكرات أصلية حتى 2,800 ملم' },
    ],
    swatch: { base: '#FAF7EE', edge: '#E3DDCB' },
    category: 'Specialty',
  },
];
