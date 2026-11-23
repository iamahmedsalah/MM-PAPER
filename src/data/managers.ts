import type { Localized } from '../i18n/types';

export interface Manager {
  id: string;
  name: string;
  nameAr: string;
  role: Localized;
  bio: Localized;
  linkedin: string;
  initials: string;
}

export const managers: Manager[] = [
  {
    id: 'mehdi',
    name: 'Mehdi Mansouri',
    nameAr: 'مهدي منصوري',
    role: { en: 'Founder & Managing Director', ar: 'المؤسس والمدير العام' },
    bio: {
      en: 'Over two decades in the paper trade since 2006. Built MM Paper Industry from a single trimming line into a leading Egyptian importer and supplier.',
      ar: 'أكثر من عشرين عاماً في تجارة الورق منذ عام 2006. قاد تأسيس إم إم لصناعة الورق من خط تقطيع واحد إلى شركة مصرية رائدة في الاستيراد والتجهيز والتوريد.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'MM',
  },
  {
    id: 'sara',
    name: 'Sara Moradi',
    nameAr: 'سارة مرادي',
    role: { en: 'Operations Director', ar: 'مديرة العمليات' },
    bio: {
      en: 'Runs converting operations, sheeting schedules and QA. Obsessed with on-time dispatch — 99.2% of orders left on schedule last year.',
      ar: 'تدير خطوط التجهيز والتقطيع وتخطيط الإنتاج وضمان الجودة — التزام 99.2% من الطلبات بمواعيد التسليم المقررة.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'SM',
  },
  {
    id: 'kaveh',
    name: 'Kaveh Nazari',
    nameAr: 'كافه نظري',
    role: { en: 'Head of Sales & Supply', ar: 'رئيس المبيعات والتوريد' },
    bio: {
      en: 'Your first call for contract volumes and global mill allocations. Structures bulk supply agreements for printers, converters and FMCG groups.',
      ar: 'اتصالك الأول لكميات التعاقدات والتوريد من كبرى شركات ومصانع الورق العالمية للمطابع والمحولين وشركات السلع الاستهلاكية.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'KN',
  },
  {
    id: 'leila',
    name: 'Leila Amini',
    nameAr: 'ليلى أميني',
    role: { en: 'Technical & QA Manager', ar: 'مديرة التقنية وضمان الجودة' },
    bio: {
      en: 'Leads the paper laboratory: GSM, burst, stiffness and whiteness testing on every batch before it ships. Nothing leaves on a maybe.',
      ar: 'تقود مختبر الورق: اختبارات الجرامات والانفجار والصلابة والبياض على كل دفعة قبل الشحن. لا شيء يخرج دون فحص.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'LA',
  },
];
