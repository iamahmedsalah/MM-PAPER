import type { Localized } from '../i18n/types';

export interface Service {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
}

export const services: Service[] = [
  {
    id: 'importing',
    title: { en: 'Paper Importing', ar: 'استيراد الورق' },
    description: {
      en: 'Providing diverse paper grades and specifications from trusted sources, aligned with market demands and client requirements.',
      ar: 'توفير أنواع ومواصفات متعددة من الورق من مصادر موثوقة، وفقًا لمتطلبات السوق واحتياجات العملاء.',
    },
    icon: 'Globe',
  },
  {
    id: 'trading-supply',
    title: { en: 'Paper Trading & Supply', ar: 'تجارة وتوريد الورق' },
    description: {
      en: 'Wholesale sales and bulk supply in required volumes, with versatile options tailored for printing presses, packaging companies, and commercial or industrial sectors.',
      ar: 'بيع وتوريد الورق بالجملة وبالكميات المطلوبة، مع خيارات متنوعة تناسب المطابع وشركات التعبئة والتغليف والأنشطة التجارية والصناعية.',
    },
    icon: 'Warehouse',
  },
  {
    id: 'converting',
    title: { en: 'Paper Converting', ar: 'تحويل الورق' },
    description: {
      en: 'Cutting, slitting, and preparing paper in custom dimensions and specifications suited for end use, printing, and manufacturing.',
      ar: 'قصّ وتقطيع وتجهيز الورق بمقاسات ومواصفات مختلفة، بما يلائم احتياجات الاستخدام والطباعة والتصنيع.',
    },
    icon: 'Scissors',
  },
  {
    id: 'custom-solutions',
    title: { en: 'Custom Solutions', ar: 'حلول حسب الطلب' },
    description: {
      en: 'Preparing orders to your required specifications, including paper grade, dimensions, GSM weight, and supply quantity.',
      ar: 'تجهيز الطلبات وفق المواصفات المطلوبة، مثل نوع الورق ومقاسه ووزنه وكمية التوريد.',
    },
    icon: 'SlidersHorizontal',
  },
  {
    id: 'customer-supply',
    title: { en: 'Customer Service & Supply', ar: 'خدمة العملاء والتوريد' },
    description: {
      en: 'Order follow-up and supply coordination that help our clients receive their requirements smoothly and efficiently.',
      ar: 'متابعة الطلبات وتنسيق التوريد بما يساعد عملاءنا على الحصول على احتياجاتهم بسهولة وكفاءة.',
    },
    icon: 'Truck',
  },
];
