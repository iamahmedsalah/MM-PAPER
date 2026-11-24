import type { Localized } from '../i18n/types';

export interface Manager {
  id: string;
  name: string;
  nameAr: string;
  positionCode: string;
  role: Localized;
  bio: Localized;
  linkedin: string;
  initials: string;
  photo: string;
  photoVersion: number;
}

export const managers: Manager[] = [
  {
    id: 'mohamed-morad',
    name: 'Mr. Mohamed Morad',
    nameAr: 'أ. محمد مراد',
    positionCode: 'Chairman',
    role: { en: 'Chairman', ar: 'رئيس مجلس الإدارة' },
    bio: {
      en: 'Guiding MM Paper Industry since 2006 with strategic vision, lasting global mill partnerships, and commitment to the Egyptian paper market.',
      ar: 'يقود إم إم لصناعة الورق منذ عام 2006 برؤية استراتيجية وشراكات طويلة الأمد مع كبرى مصانع الورق العالمية لخدمة السوق المصري.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'MM',
    photo: '/team/mohamed-morad.webp',
    photoVersion: 1,
  },
  {
    id: 'khaled-morad',
    name: 'Mr. Khaled Morad',
    nameAr: 'أ. خالد مراد',
    positionCode: 'CEO | CFO',
    role: {
      en: 'Chief Executive & Financial Officer (CEO | CFO)',
      ar: 'الرئيس التنفيذي والمدير المالي (CEO | CFO)',
    },
    bio: {
      en: 'Leads corporate execution, financial governance, and international procurement strategy across high-volume paper contracts.',
      ar: 'يقود الإدارة التنفيذية والحوكمة المالية واستراتيجية التوريد والتعاقدات الدولية لكميات الورق التجارية والصناعية.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'KM',
    photo: '/team/khaled-morad.webp',
    photoVersion: 2,
  },
  {
    id: 'ahmed-morad',
    name: 'Mr. Ahmed Morad',
    nameAr: 'أ. أحمد مراد',
    positionCode: 'CSO',
    role: {
      en: 'Chief Strategy & Sales Officer (CSO)',
      ar: 'رئيس قطاع الاستراتيجية والمبيعات (CSO)',
    },
    bio: {
      en: 'Directs commercial growth, strategic partnerships, and long-term supply agreements for printers, converters, and packaging factories.',
      ar: 'يشرف على النمو التجاري والشراكات الاستراتيجية وعقود الإمداد المستمر للمطابع ومصانع التعبئة والتغليف في مصر.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'AM',
    photo: '/team/ahmed-morad.webp',
    photoVersion: 2,
  },
  {
    id: 'mohamed-mohamed-morad',
    name: 'Mr. Mohamed Mohamed Morad',
    nameAr: 'أ. محمد محمد مراد',
    positionCode: 'COO',
    role: {
      en: 'Chief Operating Officer (COO)',
      ar: 'رئيس قطاع العمليات (COO)',
    },
    bio: {
      en: 'Oversees slitting, sheeting, warehousing, laboratory QA verification, and dependable nationwide dispatch schedules.',
      ar: 'يدير عمليات التجهيز والتقطيع والتخزين وفحص الجودة المعملي وجدولة التسليم الموثوقة في جميع المحافظات.',
    },
    linkedin: 'https://www.linkedin.com/company/mm-paper-industry/',
    initials: 'MM',
    photo: '/team/mohamed-mohamed-morad.webp',
    photoVersion: 2,
  },
];
