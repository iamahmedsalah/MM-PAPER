import type { Localized } from '../i18n/types';

export interface Service {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
}

export const services: Service[] = [
  {
    id: 'manufacturing',
    title: { en: 'Paper Manufacturing', ar: 'تصنيع الورق' },
    description: {
      en: 'Continuous production across four paper machines, from 40 GSM tissue to 450 GSM board, with in-line quality control on every reel.',
      ar: 'إنتاج متواصل على أربع آلات ورق، من النسيجية 40 جراماً إلى الورق المقوى 450 جراماً، مع رقابة جودة على كل بكرة.',
    },
    icon: 'Factory',
  },
  {
    id: 'cutting',
    title: { en: 'Cutting & Sizing', ar: 'التقطيع والقياس' },
    description: {
      en: 'Precision slitting and sheeting to your exact dimensions — reels, sheets, or folio sizes, cut within ±1 mm tolerance.',
      ar: 'تقطيع دقيق إلى المقاسات التي تريدها — بكرات أو أوراق أو مقاسات فوليو، بتفاوت ±1 ملم.',
    },
    icon: 'Scissors',
  },
  {
    id: 'custom',
    title: { en: 'Custom Orders', ar: 'طلبات مخصصة' },
    description: {
      en: 'Private-label grades, custom blends, dyed shades and specialty finishes developed with our in-house paper laboratory.',
      ar: 'أصناف بعلامة خاصة، وخلطات مخصصة، ودرجات ملونة، وتشطيبات خاصة تطورها مختبرات الورق لدينا.',
    },
    icon: 'FlaskConical',
  },
  {
    id: 'packaging',
    title: { en: 'Packaging Solutions', ar: 'حلول التعبئة' },
    description: {
      en: 'Moisture-barrier wrapping, palletizing and core selection tailored to how your press or line consumes paper.',
      ar: 'تغليف بعازل للرطوبة، والتنميط على المنصات، واختيار القلب — كل ذلك وفق طريقة استهلاك مطبعتك أو خطك للورق.',
    },
    icon: 'Package',
  },
  {
    id: 'bulk',
    title: { en: 'Bulk Supply', ar: 'التوريد بالجملة' },
    description: {
      en: 'Contract volumes of 1 to 500+ tons per month with reserved production slots so your supply never pauses.',
      ar: 'كميات تعاقدية من طن واحد إلى أكثر من 500 طن شهرياً مع حجز مواعيد إنتاج حتى لا يتوقف توريدك أبداً.',
    },
    icon: 'Warehouse',
  },
  {
    id: 'logistics',
    title: { en: 'Delivery & Logistics', ar: 'التوصيل والخدمات اللوجستية' },
    description: {
      en: 'Our own truck fleet plus rail and sea freight partners. Track every load from the mill gate to your dock.',
      ar: 'أسطول شاحنات خاص بنا وشركاء شحن بالسكك والبحار. تتبّع كل حمولة من بوابة المصنع إلى رصيفك.',
    },
    icon: 'Truck',
  },
];
