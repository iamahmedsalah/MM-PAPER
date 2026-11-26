import type { Localized } from '../i18n/types';

export interface PaperVideoSpec {
  /** Optional WebM (VP9) motion video path, e.g. `/videos/papers/coated.webm` */
  webm?: string;
  /** Optional MP4 (H.264) motion video path, e.g. `/videos/papers/coated.mp4` */
  mp4?: string;
  /** Optional ISO 8601 duration for VideoObject Schema, e.g. `PT10S` */
  duration?: string;
  /** Optional poster image override (defaults to `paper.image`) */
  poster?: string;
}

export interface PaperApplication {
  title: Localized;
  detail: Localized;
}

export interface PaperFaq {
  question: Localized;
  answer: Localized;
}

export interface PaperTechnicalTable {
  sizes: Localized;
  formats: Localized;
  packaging: Localized;
  moq: Localized;
  supplyScope: Localized;
}

export interface PaperDetail {
  id: string;
  seoTitle: Localized;
  seoDescription: Localized;
  keywords: { en: string[]; ar: string[] };
  heroSummary: Localized;
  /**
   * Drop your motion video under `public/videos/papers/<id>.webm` (and/or `.mp4`)
   * and set `video: { webm: '/videos/papers/coated.webm', mp4: '/videos/papers/coated.mp4', duration: 'PT10S' }`
   * to automatically activate the Motion Video tab and VideoObject JSON-LD schema.
   */
  video?: PaperVideoSpec;
  technical: PaperTechnicalTable;
  applications: PaperApplication[];
  faqs: PaperFaq[];
  relatedIds: string[];
}

export const paperDetails: Record<string, PaperDetail> = {
  sticker: {
    id: 'sticker',
    seoTitle: {
      en: 'Sticker Paper Wholesale Egypt | MM Paper Industry',
      ar: 'ورق استيكر بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk self-adhesive sticker paper in Egypt: gloss, matte & thermal face stocks with permanent or removable adhesive in sheets and slit reels. Supplied by MM Paper Industry.',
      ar: 'توريد ورق استيكر ذاتي اللصق بالجملة في مصر: لامع ومطفي وحراري بلاصق دائم أو قابل للإزالة، أفرخ وبكرات بمقاسات مخصصة من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'sticker paper wholesale Egypt',
        'self-adhesive paper supplier Egypt',
        'barcode label stock Egypt',
        'glossy matte sticker sheets reels',
        'MM Paper Industry',
      ],
      ar: [
        'ورق استيكر بالجملة في مصر',
        'مورد ورق استيكر للمطابع',
        'ورق استيكر لامع ومطفي',
        'ورق باركود لاصق',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Industrial-grade self-adhesive sticker paper engineered for crisp offset, flexo, digital, and thermal barcode printing — supplied in precision-cut sheets or custom slit reels from our New Borg El Arab converting facility.',
      ar: 'ورق استيكر ذاتي اللصق بمواصفات صناعية عالية لطباعة الأوفسيت والفليكسو والديجيتال والباركود الحراري، متوفر في أفرخ مقطعة بدقة أو بكرات مشققة حسب الطلب من مصنعنا في برج العرب الجديدة.',
    },
    technical: {
      sizes: {
        en: 'Standard sheets (70×100 cm, 50×70 cm, A4/A3) & custom slit reel widths on request',
        ar: 'أفرخ قياسية (70×100 سم، 50×70 سم، A4/A3) وعروض بكرات مخصصة حسب الماكينة',
      },
      formats: {
        en: 'Precision-cut sheets & jumbo / slit reels',
        ar: 'أفرخ مقطعة بدقة وبكرات (بكر وشيت)',
      },
      packaging: {
        en: 'Moisture-protected reams, cartons & export-grade stretch-wrapped pallets',
        ar: 'رزم محمية من الرطوبة، كراتين تجارية، وبالتات مغلفة للشحن الصناعي',
      },
      moq: {
        en: 'Wholesale cartons, pallets & bulk tonnage for printing presses and factories',
        ar: 'توريد جملة بالكراتين والبالتات والأطنان للمطابع والمصانع والشركات',
      },
      supplyScope: {
        en: 'Nationwide dispatch across all Egyptian governorates from New Borg El Arab, Alexandria',
        ar: 'توريد وشحن منتظم لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Product & Brand Labels', ar: 'ملصقات المنتجات والعلامات التجارية' },
        detail: {
          en: 'High-adhesion gloss and semi-gloss labels for cosmetics, detergents, beverages, and retail jars.',
          ar: 'استيكرات لامعة ونصف لامعة عالية الثبات لعبوات مستحضرات التجميل والمنظفات والمواد الغذائية.',
        },
      },
      {
        title: { en: 'Barcode & Logistics Tracking', ar: 'ملصقات الباركود والشحن واللوجستيات' },
        detail: {
          en: 'Thermal and matte adhesive stocks built for crisp barcode scanning on cartons and warehouse pallets.',
          ar: 'خامات مطفية وحرارية تضمن وضوح قراءة الباركود على الكراتين والشحنات والمخازن.',
        },
      },
      {
        title: { en: 'Pharmaceutical & Chemical Seals', ar: 'ملصقات الأدوية والعبوات الصناعية' },
        detail: {
          en: 'Reliable permanent adhesives and smooth glassine liners suited for high-speed automatic labelling lines.',
          ar: 'لاصق دائم وورق حماية جلاسين ناعم يتوافق مع خطوط اللصق الأوتوماتيكية السريعة.',
        },
      },
      {
        title: { en: 'Die-Cut Promotional Stickers', ar: 'استيكرات الدعاية والقصّ المخصص' },
        detail: {
          en: 'Clean kiss-cut and die-cut release without edge ooze for commercial offset and digital print shops.',
          ar: 'قصّ وتكسير نظيف دون تسرب للغراء على الأطراف لمطابع الأوفسيت والديجيتال.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What sticker paper finishes and adhesive types does MM Paper Industry supply?',
          ar: 'ما هي أنواع أسطح ولاصق ورق الاستيكر المتوفرة لدى إم إم لصناعة الورق؟',
        },
        answer: {
          en: 'We supply high-gloss (cast coated), semi-gloss, uncoated matte, and thermal sticker paper with either permanent or removable adhesive and glassine or kraft release liners.',
          ar: 'نوفر ورق استيكر لامع (كاست كوتد)، نصف لامع، مطفي غير مطلي، وحراري، مع خيار اللاصق الدائم أو القابل للإزالة وورق حماية جلاسين أو كرافت.',
        },
      },
      {
        question: {
          en: 'Can I order sticker paper in custom reel widths or specific sheet dimensions?',
          ar: 'هل يمكن توريد ورق الاستيكر بعروض بكر مخصصة أو مقاسات أفرخ محددة؟',
        },
        answer: {
          en: 'Yes. Through our in-house converting and slitting lines in New Borg El Arab, we cut sheets (including 70×100 cm and 50×70 cm) and slit reels to match your exact press width.',
          ar: 'نعم، نوفر عبر خطوط التقطيع والتشقيق في مصنعنا ببرج العرب الجديدة مقاسات أفرخ قياسية وخاصة (مثل 70×100 و 50×70 سم) وبكرات بالعروض المطلوبة لماكيناتك.',
        },
      },
      {
        question: {
          en: 'Is your sticker paper compatible with offset, flexo, and digital printing presses?',
          ar: 'هل ورق الاستيكر متوافق مع مطابع الأوفسيت والفليكسو والديجيتال؟',
        },
        answer: {
          en: 'Yes. We match the face stock and liner weight to your press type—sheet-fed offset, narrow-web flexo, digital laser/toner, or thermal transfer printers—so sheets feed flat without curling.',
          ar: 'نعم، نرشّح لك درجة الوجه وورق الحماية المناسبة لنوع الماكينة سواء أوفسيت أفرخ أو فليكسو بكرات أو ديجيتال ليزر أو طابعات باركود لضمان تغذية مسطحة بدون التواء.',
        },
      },
      {
        question: {
          en: 'How quickly can bulk sticker paper orders be dispatched across Egypt?',
          ar: 'كم تستغرق مدة تجهيز وتوريد طلبات ورق الاستيكر داخل مصر؟',
        },
        answer: {
          en: 'Standard stock grades are prepared rapidly for pickup or scheduled delivery to Cairo, Alexandria, Delta, and Upper Egypt governorates. Contact us with your GSM, format, and quantity for an exact dispatch schedule.',
          ar: 'الأصناف القياسية المتوفرة بالمخزون تُجهّز سريعاً للاستلام أو الشحن المجدول للقاهرة والإسكندرية والدلتا والصعيد؛ تواصل معنا بالمقاس والكمية لتأكيد موعد التسليم الفوري.',
        },
      },
    ],
    relatedIds: ['coated', 'duplex-white', 'offset'],
  },

  parchment: {
    id: 'parchment',
    seoTitle: {
      en: 'Coloured Parchment Paper Wholesale Egypt | MM Paper Industry',
      ar: 'ورق البرشمان الملوّن بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Wholesale dyed-through coloured parchment paper in Egypt in pastel yellow, light blue, pink & light green for invoices, office stationery & certificates.',
      ar: 'توريد ورق البرشمان الملوّن بالجملة في مصر بألوان الأصفر واللبني والبينك والأخضر الفاتح للفواتير والمراسلات المكتبية والشهادات من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'coloured parchment paper Egypt',
        'pastel coloured printing paper wholesale',
        'dyed through office paper Egypt',
        'coloured invoice paper supplier',
        'MM Paper Industry',
      ],
      ar: [
        'ورق برشمان ملون بالجملة في مصر',
        'ورق طباعة ملون باستيل',
        'ورق فواتير ملون للمطابع',
        'ورق مكتبي ملون',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Uniformly dyed-through decorative parchment paper in four signature pastel shades — yellow, light blue, pink, and light green — delivering clean offset and laser printability for offices, invoice sets, and stationery.',
      ar: 'ورق برشمان ملوّن مصبوغ بالكامل في العجينة بأربعة ألوان باستيل مميزة (الأصفر، اللبني، البينك، والأخضر الفاتح) لطباعة الفواتير والمراسلات المكتبية والشهادات بدقة عالية.',
    },
    technical: {
      sizes: {
        en: 'Standard sheets (70×100 cm, 60×90 cm, A4/A3) & custom converting cuts',
        ar: 'أفرخ قياسية (70×100 سم، 60×90 سم، A4/A3) وتقطيع مقاسات مكتبية خاصة',
      },
      formats: {
        en: 'Flat-packed sheets & office reams',
        ar: 'أفرخ مقطعة ورزم مكتبية جاهزة',
      },
      packaging: {
        en: '500-sheet protective reams, bulk cartons & wrapped pallets',
        ar: 'رزم محمية 500 ورقة، كراتين جملة، وبالتات مغلفة',
      },
      moq: {
        en: 'Wholesale ream cartons & pallet quantities for printers and stationery distributors',
        ar: 'توريد جملة بالكراتين والبالتات للمطابع وتجار الأدوات المكتبية والشركات',
      },
      supplyScope: {
        en: 'Direct supply across Egypt from New Borg El Arab Industrial Zone',
        ar: 'توريد مباشر لجميع محافظات مصر من المنطقة الصناعية ببرج العرب الجديدة',
      },
    },
    applications: [
      {
        title: { en: 'Colour-Coded Invoices & Forms', ar: 'دفاتر الفواتير والنماذج الملوّنة' },
        detail: {
          en: 'Instant visual separation between accounting, warehouse, and customer copies in multi-part books.',
          ar: 'تمييز فوري بين نسخ الحسابات والمخازن والعملاء في دفاتر الفواتير والإيصالات التجارية.',
        },
      },
      {
        title: { en: 'Certificates & Formal Stationery', ar: 'الشهادات والمراسلات الرسمية' },
        detail: {
          en: 'Refined matte texture and consistent pastel tone suited for certificates, invitations, and divider sheets.',
          ar: 'ملمس مطفي أنيق ولون متجانس يناسب الشهادات والدعوات وفواصل الملفات.',
        },
      },
      {
        title: { en: 'Institutional & Office Filing', ar: 'التصنيف المكتبي والملفات الإدارية' },
        detail: {
          en: 'Clean laser and inkjet absorption without smudging for schools, universities, and corporate archives.',
          ar: 'امتصاص نظيف لأحبار الليزر والإنك جيت بدون تلطيخ للمدارس والجامعات والشركات.',
        },
      },
      {
        title: { en: 'Commercial Leaflets & Flyers', ar: 'المطبوعات الإعلانية والنشرات' },
        detail: {
          en: 'Cost-effective colour impact with single-colour black offset ink on pastel stock.',
          ar: 'مظهر لوني جذاب بتكلفة طباعة اقتصادية باستخدام لون أسود واحد على ورق ملوّن.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What colours are available in MM Paper Industry coloured parchment stock?',
          ar: 'ما هي الألوان المتوفرة في ورق البرشمان الملوّن؟',
        },
        answer: {
          en: 'Our standard coloured parchment range is stocked in four dyed-through pastel shades: yellow, light blue, pink, and light green.',
          ar: 'يتوفر ورق البرشمان الملوّن لدينا بأربعة ألوان باستيل مصبوغة بالكامل في عجينة الورق: الأصفر، اللبني، البينك، والأخضر الفاتح.',
        },
      },
      {
        question: {
          en: 'Does the colour fade or show white edges when cut?',
          ar: 'هل يظهر لون أبيض على الحواف عند القص أو التقطيع؟',
        },
        answer: {
          en: 'No. Because the pulp is dyed through before sheet formation, cut edges and folds retain uniform colour throughout the entire sheet thickness.',
          ar: 'لا، لأن الصبغة مدمجة داخل عجينة الورق بالكامل قبل التشكيل، فتبقى الحواف ومناطق القصّ والطيّ بنفس درجة اللون المتجانس.',
        },
      },
      {
        question: {
          en: 'Can coloured parchment be printed on both offset presses and office laser printers?',
          ar: 'هل يصلح ورق البرشمان للطباعة على ماكينات الأوفسيت وطابعات الليزر المكتبية؟',
        },
        answer: {
          en: 'Yes. Its smooth matte fibre finish handles commercial offset presses, office laser printers, inkjet printers, and foil stamping cleanly.',
          ar: 'نعم، سطحه المطفي المتوازن يعطي نتائج ممتازة على مطابع الأوفسيت التجارية وطابعات الليزر والإنك جيت والبصمة الذهبية.',
        },
      },
      {
        question: {
          en: 'Can I mix colours in a wholesale order?',
          ar: 'هل يمكن طلب تشكيلة ألوان مختلفة في نفس طلبية الجملة؟',
        },
        answer: {
          en: 'Yes. We prepare mixed-colour wholesale orders by carton or pallet according to your production and distribution needs.',
          ar: 'نعم، نوفر تجهيز طلبيات الجملة بتشكيلة الألوان المطلوبة بالكراتين أو البالتات حسب احتياج مطبعتك أو شركتك.',
        },
      },
    ],
    relatedIds: ['bristol', 'offset', 'carbon'],
  },

  bristol: {
    id: 'bristol',
    seoTitle: {
      en: 'Bristol Board Wholesale Egypt | MM Paper Industry',
      ar: 'ورق البريستول بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk heavyweight Bristol board in Egypt: double-calendered rigid cardstock for business cards, folder covers, menus & die-cut print applications.',
      ar: 'توريد ورق البريستول المقوّى بالجملة في مصر بوجهين ناعمين مصقولين للبطاقات وأغلفة الملفات والكتيبات والقوائم من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'Bristol board wholesale Egypt',
        'heavyweight cardstock supplier Egypt',
        '300 GSM Bristol paper Egypt',
        'folder cover board Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق بريستول بالجملة في مصر',
        'سعر ورق البريستول للمطابع',
        'ورق بريستول 250 و 300 جرام',
        'ورق أغلفة ملفات وبطاقات',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'High-caliper, double-calendered Bristol cardstock engineered for crisp creasing, clean die-cutting, and rigid two-sided print presentation across 180 to 350 GSM.',
      ar: 'ورق بريستول مقوّى بسماكة وصلابة عالية ووجهين ناعمين مصقولين، مصمم للطيّ النظيف والريجة والتكسير وأغلفة الكتيبات والبطاقات الفاخرة بأوزان من 180 إلى 350 جرام.',
    },
    technical: {
      sizes: {
        en: 'Standard 70×100 cm, 50×70 cm, 64×90 cm & custom guillotine-cut sheet dimensions',
        ar: 'مقاسات قياسية 70×100 سم، 50×70 سم، 64×90 سم مع خدمة التقطيع لمقاسات خاصة',
      },
      formats: {
        en: 'Precision-cut rigid sheets & bulk pallets',
        ar: 'أفرخ مقطعة بدقة وبالتات توريد جملة',
      },
      packaging: {
        en: '100-sheet kraft-wrapped packs & reinforced flat pallets',
        ar: 'بواكي 100 فرخ مغلفة بكرافت واقٍ وبالتات مسطحة مدعمة',
      },
      moq: {
        en: 'Wholesale packs, pallets & tonnage orders for print houses and stationery converters',
        ar: 'توريد جملة بالبواكي والبالتات والأطنان للمطابع ومصانع الأدوات المكتبية',
      },
      supplyScope: {
        en: 'Delivered nationwide across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد منتظم لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Presentation Folders & Booklet Covers', ar: 'أغلفة الملفات والكتيبات والدفاتر' },
        detail: {
          en: 'High snap stiffness holds clean folds and pocket die-cuts without cracking along the crease.',
          ar: 'صلابة وثبات عالٍ يتحمل الريجة والتكسير والطيّ دون تشقق على خط الثني.',
        },
      },
      {
        title: { en: 'Business Cards & Invitations', ar: 'الكروت الشخصية وبطاقات الدعوة' },
        detail: {
          en: 'Smooth two-sided calendered surface accepts fine offset ink, embossing, and hot foil stamping.',
          ar: 'وجهان ناعمان يقبلان طباعة الأوفسيت الدقيقة والبروز والبصمة الذهبية والفضية.',
        },
      },
      {
        title: { en: 'Restaurant Menus & Table Tents', ar: 'قوائم المطاعم والستاندات الورقية' },
        detail: {
          en: 'Rigid standing structure built for frequent handling and optional matte or gloss lamination.',
          ar: 'قوام متماسك يتحمل الاستخدام المتكرر ويقبل السلوفان المطفي واللامع بكفاءة.',
        },
      },
      {
        title: { en: 'Index Dividers & Educational Artwork', ar: 'فواصل الملفات والأعمال الفنية' },
        detail: {
          en: 'Available in crisp white and soft pastel shades for institutional filing and creative studios.',
          ar: 'متوفر بالأبيض النقي وألوان باستيل مختارة لملفات الأرشفة والأعمال الفنية.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What is the difference between Bristol Board and Coated Paper (Couche)?',
          ar: 'ما الفرق بين ورق البريستول وورق الكوشيه؟',
        },
        answer: {
          en: 'Bristol board is an uncoated, double-calendered rigid cardstock prized for higher stiffness, writeability, and crisp scoring, whereas Couche has a glossy or matte clay coating for high-sheen photographic imagery.',
          ar: 'ورق البريستول ورق مقوّى غير مطلي مصقول الوجهين يتميز بصلابة أعلى وقابلية للكتابة والريجة النظيفة، بينما الكوشيه يحمل طبقة طلاء لامعة أو مطفية مخصصة لإبراز الصور الفوتوغرافية عالية التشبع.',
        },
      },
      {
        question: {
          en: 'Which GSM weights of Bristol Board are most popular for folders and cards?',
          ar: 'ما هي أكثر أوزان ورق البريستول طلباً للملفات والكروت؟',
        },
        answer: {
          en: '250 GSM and 300 GSM are the standard choices for presentation folders and business cards, while 180–220 GSM is widely used for file dividers, certificates, and booklet covers.',
          ar: 'أوزان 250 و 300 جرام هي الأكثر طلباً لأغلفة الملفات والكروت الشخصية، بينما تُستخدم أوزان 180 إلى 220 جرام لفواصل الملفات والشهادات وأغلفة الكتيبات.',
        },
      },
      {
        question: {
          en: 'Does MM Paper Industry supply Bristol Board in both white and pastel colours?',
          ar: 'هل يتوفر ورق البريستول بالأبيض والألوان الباستيل؟',
        },
        answer: {
          en: 'Yes. We supply bright white and selected pastel Bristol board grades in bulk sheet packs and pallets.',
          ar: 'نعم، نوفر ورق البريستول بالأبيض النقي وتشكيلة ألوان باستيل في أفرخ وبالتات جملة.',
        },
      },
      {
        question: {
          en: 'Can Bristol Board be scored and die-cut without cracking?',
          ar: 'هل يتحمل ورق البريستول التكسير والريجة بدون تشقق؟',
        },
        answer: {
          en: 'Yes. Our Bristol board grades are selected for balanced fibre strength and grain consistency, delivering clean scoring and die-cutting on commercial presses.',
          ar: 'نعم، يتم اختيار خامات البريستول لدينا بتوازن ألياف عالٍ يضمن تكسير وريجة نظيفة دون تشقق على ماكينات التجهيز.',
        },
      },
    ],
    relatedIds: ['coated', 'duplex-white', 'parchment'],
  },

  'duplex-grey': {
    id: 'duplex-grey',
    seoTitle: {
      en: 'Grey Back Duplex Board Wholesale Egypt | MM Paper Industry',
      ar: 'ورق الدوبليكس ظهر رمادي بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk grey-back duplex packaging carton board in Egypt: coated white print face & rigid recycled grey back in sheets and reels for folding boxes.',
      ar: 'توريد ورق الدوبليكس ظهر رمادي بالجملة في مصر بوجه أبيض مطلي للطباعة وظهر رمادي متين لعلب المنتجات والتغليف الكرتوني، أفرخ وبكرات من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'grey back duplex board Egypt',
        'duplex carton board wholesale Egypt',
        'GD2 duplex board supplier Egypt',
        'folding box board Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق دوبليكس ظهر رمادي بالجملة في مصر',
        'سعر طن ورق الدوبليكس في مصر',
        'كرتون دوبليكس لعلب التغليف',
        'مورد ورق دوبليكس للمصانع',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Multi-ply grey-back duplex packaging board combining a bright coated white top liner for sharp exterior branding with a high-strength recycled grey back for economical, rigid folding cartons.',
      ar: 'كرتون دوبليكس متعدد الطبقات يجمع بين وجه أمامي أبيض مطلي لطباعة عالية الوضوح وظهر رمادي متين، ليقدم أفضل معادلة بين الصلابة والتكلفة الاقتصادية لعلب التغليف والمنتجات.',
    },
    technical: {
      sizes: {
        en: 'Sheets up to 1,400 × 1,000 mm (70×100 cm standard) & jumbo / slit reels',
        ar: 'أفرخ حتى 1,400 × 1,000 ملم (ومقاس 70×100 سم القياسي) بالإضافة إلى البكرات',
      },
      formats: {
        en: 'Precision-cut sheets & industrial converting reels',
        ar: 'أفرخ مقطعة بدقة وبكرات صناعية (بكر وشيت)',
      },
      packaging: {
        en: 'Export-grade wooden pallets with waterproof wrap & corner guards',
        ar: 'بالتات خشبية محمية بغلاف مقاوم للرطوبة وزوايا حماية للشحن',
      },
      moq: {
        en: 'Bulk pallets & tonnage supply tailored to packaging plants and carton converters',
        ar: 'توريد بالبالتات والأطنان لمصانع العلب الكرتونية والمطابع التجارية',
      },
      supplyScope: {
        en: 'Nationwide factory delivery across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد مباشر لمصانع التغليف في جميع محافظات مصر من برج العرب الجديدة',
      },
    },
    applications: [
      {
        title: { en: 'Consumer Goods & Retail Cartons', ar: 'علب المنتجات الاستهلاكية والتجزئة' },
        detail: {
          en: 'Ideal for detergents, household appliances, footwear boxes, and retail shelf packaging.',
          ar: 'الخيار الأول لعلب المنظفات والأجهزة المنزلية وعلب الأحذية وتعبئة منتجات التجزئة.',
        },
      },
      {
        title: { en: 'Industrial & Spare-Parts Boxes', ar: 'علب قطع الغيار والمنتجات الصناعية' },
        detail: {
          en: 'High compression and burst resistance protects heavier components during stacking and transit.',
          ar: 'مقاومة عالية للضغط والتكديس تحمي المنتجات الثقيلة أثناء التخزين والنقل.',
        },
      },
      {
        title: { en: 'Corrugated Box Top-Liner Lamination', ar: 'التكشير على الكرتون المضلع' },
        detail: {
          en: 'Smooth coated face laminates cleanly onto E-flute and B-flute corrugated board for printed shipping boxes.',
          ar: 'وجه أبيض مطلي ناعم يناسب التكشير على الكرتون المضلع (E-Flute / B-Flute) للعبوات المطبوعة.',
        },
      },
      {
        title: { en: 'High-Speed Gluing & Auto-Packing', ar: 'خطوط اللصق والتعبئة الأوتوماتيكية' },
        detail: {
          en: 'Consistent caliper and moisture control prevent jam-ups on automated folder-gluer lines.',
          ar: 'تجانس السماكة والرطوبة يضمن تشغيلاً سلساً على ماكينات التكسير واللصق السريعة.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'When should I choose Grey Back Duplex Board over White Back Duplex Board?',
          ar: 'متى أختار الدوبليكس ظهر رمادي بدلاً من الدوبليكس ظهر أبيض؟',
        },
        answer: {
          en: 'Choose Grey Back Duplex when exterior printing and high structural strength are the priority and the inside of the box does not require a bright white finish—it delivers major cost savings for detergents, hardware, footwear, and general retail cartons.',
          ar: 'اختر الدوبليكس ظهر رمادي عندما يكون التركيز على الطباعة الخارجية والصلابة العالية دون الحاجة لمظهر أبيض داخلي، مما يوفر تكلفة اقتصادية ممتازة لعلب المنظفات وقطع الغيار والأحذية والمنتجات العامة.',
        },
      },
      {
        question: {
          en: 'What GSM weights are available for Grey Back Duplex Board?',
          ar: 'ما هي الأوزان المتوفرة من ورق الدوبليكس ظهر رمادي؟',
        },
        answer: {
          en: 'We supply Grey Back Duplex Board across 230 to 450 GSM (including 250, 300, 350, 400, and 450 GSM) depending on box size and stacking load.',
          ar: 'نوفر الدوبليكس ظهر رمادي بأوزان تبدأ من 230 حتى 450 جرام (شاملة 250، 300، 350، 400، و 450 جرام) حسب حجم العبوة وقدرة التحمل المطلوبة.',
        },
      },
      {
        question: {
          en: 'Do you offer custom sheet cutting and reel slitting for duplex board?',
          ar: 'هل توفرون تقطيع أفرخ بمقاسات خاصة أو بكرات من ورق الدوبليكس؟',
        },
        answer: {
          en: 'Yes. Our New Borg El Arab converting facility sheets up to 1,400 × 1,000 mm and slits reels to match your exact die-cutting layout and reduce trim waste.',
          ar: 'نعم، نوفر في مصنعنا ببرج العرب الجديدة تقطيع أفرخ حتى مقاس 1,400 × 1,000 ملم وتشقيق بكرات بالعروض المطلوبة لتقليل الهالك في الطباعة والتكسير.',
        },
      },
      {
        question: {
          en: 'Does Grey Back Duplex accept varnish, UV coating, and lamination?',
          ar: 'هل يقبل الدوبليكس ظهر رمادي الورنيش والسلوفان والـ UV؟',
        },
        answer: {
          en: 'Yes. The coated white top face is formulated for high-speed offset CMYK printing as well as aqueous varnish, spot UV, and gloss/matte lamination.',
          ar: 'نعم، الوجه العلوي الأبيض المطلي مهيأ لطباعة الأوفسيت رباعية الألوان ويقبل الورنيش المائي والـ UV الموضعي والسلوفان اللامع والمطفي.',
        },
      },
    ],
    relatedIds: ['duplex-white', 'bristol', 'coated'],
  },

  'duplex-white': {
    id: 'duplex-white',
    seoTitle: {
      en: 'White Back Duplex Board Wholesale Egypt | MM Paper Industry',
      ar: 'ورق الدوبليكس ظهر أبيض بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Premium white-back duplex board in Egypt with coated print face and clean virgin-white back for pharmaceutical, food & cosmetic cartons.',
      ar: 'توريد ورق الدوبليكس ظهر أبيض بالجملة في مصر بوجه أمامي ناعم مطلي وظهر أبيض نقي لعبوات الأدوية والأغذية ومستحضرات التجميل من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'white back duplex board Egypt',
        'pharmaceutical carton board Egypt',
        'food packaging duplex board wholesale',
        'virgin white back board supplier Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق دوبليكس ظهر أبيض بالجملة في مصر',
        'كرتون عبوات أدوية وأغذية',
        'مورد دوبليكس ظهر أبيض للمصانع',
        'سعر ورق الدوبليكس ظهر أبيض',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Premium multi-layer packaging board combining a high-gloss coated print face with a clean virgin-fibre white back — engineered for pharmaceutical cartons, food boxes, and luxury retail packaging refined on both sides.',
      ar: 'كرتون دوبليكس فاخر متعدد الطبقات يجمع بين وجه أمامي مطلي فائق النعومة وظهر أبيض نقي من ألياف بكر، مصمم خصيصاً لعبوات الأدوية والمواد الغذائية والعلب الأنيقة من الجانبين.',
    },
    technical: {
      sizes: {
        en: 'Standard 70×100 cm, custom sheet sizes up to 1,400 × 1,000 mm & slit reels',
        ar: 'مقاسات قياسية 70×100 سم وتقطيع أفرخ خاصة حتى 1,400 × 1,000 ملم وبكرات',
      },
      formats: {
        en: 'Precision-cut sheets & industrial reels',
        ar: 'أفرخ مقطعة بدقة وبكرات (بكر وشيت)',
      },
      packaging: {
        en: 'Hygienic moisture-sealed pallets with protective wrapping & edge boards',
        ar: 'بالتات محكمة التغليف ضد الرطوبة والأتربة مع زوايا حماية',
      },
      moq: {
        en: 'Wholesale pallets & tonnage contracts for pharma, food & cosmetics packaging plants',
        ar: 'توريد جملة بالبالتات والأطنان لمصانع عبوات الأدوية والأغذية ومستحضرات التجميل',
      },
      supplyScope: {
        en: 'Scheduled deliveries across Cairo, Alexandria, Borg El Arab & all Egyptian governorates',
        ar: 'توريد مجدول للقاهرة والإسكندرية وبرج العرب وجميع محافظات مصر',
      },
    },
    applications: [
      {
        title: { en: 'Pharmaceutical & Healthcare Cartons', ar: 'عبوات الأدوية والمستلزمات الطبية' },
        detail: {
          en: 'Crisp micro-text legibility, clean white interior, and reliable Braille embossing & batch-code printing.',
          ar: 'وضوح فائق للنصوص الدقيقة، مظهر داخلي أبيض نظيف، وقابلية ممتازة لبروز برايل وطباعة أرقام التشغيل.',
        },
      },
      {
        title: { en: 'Food & Confectionery Packaging', ar: 'علب الأغذية والحلويات والمخبوزات' },
        detail: {
          en: 'Clean virgin-white interior back suitable for dry food boxes, pastry cartons, and tea/coffee packaging.',
          ar: 'ظهر أبيض نقي يناسب علب الحلويات والشاي والقهوة والمنتجات الغذائية الجافة.',
        },
      },
      {
        title: { en: 'Cosmetics & Personal Care Boxes', ar: 'عبوات مستحضرات التجميل والعطور' },
        detail: {
          en: 'Accepts metallic foil stamping, deep embossing, spot UV, and velvet lamination for premium shelf appeal.',
          ar: 'يتحمل البصمة الحرارية والبروز والـ UV الموضعي والسلوفان المطفي المخملي للعبوات الفاخرة.',
        },
      },
      {
        title: { en: 'Two-Sided Refined Retail Packaging', ar: 'عبوات التغليف الفاخرة من الجانبين' },
        detail: {
          en: 'Delivers a cohesive, clean unboxing experience when customers open the carton.',
          ar: 'يمنح العميل تجربة فتح عبوة نظيفة ومتناسقة من الخارج والداخل على حد سواء.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Why is White Back Duplex Board preferred for pharmaceutical and food cartons?',
          ar: 'لماذا يُفضّل ورق الدوبليكس ظهر أبيض لعبوات الأدوية والأغذية؟',
        },
        answer: {
          en: 'Its clean virgin-fibre white back provides a hygienic, uniform interior appearance with low odour and high folding integrity, meeting the strict presentation standards of pharmaceutical and food brands.',
          ar: 'لأن ظهره الأبيض النقي المصنوع من ألياف بكر يمنح العبوة مظهراً داخلياً صحياً ونظيفاً بدون روائح وبثبات ممتاز عند الطيّ، مما يلائم اشتراطات شركات الأدوية والأغذية.',
        },
      },
      {
        question: {
          en: 'What GSM range is stocked for White Back Duplex Board?',
          ar: 'ما هي الأوزان المتوفرة من الدوبليكس ظهر أبيض؟',
        },
        answer: {
          en: 'We supply 230 to 450 GSM (most commonly 250, 300, 350, and 400 GSM) in both precision sheets and custom-slit reels.',
          ar: 'نوفر أوزاناً من 230 إلى 450 جرام (وأكثرها طلباً 250، 300، 350، و 400 جرام) في شكل أفرخ مقطعة أو بكرات.',
        },
      },
      {
        question: {
          en: 'Can White Back Duplex handle foil stamping, embossing, and UV varnish?',
          ar: 'هل يقبل الدوبليكس ظهر أبيض البصمة والـ UV والبروز؟',
        },
        answer: {
          en: 'Yes. The smooth multi-coated front face is specifically engineered for high-resolution CMYK offset, hot foil stamping, embossing, and UV or aqueous coatings.',
          ar: 'نعم، الوجه الأمامي المطلي فائق النعومة مصمم لطباعة الأوفسيت عالية الدقة ويقبل البصمة الحرارية والبروز والورنيش والـ UV بكفاءة.',
        },
      },
      {
        question: {
          en: 'Can MM Paper Industry cut custom sheet dimensions to reduce die-cut waste?',
          ar: 'هل يمكن تقطيع مقاسات خاصة لتقليل هالك التكسير؟',
        },
        answer: {
          en: 'Yes. Share your carton layout dimensions and our converting team in New Borg El Arab will sheet or slit the exact economical size for your press.',
          ar: 'نعم، شاركنا مقاس فرخ الطباعة أو اسطمبة التكسير وسيقوم فريق التقطيع لدينا في برج العرب الجديدة بتجهيز المقاس الاقتصادي الأنسب لماكينتك.',
        },
      },
    ],
    relatedIds: ['duplex-grey', 'bristol', 'butter'],
  },

  butter: {
    id: 'butter',
    seoTitle: {
      en: 'Butter & Greaseproof Paper Wholesale Egypt | MM Paper Industry',
      ar: 'ورق الزبدة بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk food-grade butter and greaseproof paper in Egypt: semi-translucent non-stick sheets and custom slit reels for bakeries, restaurants & food factories.',
      ar: 'توريد ورق الزبدة المقاوم للدهون بالجملة في مصر: أفرخ وبكرات مانعة للالتصاق وآمنة للغذاء للمخابز والمطاعم ومصانع الحلويات من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'butter paper wholesale Egypt',
        'greaseproof paper supplier Egypt',
        'baking parchment reels sheets Egypt',
        'food wrapping paper bulk Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق زبدة بالجملة في مصر',
        'مورد ورق زبدة للمخابز والمطاعم',
        'ورق مقاوم للدهون لتغليف الطعام',
        'بكر وأفرخ ورق زبدة',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Food-contact greaseproof butter paper (35–60 GSM) engineered for non-stick baking, oil resistance, and hygienic food wrapping — supplied in custom-cut interleaved sheets and slit reels.',
      ar: 'ورق زبدة مقاوم للدهون والزيوت (35–60 جرام) بسطح نصف شفاف مانع للالتصاق، مثالي لتبطين صواني الخبز وفصل وتغليف المنتجات الغذائية، متوفر في بكرات وأفرخ مقطعة حسب الطلب.',
    },
    technical: {
      sizes: {
        en: 'Custom bakery tray sheets (40×60 cm, 50×70 cm, 70×100 cm) & custom reel widths',
        ar: 'مقاسات صواني المخابز (40×60 سم، 50×70 سم، 70×100 سم) وبكرات بعروض مخصصة',
      },
      formats: {
        en: 'Interleaved flat sheets & custom-slit food reels',
        ar: 'أفرخ مقطعة جاهزة وبكرات مشققة (بكر وشيت)',
      },
      packaging: {
        en: 'Hygienic kraft-wrapped reams, food-safe cartons & sealed pallets',
        ar: 'رزم مغلفة صحياً، كراتين محكمة، وبالتات محمية للشحن',
      },
      moq: {
        en: 'Wholesale cartons, reels & bulk tonnage for bakeries, food chains & converters',
        ar: 'توريد جملة بالكراتين والبكر والأطنان للمخابز والمطاعم ومصانع الأغذية',
      },
      supplyScope: {
        en: 'Nationwide supply across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد منتظم لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Commercial Bakeries & Pastry Lines', ar: 'المخابز التجارية وخطوط الحلويات' },
        detail: {
          en: 'Non-stick tray lining that prevents baked goods from adhering and speeds up production turnover.',
          ar: 'تبطين صواني الخبز لمنع التصاق المخبوزات والمعجنات وتسهيل سرعة الإنتاج والتنظيف.',
        },
      },
      {
        title: { en: 'Fast-Food & Sandwich Wrapping', ar: 'تغليف السندوتشات والوجبات السريعة' },
        detail: {
          en: 'Oil-barrier finish keeps packaging clean and accepts food-safe flexo logo printing.',
          ar: 'حاجز فعّال ضد الزيوت والدهون يحافظ على نظافة التغليف ويقبل الطباعة بأحبار غذائية آمنة.',
        },
      },
      {
        title: { en: 'Food Interleaving & Separation', ar: 'فصل قطع الطعام والمنتجات المجمدة' },
        detail: {
          en: 'Clean separation between burger patties, cheese slices, chocolates, and oriental sweets.',
          ar: 'فصل نظيف بين شرائح الجبن والبرجر والشوكولاتة والحلويات الشرقية دون تمزق.',
        },
      },
      {
        title: { en: 'Retail Rolls & Private-Label Converting', ar: 'التعبئة في رولات تجارية' },
        detail: {
          en: 'Supplied in jumbo reels for local converters producing consumer kitchen rolls.',
          ar: 'توريد بكرات جامبو لمصانع التعبئة المنتجة لرولات ورق الزبدة المنزلي.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Is MM Paper Industry butter paper safe for direct food contact?',
          ar: 'هل ورق الزبدة لدى إم إم لصناعة الورق آمن للملامسة المباشرة للطعام؟',
        },
        answer: {
          en: 'Yes. We supply food-contact grade butter and greaseproof papers formulated for bakeries, restaurants, and food packaging lines in both white and unbleached options.',
          ar: 'نعم، نوفر درجات ورق زبدة ومقاوم للدهون مخصصة وآمنة للملامسة المباشرة للطعام للمخابز والمطاعم ومصانع الأغذية.',
        },
      },
      {
        question: {
          en: 'Can butter paper be printed with our restaurant or brand logo?',
          ar: 'هل يقبل ورق الزبدة طباعة شعار المطعم أو العلامة التجارية؟',
        },
        answer: {
          en: 'Yes. Our greaseproof grades accept food-safe flexographic ink printing cleanly for branded sandwich wraps and pastry liners.',
          ar: 'نعم، خامات ورق الزبدة لدينا تقبل طباعة الفليكسو بأحبار غذائية آمنة لتغليف السندوتشات والحلويات بشعار علامتك التجارية.',
        },
      },
      {
        question: {
          en: 'Do you supply butter paper in pre-cut bakery tray sheets as well as reels?',
          ar: 'هل يتوفر ورق الزبدة مقصوصاً على مقاسات صواني المخابز أم بكرات فقط؟',
        },
        answer: {
          en: 'Both. We cut exact tray sizes (such as 40×60 cm and 50×70 cm) and slit custom reel widths in our New Borg El Arab converting facility.',
          ar: 'نوفر الاثنين؛ أفرخ مقطعة بدقة على مقاس الصواني (مثل 40×60 و 50×70 سم) بالإضافة إلى بكرات بالعروض المطلوبة.',
        },
      },
      {
        question: {
          en: 'What GSM weights are recommended for baking vs. sandwich wrapping?',
          ar: 'ما الوزن (الجرام) المناسب للخبز مقارنة بتغليف السندوتشات؟',
        },
        answer: {
          en: '35–40 GSM is widely used for lightweight sandwich wrapping and interleaving, while 42–60 GSM provides higher heat and grease resistance for commercial baking trays.',
          ar: 'أوزان 35–40 جرام مثالية لتغليف السندوتشات والفصل بين القطع، بينما توفر أوزان 42–60 جرام متانة ومقاومة أعلى للدهون والحرارة في صواني المخابز.',
        },
      },
    ],
    relatedIds: ['duplex-white', 'sticker', 'offset'],
  },

  offset: {
    id: 'offset',
    seoTitle: {
      en: 'Offset Printing Paper Wholesale Egypt | MM Paper Industry',
      ar: 'ورق الطبع (الأوفسيت) بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'High-whiteness uncoated woodfree offset printing paper in Egypt: CIE 140–160 brightness, 92%+ opacity in sheets & jumbo reels for books and commercial presses.',
      ar: 'توريد ورق الطبع (الأوفسيت) غير المطلي بالجملة في مصر ببياض عالٍ وعتامة 92%+ لطباعة الكتب والدفاتر والمطبوعات التجارية، أفرخ وبكرات من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'offset printing paper wholesale Egypt',
        'woodfree uncoated paper Egypt',
        'book printing paper supplier Egypt',
        '70x100 offset paper sheets reels',
        'MM Paper Industry',
      ],
      ar: [
        'ورق طبع بالجملة في مصر',
        'ورق أوفسيت للمطابع',
        'سعر طن ورق الطبع في مصر',
        'ورق طباعة كتب ودفاتر 70×100',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'High-whiteness, uncoated woodfree printing paper (60–160 GSM) engineered for smooth ink absorption, 92%+ opacity, and lint-free runnability on high-speed sheet-fed and web offset presses.',
      ar: 'ورق طبع (أوفسيت) غير مطلي خالٍ من الخشب بأوزان 60 إلى 160 جرام، يتميز ببياض عالٍ وعتامة تتجاوز 92% وثبات ممتاز على ماكينات الأوفسيت السريعة لطباعة الكتب والملازم والنماذج التجارية.',
    },
    technical: {
      sizes: {
        en: 'Standard 70×100 cm, 60×90 cm, 64×90 cm, custom sheet sizes & web offset reels',
        ar: 'مقاسات قياسية 70×100 سم، 60×90 سم، 64×90 سم، تقطيع خاص وبكرات ويب أوفسيت',
      },
      formats: {
        en: 'Precision-cut sheets & jumbo / slit reels',
        ar: 'أفرخ مقطعة بدقة وبكرات (بكر وشيت)',
      },
      packaging: {
        en: '500-sheet reams & moisture-sealed bulk pallets',
        ar: 'رزم 500 فرخ وبالتات محكمة التغليف ضد الرطوبة',
      },
      moq: {
        en: 'Wholesale pallets & tonnage supply for printing houses, publishers & notebook factories',
        ar: 'توريد جملة بالبالتات والأطنان للمطابع ودور النشر ومصانع الكشاكيل والدفاتر',
      },
      supplyScope: {
        en: 'Nationwide dispatch across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد وشحن سريع لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Books, Textbooks & Publishing', ar: 'طباعة الكتب والكتب الدراسية ودور النشر' },
        detail: {
          en: 'High opacity prevents show-through on double-sided pages while offering comfortable reading contrast.',
          ar: 'عتامة عالية تمنع شفافية الكتابة بين الوجهين مع تباين مريح للعين في القراءة.',
        },
      },
      {
        title: { en: 'Notebooks & Exercise Books', ar: 'مصانع الكشاكيل والكراسات والدفاتر' },
        detail: {
          en: 'Smooth ruled-printing surface and clean ink absorption for ballpoint and gel pens without feathering.',
          ar: 'سطح ناعم للتسطير والطباعة مع امتصاص نظيف لأحبار الكتابة دون تسرّب.',
        },
      },
      {
        title: { en: 'Commercial Forms & Letterheads', ar: 'المطبوعات التجارية والخطابات الرسمية' },
        detail: {
          en: 'Reliable dimensional stability for multi-colour corporate stationery, brochures, and daily forms.',
          ar: 'ثبات أبعاد ممتاز لمطبوعات الشركات والخطابات الرسمية والنماذج الإدارية.',
        },
      },
      {
        title: { en: 'Pharmaceutical Leaflets & Manuals', ar: 'النشرات الداخلية وكتيبات التشغيل' },
        detail: {
          en: 'Lightweight 60–70 GSM grades fold crisply on automated folding machines for product inserts.',
          ar: 'أوزان 60–70 جرام تقبل الطيّ المتعدد بدقة على ماكينات تطبيع النشرات.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What GSM weights are available for Offset Printing Paper?',
          ar: 'ما هي الأوزان المتوفرة من ورق الطبع (الأوفسيت)؟',
        },
        answer: {
          en: 'We supply offset printing paper from 60 GSM up to 160 GSM, including the most requested 60, 70, 80, 90, 100, 120, and 150 GSM weights.',
          ar: 'نوفر ورق الطبع بأوزان تبدأ من 60 جرام حتى 160 جرام، شاملة الأوزان الأكثر طلباً: 60، 70، 80، 90، 100، 120، و 150 جرام.',
        },
      },
      {
        question: {
          en: 'Is the printing paper supplied in both sheets (70×100) and reels?',
          ar: 'هل يتوفر ورق الطبع في أفرخ (70×100) وبكرات؟',
        },
        answer: {
          en: 'Yes. We supply standard 70×100 cm and custom-cut sheets for sheet-fed presses as well as jumbo and slit reels for web offset and notebook converting lines.',
          ar: 'نعم، يتوفر في أفرخ قياسية (70×100 سم) ومقاسات خاصة لمطابع الأفرخ، وكذلك بكرات لخطوط الويب أوفسيت ومصانع الكشاكيل.',
        },
      },
      {
        question: {
          en: 'Does MM Paper Industry supply high-opacity woodfree grades for double-sided book printing?',
          ar: 'هل تتوفر درجات بعتامة عالية لطباعة الكتب على الوجهين؟',
        },
        answer: {
          en: 'Yes. Our woodfree offset grades feature 92%+ minimum opacity and CIE whiteness between 140 and 160, ensuring sharp text without bleed-through.',
          ar: 'نعم، خامات ورق الطبع الخالي من الخشب لدينا تحقق عتامة لا تقل عن 92% وبياض CIE بين 140–160 لطباعة نظيفة على الوجهين.',
        },
      },
      {
        question: {
          en: 'What is the difference between Offset Printing Paper and Copy Paper?',
          ar: 'ما الفرق بين ورق الطبع (الأوفسيت) وورق التصوير؟',
        },
        answer: {
          en: 'Offset printing paper is supplied in large press sheets (e.g., 70×100 cm) or reels across 60–160 GSM for commercial printing presses, whereas Copy Paper is precision-cut to A4/A3 office reams (70–100 GSM) for photocopiers and desktop printers.',
          ar: 'ورق الطبع يُورّد في أفرخ كبيرة (مثل 70×100 سم) أو بكرات بأوزان 60–160 جرام لمطابع الأوفسيت، بينما ورق التصوير مقصوص بدقة لمقاسات A4 و A3 في رزم مكتبية لماكينات التصوير والطابعات.',
        },
      },
    ],
    relatedIds: ['copy', 'coated', 'bristol'],
  },

  copy: {
    id: 'copy',
    seoTitle: {
      en: 'Copy Paper A4 & A3 Wholesale Egypt | MM Paper Industry',
      ar: 'ورق التصوير A4 و A3 بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk A4 & A3 office copy paper in Egypt: ultra-bright anti-jam 500-sheet reams and palletized cartons for offices, schools & distributors.',
      ar: 'توريد ورق التصوير A4 و A3 بالجملة في مصر: رزم 500 ورقة وكراتين جملة فائقة البياض لمنع الانحشار للشركات والمدارس والمكتبات من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'A4 copy paper wholesale Egypt',
        'A3 office paper bulk supplier Egypt',
        '80 GSM copy paper cartons Egypt',
        'photocopy paper distributor Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق تصوير A4 بالجملة في مصر',
        'سعر كرتونة ورق التصوير جملة',
        'ورق تصوير 80 جرام A4 و A3',
        'مورد ورق تصوير للشركات والمدارس',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Ultra-bright, precision guillotine-cut A4 and A3 copy paper (70, 75, 80 & 100 GSM) built for jam-free high-speed duplex printing and copying across corporate offices, schools, and print centres.',
      ar: 'ورق تصوير مكتبي فائق البياض بمقاسات A4 و A3 وأوزان 70 و 75 و 80 و 100 جرام، مقصوص بدقة عالية لمنع انحشار الورق في ماكينات التصوير السريعة وطابعات الليزر والإنك جيت.',
    },
    technical: {
      sizes: {
        en: 'Standard A4 (210 × 297 mm) & A3 (297 × 420 mm)',
        ar: 'مقاسات قياسية A4 (210 × 297 ملم) و A3 (297 × 420 ملم)',
      },
      formats: {
        en: '500-sheet moisture-wrapped reams in 5-ream cartons',
        ar: 'رزم 500 ورقة مغلفة ضد الرطوبة داخل كراتين جملة (5 رزم/كرتونة)',
      },
      packaging: {
        en: 'Standard 5-ream cartons & stretch-wrapped wholesale pallets',
        ar: 'كراتين 5 رزم قياسية وبالتات توريد جملة للشركات والموزعين',
      },
      moq: {
        en: 'Wholesale cartons & pallet quantities for corporate procurement, schools & resellers',
        ar: 'توريد جملة بالكراتين والبالتات للشركات والمدارس والجامعات ومراكز التصوير',
      },
      supplyScope: {
        en: 'Fast nationwide delivery across Egypt from New Borg El Arab, Alexandria',
        ar: 'شحن وتوريد منتظم لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Corporate Offices & Banks', ar: 'الشركات والبنوك والمؤسسات' },
        detail: {
          en: 'Clean double-sided laser printing for contracts, financial reports, and daily correspondence.',
          ar: 'طباعة ليزر نظيفة على الوجهين للعقود والتقارير المالية والمراسلات اليومية.',
        },
      },
      {
        title: { en: 'Schools, Universities & Exam Centres', ar: 'المدارس والجامعات ومراكز الامتحانات' },
        detail: {
          en: 'Consistent sheet flatness prevents paper jams during high-volume exam and handout runs.',
          ar: 'استواء كامل للأفرخ يمنع انحشار ماكينات التصوير أثناء طباعة الملازم والامتحانات بكميات كبيرة.',
        },
      },
      {
        title: { en: 'Copy Centres & Digital Print Shops', ar: 'مراكز التصوير ومطابع الديجيتال' },
        detail: {
          en: 'Low-dust guillotine edges extend drum life and keep toner adhesion sharp on both A4 and A3.',
          ar: 'حواف قص خالية من الأتربة الورقية تطيل عمر ماكينات التصوير وتضمن ثبات الحبر على A4 و A3.',
        },
      },
      {
        title: { en: 'Stationery Wholesalers & Distributors', ar: 'تجار الجملة وموزعو الأدوات المكتبية' },
        detail: {
          en: 'Reliable recurring pallet availability in 70, 75, 80, and 100 GSM weights.',
          ar: 'توافر مستمر ومنتظم لبالتات الجملة بأوزان 70 و 75 و 80 و 100 جرام.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What weights and sizes of Copy Paper does MM Paper Industry supply?',
          ar: 'ما هي الأوزان والمقاسات المتوفرة من ورق التصوير؟',
        },
        answer: {
          en: 'We supply both A4 (210×297 mm) and A3 (297×420 mm) copy paper in 70, 75, 80, and 100 GSM, packed in 500-sheet reams and wholesale cartons.',
          ar: 'نوفر ورق التصوير بمقاسي A4 (210×297 ملم) و A3 (297×420 ملم) بأوزان 70 و 75 و 80 و 100 جرام في رزم 500 ورقة وكراتين جملة.',
        },
      },
      {
        question: {
          en: 'Which weight is best for double-sided office printing: 70 GSM or 80 GSM?',
          ar: 'أيهما أفضل للطباعة المكتبية على الوجهين: 70 جرام أم 80 جرام؟',
        },
        answer: {
          en: '80 GSM is the gold standard for double-sided laser printing, official contracts, and presentations due to higher opacity and stiffness, while 70–75 GSM is ideal for high-volume internal drafts and photocopying.',
          ar: 'وزن 80 جرام هو المعيار الأفضل للطباعة على الوجهين والعقود الرسمية بفضل عتامته وتماسكه، بينما يناسب 70–75 جرام التصوير اليومي الكثيف والمطبوعات الداخلية بتكلفة اقتصادية.',
        },
      },
      {
        question: {
          en: 'Does the copy paper work smoothly in high-speed photocopiers without jamming?',
          ar: 'هل يعمل ورق التصوير بسلاسة في ماكينات التصوير السريعة بدون انحشار؟',
        },
        answer: {
          en: 'Yes. Precision guillotine cutting, controlled moisture content, and low surface dust ensure jam-free feeding in high-speed photocopiers, laser, and inkjet printers.',
          ar: 'نعم، القص الدقيق والتحكم في نسبة الرطوبة وانخفاض الأتربة الورقية تضمن تغذية سلسة بدون انحشار في الماكينات السريعة والليزر والإنك جيت.',
        },
      },
      {
        question: {
          en: 'Do you offer recurring supply contracts for companies and schools?',
          ar: 'هل توفرون عقود توريد دورية للشركات والمدارس؟',
        },
        answer: {
          en: 'Yes. We provide scheduled monthly or quarterly wholesale supply plans across all Egyptian governorates.',
          ar: 'نعم، نوفر خطط توريد دورية (شهرية أو ربع سنوية) بأسعار جملة تنافسية للشركات والمدارس في جميع المحافظات.',
        },
      },
    ],
    relatedIds: ['offset', 'parchment', 'carbon'],
  },

  coated: {
    id: 'coated',
    seoTitle: {
      en: 'Coated Paper (Couche) Wholesale Egypt | MM Paper Industry',
      ar: 'ورق الكوشيه بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk gloss & matte coated art paper (Couche) in Egypt: ISO 96+ brightness, double-coated sheets & reels for catalogues, brochures, magazines & luxury covers.',
      ar: 'توريد ورق الكوشيه اللامع والمطفي بالجملة في مصر بإشراقة عالية وطلاء فني مزدوج للكتالوجات والبروشورات والمجلات والأغلفة الفاخرة من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'coated paper couche wholesale Egypt',
        'gloss matte art paper supplier Egypt',
        'couche paper 150 250 300 GSM Egypt',
        'magazine brochure paper Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق كوشيه بالجملة في مصر',
        'سعر ورق الكوشيه اللامع والمطفي',
        'ورق كوشيه 150 و 250 و 300 جرام',
        'ورق طباعة كتالوجات وبروشورات',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Double art-coated gloss and silk-matte Couche paper (90–300 GSM) with ISO 96+ brightness — engineered to deliver razor-sharp CMYK halftones, vivid colour depth, and smooth lamination for commercial print.',
      ar: 'ورق كوشيه بطلاء فني مزدوج (لامع Gloss أو مطفي حريري Matte) بأوزان 90 إلى 300 جرام وإشراقة تتجاوز 96 ISO لإبراز الألوان والتفاصيل الفوتوغرافية بدقة فائقة في الكتالوجات والمجلات والبروشورات.',
    },
    technical: {
      sizes: {
        en: 'Standard 70×100 cm, 64×90 cm, 50×70 cm, custom sheet cuts & reels',
        ar: 'مقاسات قياسية 70×100 سم، 64×90 سم، 50×70 سم مع تقطيع مقاسات خاصة وبكرات',
      },
      formats: {
        en: 'Precision-cut press sheets & bulk converting reels',
        ar: 'أفرخ مطابع مقطعة بدقة وبكرات (بكر وشيت)',
      },
      packaging: {
        en: 'Moisture-barrier reams & reinforced export pallets',
        ar: 'رزم محمية من الرطوبة وبالتات خشبية مدعمة للشحن',
      },
      moq: {
        en: 'Wholesale packs, pallets & tonnage supply for commercial presses and agencies',
        ar: 'توريد جملة بالرزم والبالتات والأطنان للمطابع التجارية ودور النشر',
      },
      supplyScope: {
        en: 'Nationwide supply across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد مباشر لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Product Catalogues & Magazines', ar: 'الكتالوجات والمجلات الاحترافية' },
        detail: {
          en: '115–170 GSM gloss or silk-matte pages deliver rich photography and crisp typography.',
          ar: 'أوزان 115–170 جرام اللامعة أو المطفية تمنح صوراً غنية وتباين ألوان فائق للكتالوجات والمجلات.',
        },
      },
      {
        title: { en: 'Brochures, Flyers & Promotional Print', ar: 'البروشورات والفلايرات الدعائية' },
        detail: {
          en: 'Fast ink setting and high surface smoothness keep high-volume offset runs vibrant and smudge-free.',
          ar: 'جفاف سريع للحبر ونعومة فائقة للسطح تضمن طباعة دعائية زاهية بدون تلطيخ.',
        },
      },
      {
        title: { en: 'Luxury Covers, Calendars & Posters', ar: 'الأغلفة الفاخرة والنتائج والبوسترات' },
        detail: {
          en: 'Heavyweight 250–300 GSM grades pair seamlessly with spot UV, hot foil, and velvet lamination.',
          ar: 'أوزان 250–300 جرام الثقيلة تتوافق ببراعة مع الـ UV الموضعي والبصمة والسلوفان.',
        },
      },
      {
        title: { en: 'Premium Paper Bags & Tags', ar: 'الشنط الورقية الفاخرة وتيكت الملابس' },
        detail: {
          en: 'High tear resistance and crisp fold quality when laminated for retail brand bags.',
          ar: 'متانة عالية للطيّ والتدعيم عند التغليف بالسلوفان لشنط المحلات التجارية الفاخرة.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Should I choose Gloss or Matte Coated Paper (Couche)?',
          ar: 'أيهما أختار: الكوشيه اللامع (Gloss) أم المطفي (Matte)؟',
        },
        answer: {
          en: 'Choose Gloss Couche for high-energy colour pop in flyers, retail catalogues, and posters; choose Silk-Matte Couche for luxury corporate profiles, architectural catalogues, and text-heavy brochures where low glare improves readability.',
          ar: 'اختر الكوشيه اللامع (Gloss) لإبراز الألوان الزاهية في الفلايرات والبوسترات وكتالوجات التجزئة، واختر المطفي (Matte) لبروفايلات الشركات والكتالوجات الفاخرة والمطبوعات الغنية بالنصوص لتقليل الانعكاس وزيادة الفخامة.',
        },
      },
      {
        question: {
          en: 'What GSM weights of Couche paper are stocked at MM Paper Industry?',
          ar: 'ما هي الأوزان المتوفرة من ورق الكوشيه؟',
        },
        answer: {
          en: 'We stock coated paper from 90 to 300 GSM, including 90, 115, 130, 150, 170, 200, 250, and 300 GSM in both gloss and matte finishes.',
          ar: 'نوفر ورق الكوشيه بأوزان من 90 حتى 300 جرام، شاملة 90، 115، 130، 150، 170، 200، 250، و 300 جرام بالتشطيبين اللامع والمطفي.',
        },
      },
      {
        question: {
          en: 'Is your Coated Paper rated for both Offset and UV printing presses?',
          ar: 'هل ورق الكوشيه مناسب لمطابع الأوفسيت وطباعة الـ UV؟',
        },
        answer: {
          en: 'Yes. Both single-coated and double-coated grades are rated for high-speed CMYK offset presses, UV inks, spot UV varnish, and thermal lamination.',
          ar: 'نعم، خامات الطلاء المفرد والمزدوج متوافقة تماماً مع مطابع الأوفسيت السريعة وأحبار الـ UV والورنيش والسلوفان.',
        },
      },
      {
        question: {
          en: 'Can I order custom-cut sheet sizes for Couche paper?',
          ar: 'هل تتوفر خدمة تقطيع ورق الكوشيه بمقاسات خاصة؟',
        },
        answer: {
          en: 'Yes. Alongside standard 70×100 cm and 64×90 cm press sheets, our New Borg El Arab converting line cuts custom sheet dimensions to optimize your print imposition.',
          ar: 'نعم، بالإضافة للمقاسات القياسية 70×100 و 64×90 سم، نوفر تقطيعاً دقيقاً لأي مقاس خاص يقلل الهالك على ماكينة الطباعة.',
        },
      },
    ],
    relatedIds: ['bristol', 'offset', 'sticker'],
  },

  carbon: {
    id: 'carbon',
    seoTitle: {
      en: 'Carbon Paper Wholesale Egypt | MM Paper Industry',
      ar: 'الورق المُكربن بالجملة في مصر | إم إم لصناعة الورق',
    },
    seoDescription: {
      en: 'Bulk pressure-sensitive carbon transfer paper in Egypt in blue and black copy impressions for invoice books, receipt pads & multi-part commercial forms.',
      ar: 'توريد الورق المُكربن بالجملة في مصر بنسخ زرقاء وسوداء واضحة لدفاتر الفواتير والإيصالات والنماذج التجارية متعددة النسخ من إم إم لصناعة الورق.',
    },
    keywords: {
      en: [
        'carbon paper wholesale Egypt',
        'multi-part invoice paper Egypt',
        'receipt book carbon transfer paper',
        'commercial forms paper supplier Egypt',
        'MM Paper Industry',
      ],
      ar: [
        'ورق مكربن بالجملة في مصر',
        'ورق دفاتر فواتير وإيصالات',
        'مورد ورق مكربن للمطابع',
        'ورق كربون أزرق وأسود',
        'إم إم لصناعة الورق',
      ],
    },
    heroSummary: {
      en: 'Clean pressure-sensitive transfer carbon paper (20–40 GSM) formulated for sharp blue and black manual duplication across multi-part invoice books, delivery notes, and commercial receipt pads.',
      ar: 'ورق مُكربن حساس للضغط (20–40 جرام) بطلاء دقيق لنقل الكتابة اليدوية بوضوح باللون الأزرق أو الأسود، مخصص لدفاتر الفواتير وإيصالات الاستلام والنماذج التجارية متعددة النسخ.',
    },
    technical: {
      sizes: {
        en: 'Standard commercial press sheets (70×100 cm, 60×90 cm) & custom slit reels',
        ar: 'أفرخ مطابع قياسية (70×100 سم، 60×90 سم) وبكرات تجهيز بمقاسات مخصصة',
      },
      formats: {
        en: 'Bulk commercial sheet packs & converting reels',
        ar: 'عبوات أفرخ تجارية وبكرات تجهيز (بكر وشيت)',
      },
      packaging: {
        en: 'Sealed protective packs, wholesale cartons & wrapped pallets',
        ar: 'عبوات محكمة التغليف، كراتين جملة، وبالتات محمية',
      },
      moq: {
        en: 'Wholesale cartons & bulk orders for print shops, stationery manufacturers & enterprises',
        ar: 'توريد جملة بالكراتين والبالتات للمطابع ومصانع الدفاتر والشركات التجارية',
      },
      supplyScope: {
        en: 'Nationwide supply across Egypt from New Borg El Arab, Alexandria',
        ar: 'توريد منتظم لجميع محافظات مصر من برج العرب الجديدة — الإسكندرية',
      },
    },
    applications: [
      {
        title: { en: 'Multi-Part Commercial Invoice Books', ar: 'دفاتر الفواتير التجارية متعددة النسخ' },
        detail: {
          en: 'Delivers legible 2-part, 3-part, and 4-part handwritten copies without smudging.',
          ar: 'نسخ يدوية واضحة من صورتين أو ثلاث أو أربع صور دون تلطيخ أو بهتان.',
        },
      },
      {
        title: { en: 'Delivery Notes & Warehouse Vouchers', ar: 'أذون الصرف والإضافة وإيصالات التسليم' },
        detail: {
          en: 'Reliable instant duplication for logistics drivers, factories, and distribution depots.',
          ar: 'نسخ فورية واضحة لمندوبي الشحن والمخازن والمصانع ومراكز التوزيع.',
        },
      },
      {
        title: { en: 'Accounting & Cash Receipt Pads', ar: 'دفاتر إيصالات النقدية والمحاسبة' },
        detail: {
          en: 'Clean cobalt-blue and black transfer impressions suited for daily accounting records.',
          ar: 'طبع واضح بالأزرق أو الأسود يناسب السجلات المحاسبية والإيصالات اليومية.',
        },
      },
      {
        title: { en: 'Custom Print-House Booklets', ar: 'تجهيز الدفاتر الخاصة للمطابع' },
        detail: {
          en: 'Supplied in press-ready sheets and reels for commercial printers producing numbered books.',
          ar: 'توريد أفرخ وبكرات جاهزة للمطابع المتخصصة في إنتاج الدفاتر المرقّمة.',
        },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What impression colours are available for MM Paper Industry Carbon Paper?',
          ar: 'ما هي ألوان النسخ المتوفرة في الورق المُكربن؟',
        },
        answer: {
          en: 'We supply pressure-transfer carbon paper in both classic blue and black copy impressions for clean, high-contrast manual records.',
          ar: 'نوفر الورق المُكربن بنسخ واضحة باللون الأزرق الكلاسيكي واللون الأسود للسجلات والفواتير اليدوية.',
        },
      },
      {
        question: {
          en: 'Is the carbon coating clean to handle without smudging hands or forms?',
          ar: 'هل طلاء الورق المُكربن نظيف ولا يسبب تلطيخاً للفواتير؟',
        },
        answer: {
          en: 'Yes. The pressure-sensitive ink layer transfers cleanly under normal pen pressure while minimizing background rub-off during collation and daily handling.',
          ar: 'نعم، الطبقة الحساسة للضغط تنقل الكتابة بدقة عند الضغط العادي بالقلم مع تقليل التلطيخ أثناء التجميع والاستخدام اليومي.',
        },
      },
      {
        question: {
          en: 'Do you supply carbon paper in both sheets and reels for commercial printers?',
          ar: 'هل يتوفر الورق المُكربن في أفرخ وبكرات للمطابع؟',
        },
        answer: {
          en: 'Yes. We supply press-ready commercial sheet packs as well as converting reels depending on your binding and printing workflow.',
          ar: 'نعم، يتوفر في عبوات أفرخ تجارية وبكرات تجهيز حسب طبيعة خطوط الطباعة والتجليد في مطبعتك.',
        },
      },
      {
        question: {
          en: 'Can I pair Carbon Paper with Coloured Parchment in one wholesale order?',
          ar: 'هل يمكن طلب الورق المُكربن مع ورق البرشمان الملوّن في طلبية واحدة؟',
        },
        answer: {
          en: 'Yes. Many commercial print shops bundle Carbon Paper, Coloured Parchment, and Offset Paper together in a single consolidated delivery from our New Borg El Arab facility.',
          ar: 'نعم، كثير من المطابع تطلب الورق المُكربن مع البرشمان الملوّن وورق الطبع في شحنة واحدة مجمّعة من مصنعنا ببرج العرب الجديدة.',
        },
      },
    ],
    relatedIds: ['parchment', 'offset', 'copy'],
  },
};

export function getPaperDetail(id: string): PaperDetail {
  return paperDetails[id] ?? paperDetails.offset;
}
