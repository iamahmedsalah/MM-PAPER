import type { Localized } from '../i18n/types';

export interface FaqItem {
  id: string;
  question: Localized;
  answer: Localized;
}

export const faqItems: FaqItem[] = [
  {
    id: 'paper-grades',
    question: {
      en: 'Where can I find the paper grades MM Paper Industry supplies?',
      ar: 'أين أجد أصناف الورق التي توفرها إم إم لصناعة الورق؟',
    },
    answer: {
      en: 'The paper catalogue on this page lists all ten grades. Select a grade to see its specifications and request a quote.',
      ar: 'يضم كتالوج الورق في هذه الصفحة الأصناف العشرة. اختر الصنف للاطلاع على مواصفاته وطلب عرض سعر.',
    },
  },
  {
    id: 'converting-custom',
    question: {
      en: 'Do you provide custom paper cutting, slitting, and specification preparation?',
      ar: 'هل توفرون خدمات قصّ وتقطيع وتجهيز الورق بمقاسات ومواصفات خاصة؟',
    },
    answer: {
      en: 'Yes. Through our paper converting services, we slit reels and cut sheets to custom dimensions, GSM weights, and order quantities matched to printing presses, packaging lines, and manufacturing schedules.',
      ar: 'نعم. عبر خدمات تحويل وتجهيز الورق، نقوم بقصّ وتقطيع وتجهيز البكرات والأفرخ بمقاسات وأوزان جرامية وكميات مخصصة تناسب خطوط الطباعة وماكينات التعبئة والتصنيع.',
    },
  },
  {
    id: 'location-hours',
    question: {
      en: 'Where are MM Paper Industry facilities located and what are your working hours?',
      ar: 'أين يقع مقر ومخازن إم إم لصناعة الورق وما مواعيد العمل الرسمية؟',
    },
    answer: {
      en: 'Our facility and warehouses are located at Plot 10, Block 2 — Workshops & Warehouses Zone, East 2nd Industrial Zone, New Borg El Arab City, Alexandria, Egypt. We operate Saturday through Thursday from 09:00 to 17:00 EET (closed Friday).',
      ar: 'يقع مقرنا ومخازننا في قطعة 10 - بلوك 2، منطقة الورش والمخازن - شرق المنطقة الصناعية الثانية - برج العرب الجديدة، الإسكندرية. نعمل من السبت إلى الخميس من الساعة 9:00 صباحاً حتى 5:00 مساءً (الجمعة مغلق).',
    },
  },
  {
    id: 'sectors-served',
    question: {
      en: 'Which industries and buyers does MM Paper Industry serve across Egypt?',
      ar: 'ما القطاعات والأنشطة التي تخدمها الشركة في السوق المصري؟',
    },
    answer: {
      en: 'Established in 2006, MM Paper Industry supplies printing houses, book publishers, folding-carton and food packaging manufacturers, pharmaceutical box converters, stationery makers, and commercial offices nationwide across Egypt.',
      ar: 'منذ تأسيسها عام 2006، تخدم الشركة المطابع التجارية، ودور النشر، ومصانع الكرتون والتعبئة والتغليف، وعبوات الأدوية والأغذية، ومصنّعي القرطاسية، والشركات والمؤسسات في جميع محافظات مصر.',
    },
  },
  {
    id: 'quality-verification',
    question: {
      en: 'How does MM Paper Industry verify paper quality before delivery?',
      ar: 'كيف تتأكد الشركة من جودة الورق ومطابقته للمواصفات قبل التسليم؟',
    },
    answer: {
      en: 'Our technical team inspects incoming mill batches and converted orders for GSM accuracy, caliper stiffness, burst resistance, brightness, and sheet dimensions so every shipment arrives ready for production.',
      ar: 'يفحص فريقنا الفني كل دفعة مستوردة ومجهّزة للتأكد من دقة الجرامات والصلابة ومقاومة الانفجار ودرجة البياض ودقة المقاسات قبل الشحن لضمان جاهزيتها الفورية للتشغيل.',
    },
  },
  {
    id: 'request-quote',
    question: {
      en: 'How can I request a bulk price quote or sample inspection?',
      ar: 'كيف يمكنني طلب عرض سعر توريد بالجملة أو معاينة خامات؟',
    },
    answer: {
      en: 'Submit your grade, target GSM, dimensions, and quantity through our online Request a Quote form, call or WhatsApp 011 3233 2148, or email info@mm-eg.co. Our sales team replies within one business day.',
      ar: 'يمكنك إرسال الصنف المطلوب والوزن والمقاس والكمية عبر نموذج طلب عرض السعر بالموقع، أو الاتصال ومراسلتنا عبر واتساب على 011 3233 2148، أو البريد الإلكتروني info@mm-eg.co للرد خلال يوم عمل واحد.',
    },
  },
];
