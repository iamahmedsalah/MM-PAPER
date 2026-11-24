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
    id: 'sticker',
    name: { en: 'Sticker Paper', ar: 'ورق استيكر' },
    gsmRange: '70 – 120 GSM',
    description: {
      en: 'Printable stock with an adhesive backing and a protective release liner peeled off before application, available in multiple grades and finishes.',
      ar: 'ورق أو خامة قابلة للطباعة، لها طبقة لاصقة من الخلف وورقة حماية تُزال قبل الاستخدام، يتوفر بأنواع وأسطح مختلفة.',
    },
    bestUse: {
      en: 'Product & brand labels, packaging stickers, barcodes',
      ar: 'الملصقات التعريفية والتجارية، ملصقات المنتجات والعبوات، الباركود',
    },
    specs: [
      { en: 'Gloss, matte & thermal top-coats', ar: 'أسطح لامعة ومطفية وحرارية' },
      { en: 'Permanent or removable adhesive', ar: 'لاصق دائم أو قابل للإزالة' },
      { en: 'Glassine & kraft release liners', ar: 'ورق حماية جلاسين أو كرافت' },
      { en: 'Sheets or jumbo slit reels', ar: 'أفرخ مقطعة أو بكرات' },
    ],
    swatch: { base: '#ECEEEB', edge: '#9CBFDC' },
    category: 'Specialty',
  },
  {
    id: 'parchment',
    name: { en: 'Coloured Parchment', ar: 'ورق البرشمان الملوّن' },
    gsmRange: '80 – 120 GSM',
    description: {
      en: 'Decorative specialty paper with a distinctive finish and pastel palette — yellow, light blue, pink, and light green.',
      ar: 'ورق زخرفي يتوفر بألوان وملمس أو مظهر مميز؛ الأصفر، اللبني، البينك، والأخضر الفاتح.',
    },
    bestUse: {
      en: 'Office stationery, invoices, colour-coded correspondence',
      ar: 'الاستخدام المكتبي، طباعة الفواتير، المراسلات الملونة',
    },
    specs: [
      { en: 'Yellow, light blue, pink & light green', ar: 'الأصفر، اللبني، البينك، الأخضر الفاتح' },
      { en: 'Uniform dyed-through pulp colour', ar: 'لون متجانس في كامل عجينة الورق' },
      { en: 'Crisp offset & laser printability', ar: 'قابلية طباعة أوفسيت وليزر عالية الدقة' },
      { en: 'Standard & custom office sheet cuts', ar: 'مقاسات مكتبية قياسية أو خاصة' },
    ],
    swatch: { base: '#E8C43C', edge: '#6FB0E0' },
    category: 'Print',
  },
  {
    id: 'bristol',
    name: { en: 'Bristol Board', ar: 'ورق البريستول' },
    gsmRange: '180 – 350 GSM',
    description: {
      en: 'Semi-rigid heavyweight board that is thicker and firmer than standard printing paper, built for crisp scoring and durable presentation.',
      ar: 'ورق مقوّى نسبياً، أسمك وأكثر تماسكاً من ورق الطباعة العادي، يمنح صلابة وثباتاً عالياً للتطبيقات المتنوعة.',
    },
    bestUse: {
      en: 'Cards, folder & booklet covers, menus, artwork, rigid print applications',
      ar: 'البطاقات، أغلفة الملفات والكتيبات، القوائم، الأعمال الفنية، والتطبيقات التي تتطلب صلابة أعلى',
    },
    specs: [
      { en: 'High caliper & snap stiffness', ar: 'سماكة وصلابة عالية' },
      { en: 'Smooth two-sided calendered surface', ar: 'وجهان ناعمان مصقولان' },
      { en: 'Clean die-cutting & crease resistance', ar: 'تحمّل ممتاز للقص والطيّ' },
      { en: 'White & pastel shades in bulk sheets', ar: 'ألوان أبيض وباستيل في أفرخ بالجملة' },
    ],
    swatch: { base: '#F3EEE1', edge: '#DAD2BE' },
    category: 'Print',
  },
  {
    id: 'duplex-grey',
    name: { en: 'Duplex Board — Grey Back', ar: 'ورق الدوبليكس ـ ظهر رمادي' },
    gsmRange: '230 – 450 GSM',
    description: {
      en: 'Multi-layer packaging carton board featuring a printable white top face and a rigid recycled grey back for dependable box strength.',
      ar: 'كرتون تغليف متعدد الطبقات، بوجه أمامي مناسب للطباعة وظهر رمادي متين.',
    },
    bestUse: {
      en: 'Product boxes and folding cartons with exterior printed faces',
      ar: 'علب المنتجات والعبوات الكرتونية ذات الطباعة على الوجه الخارجي',
    },
    specs: [
      { en: 'Coated white print top liner', ar: 'وجه علوي أبيض مطلي للطباعة' },
      { en: 'High-strength recycled grey back', ar: 'ظهر رمادي عالي المتانة' },
      { en: 'Engineered for fast carton gluing', ar: 'مُصمم لخطوط اللصق والتعبئة السريعة' },
      { en: 'Sheets to 1,400 × 1,000 mm & reels', ar: 'أفرخ حتى 1,400 × 1,000 ملم أو بكرات' },
    ],
    swatch: { base: '#F4F2EC', edge: '#8A8D91' },
    category: 'Packaging',
  },
  {
    id: 'duplex-white',
    name: { en: 'Duplex Board — White Back', ar: 'ورق الدوبليكس ـ ظهر أبيض' },
    gsmRange: '230 – 450 GSM',
    description: {
      en: 'Premium multi-layer rigid board with a smooth white coated face for sharp colour printing and a clean white back for uniform interior presentation.',
      ar: 'نوع من الكرتون المقوى متعدد الطبقات، يتميز بوجه أمامي أبيض ناعم ومُعالج لطباعة الألوان بدقة عالية، وظهر أبيض نظيف يمنح العبوة مظهراً موحداً ومتماسكاً من الداخل.',
    },
    bestUse: {
      en: 'Pharmaceutical cartons, food packaging, and boxes refined on both sides',
      ar: 'عبوات الأدوية والمواد الغذائية وعلب التغليف الأنيقة من الجانبين',
    },
    specs: [
      { en: 'Virgin fibre clean white interior back', ar: 'ظهر أبيض نقي من ألياف بكر' },
      { en: 'Precision coated face for rich CMYK print', ar: 'وجه أمامي مُعالج لأعلى دقة ألوان' },
      { en: 'Food & pharma packaging compliant options', ar: 'خيارات مطابقة لتغليف الأغذية والأدوية' },
      { en: 'Superior stiffness & folding crease integrity', ar: 'صلابة فائقة وثبات ممتاز عند الطيّ' },
    ],
    swatch: { base: '#FFFFFF', edge: '#E6E8EC' },
    category: 'Packaging',
  },
  {
    id: 'butter',
    name: { en: 'Butter Paper', ar: 'ورق الزبدة' },
    gsmRange: '35 – 60 GSM',
    description: {
      en: 'Grease-resistant translucent paper formulated to reduce sticking of baked goods and protect food products according to required treatment specs.',
      ar: 'ورق مخصص لمقاومة الدهون والحد من التصاق المخبوزات، وفق نوع المعالجة والمواصفة.',
    },
    bestUse: {
      en: 'Baking-tray lining, separating food pieces, greaseproof food wrap',
      ar: 'تبطين صواني الخبز، فصل قطع الطعام، تغليف المنتجات الغذائية',
    },
    specs: [
      { en: 'Oil & grease barrier treatment', ar: 'معالجة لمقاومة الزيوت والدهون' },
      { en: 'Non-stick release performance', ar: 'أداء مانع للالتصاق في المخبوزات' },
      { en: 'Food-contact safe unbleached & white grades', ar: 'درجات آمنة للملامسة الغذائية' },
      { en: 'Custom rolls and interleaved sheets', ar: 'بكرات وأفرخ مقطعة حسب الطلب' },
    ],
    swatch: { base: '#D2B377', edge: '#B8955A' },
    category: 'Packaging',
  },
  {
    id: 'offset',
    name: { en: 'Printing Paper', ar: 'ورق الطبع' },
    gsmRange: '60 – 160 GSM',
    description: {
      en: 'Uncoated commercial printing paper supplied across tailored smoothness levels and thicknesses to match offset presses and print methods.',
      ar: 'يُستخدم في أعمال الطباعة، وتختلف أنواعه ونعومته وسماكته بحسب الماكينة وطريقة الطباعة المطلوبة.',
    },
    bestUse: {
      en: 'Commercial printing, daily forms, books, and office stationery',
      ar: 'الطباعة التجارية، المطبوعات اليومية، النماذج والأوراق المكتبية',
    },
    specs: [
      { en: 'CIE whiteness 140–160', ar: 'بياض CIE بين 140–160' },
      { en: 'Opacity 92% minimum', ar: 'عتامة لا تقل عن 92%' },
      { en: 'Sheeted or jumbo reel formats', ar: 'أفرخ مقطعة أو بكرات' },
      { en: 'Acid-free archival option', ar: 'خيار خالٍ من الحموضة للأرشفة' },
    ],
    swatch: { base: '#F4F1E8', edge: '#E2DDCF' },
    category: 'Print',
  },
  {
    id: 'copy',
    name: { en: 'Copy Paper', ar: 'ورق التصوير' },
    gsmRange: '70 – 100 GSM',
    description: {
      en: 'High-brightness office paper supplied in A4 and A3 formats across multiple weights for jam-free high-speed copying and daily printing.',
      ar: 'ورق مكتبي يتوفر بمقاسات A4 و A3 بأوزان مختلفة لتصوير المستندات والطباعة اليومية بكفاءة عالية.',
    },
    bestUse: {
      en: 'Document copying and daily laser/inkjet printing in offices & schools',
      ar: 'تصوير المستندات والطباعة اليومية في المكاتب والمدارس والشركات',
    },
    specs: [
      { en: 'Standard A4 (210×297 mm) & A3 (297×420 mm)', ar: 'مقاسات قياسية A4 و A3' },
      { en: 'Weights: 70 / 75 / 80 / 100 GSM', ar: 'أوزان 70 / 75 / 80 / 100 جرام' },
      { en: 'Precision guillotine cut for jam-free feed', ar: 'قص دقيق يمنع انحشار الورق' },
      { en: 'Ream wrapped (500 sheets) & carton palletized', ar: 'تغليف رزم 500 ورقة وكراتين جملة' },
    ],
    swatch: { base: '#FBFBF9', edge: '#E4E2DC' },
    category: 'Print',
  },
  {
    id: 'coated',
    name: { en: 'Coated Paper (Couche)', ar: 'ورق الكوشيه' },
    gsmRange: '90 – 300 GSM',
    description: {
      en: 'Smooth art-coated paper available in gloss or matte finishes, engineered to reproduce vivid colours, sharp halftones, and fine visual detail.',
      ar: 'ورق ذو سطح مطلي وناعم، يتوفر لامعاً أو مطفياً، ويُظهر الألوان والتفاصيل بوضوح فائق.',
    },
    bestUse: {
      en: 'Brochures, catalogues, magazines, and premium printed covers',
      ar: 'البروشورات، الكتالوجات، المجلات، وأغلفة المطبوعات الفاخرة',
    },
    specs: [
      { en: 'Gloss / silk / matte finish', ar: 'تشطيب لامع / حريري / مطفي' },
      { en: 'ISO brightness 96+', ar: 'إشراقة ISO أعلى من 96' },
      { en: 'Single and double coated grades', ar: 'درجات طلاء مفرد ومزدوج' },
      { en: 'UV and offset press rated', ar: 'مناسب لمطابع الأوفسيت و UV' },
    ],
    swatch: { base: '#E8E2D2', edge: '#CFC8B4' },
    category: 'Print',
  },
  {
    id: 'carbon',
    name: { en: 'Carbon Paper', ar: 'الورق المُكربن' },
    gsmRange: '20 – 40 GSM',
    description: {
      en: 'Pressure-sensitive transfer paper treated to duplicate handwriting or impressions cleanly across multiple manual copies.',
      ar: 'ورق مُعالج لنقل الكتابة أو أثرها إلى نسخة أخرى عند الضغط عليه، ويُستخدم لإنتاج نسخ متعددة يدوياً.',
    },
    bestUse: {
      en: 'Invoices, receipts, and manual multi-copy business forms',
      ar: 'الفواتير، الإيصالات، والنماذج التجارية متعددة النسخ',
    },
    specs: [
      { en: 'Clean pressure-transfer ink coating', ar: 'طلاء دقيق لنقل الكتابة بالضغط' },
      { en: 'Black & blue copy impressions', ar: 'طباعة نسخ واضحة بالأزرق أو الأسود' },
      { en: 'Matched to multi-part invoice sets', ar: 'متوافق مع دفاتر الفواتير متعددة النسخ' },
      { en: 'Bulk sheet packs and commercial rolls', ar: 'عبوات أفرخ تجارية وبكرات تجهيز' },
    ],
    swatch: { base: '#ECE8DA', edge: '#0B1124' },
    category: 'Specialty',
  },
];
