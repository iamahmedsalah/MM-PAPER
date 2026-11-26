import { z } from 'zod';
import { COMPANY_CONTACT, COMPANY_LOCATION } from '../data/contact.ts';
import { GOVERNORATE_IDS, getGovernorateLabel } from '../data/governorates.ts';
import { paperTypes } from '../data/papers.ts';
import {
  escapeHtml,
  mmBrand,
  renderEmailDetailGrid,
  renderMmEmailLayout,
  stripHeaderNewlines,
  type EmailDetailItem,
} from './email-template.ts';

export { escapeHtml, stripHeaderNewlines };

export const QUOTE_FORMATS = ['reel', 'sheet', 'both'] as const;
export type QuoteFormat = (typeof QUOTE_FORMATS)[number];

export const FORMAT_LABELS_AR: Record<QuoteFormat, string> = {
  reel: 'بكر',
  sheet: 'شيت',
  both: 'الاثنان',
};

export const FORMAT_LABELS_EN: Record<QuoteFormat, string> = {
  reel: 'Reels (بكر)',
  sheet: 'Sheets (شيت)',
  both: 'Both (بكر وشيت)',
};

export const MIN_FILL_TIME_MS = 2500;
const PAPER_TYPE_IDS: readonly string[] = paperTypes.map((p) => p.id);

export type QuoteFieldName =
  | 'name'
  | 'company'
  | 'phone'
  | 'email'
  | 'paperTypeId'
  | 'gsm'
  | 'size'
  | 'format'
  | 'quantity'
  | 'governorate'
  | 'notes';

export interface ValidatedQuoteData {
  name: string;
  company: string;
  phoneDisplay: string;
  phoneIntl: string;
  email: string;
  paperTypeId: string;
  paperNameAr: string;
  paperNameEn: string;
  gsm: string;
  size: string;
  format: QuoteFormat;
  formatLabelAr: string;
  quantity: string;
  governorateId: string;
  governorateAr: string;
  notes: string;
}

/**
 * Normalize Egyptian mobile numbers (`01[0125]xxxxxxxx`, `+201[0125]xxxxxxxx`, `00201[0125]xxxxxxxx`)
 * into clean local `01xxxxxxxxx` and international digits `201xxxxxxxxx` (no `+`).
 */
export function normalizeEgyptianMobile(raw: string): { display: string; intlDigits: string } | null {
  const cleaned = raw.replace(/[\s\-().]/g, '').trim();
  let local = '';

  if (/^01[0125]\d{8}$/.test(cleaned)) {
    local = cleaned;
  } else if (/^\+?201[0125]\d{8}$/.test(cleaned)) {
    local = `0${cleaned.replace(/^\+?20/, '')}`;
  } else if (/^00201[0125]\d{8}$/.test(cleaned)) {
    local = `0${cleaned.slice(4)}`;
  } else {
    return null;
  }

  return {
    display: local,
    intlDigits: `20${local.slice(1)}`,
  };
}

export interface QuoteErrorCopy {
  nameReq: string;
  nameLen: string;
  phoneReq: string;
  phoneBad: string;
  emailBad: string;
  paperBad: string;
  formatBad: string;
  governorateBad: string;
  maxLen: string;
}

const DEFAULT_AR_ERRORS: QuoteErrorCopy = {
  nameReq: 'يرجى كتابة الاسم بالكامل.',
  nameLen: 'يجب أن يكون الاسم بين حرفين و120 حرفاً.',
  phoneReq: 'رقم الهاتف المصري مطلوب.',
  phoneBad: 'يرجى إدخال رقم موبايل مصري صحيح (مثال: 01132332148).',
  emailBad: 'يرجى إدخال بريد إلكتروني صحيح.',
  paperBad: 'يرجى اختيار نوع الورق من القائمة.',
  formatBad: 'يرجى اختيار الشكل المطلوب (بكر أو شيت أو الاثنان).',
  governorateBad: 'يرجى اختيار محافظة صحيحة من القائمة.',
  maxLen: 'النص يتجاوز الحد الأقصى المسموح به.',
};

const DEFAULT_EN_ERRORS: QuoteErrorCopy = {
  nameReq: 'Please enter your full name.',
  nameLen: 'Name must be between 2 and 120 characters.',
  phoneReq: 'An Egyptian mobile number is required.',
  phoneBad: 'Please enter a valid Egyptian mobile number (e.g. 01132332148).',
  emailBad: 'Please enter a valid email address.',
  paperBad: 'Please choose a paper grade from the list.',
  formatBad: 'Please select reels, sheets, or both.',
  governorateBad: 'Please select a valid governorate.',
  maxLen: 'Input exceeds the maximum allowed length.',
};

export function createQuoteSchema(copy: QuoteErrorCopy = DEFAULT_AR_ERRORS) {
  const email = z.email();
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, copy.nameReq)
      .min(2, copy.nameLen)
      .max(120, copy.nameLen),
    company: z.string().trim().max(120, copy.maxLen).optional().default(''),
    phone: z
      .string()
      .trim()
      .min(1, copy.phoneReq)
      .refine((v) => normalizeEgyptianMobile(v) !== null, copy.phoneBad),
    email: z
      .string()
      .trim()
      .max(254, copy.emailBad)
      .refine((value) => value === '' || email.safeParse(value).success, copy.emailBad)
      .optional()
      .default(''),
    paperTypeId: z
      .string()
      .trim()
      .refine((v) => PAPER_TYPE_IDS.includes(v), copy.paperBad),
    gsm: z.string().trim().max(40, copy.maxLen).optional().default(''),
    size: z.string().trim().max(80, copy.maxLen).optional().default(''),
    format: z.enum(QUOTE_FORMATS, { message: copy.formatBad }),
    quantity: z.string().trim().max(120, copy.maxLen).optional().default(''),
    governorate: z
      .string()
      .trim()
      .refine((v) => v === '' || GOVERNORATE_IDS.includes(v), copy.governorateBad)
      .optional()
      .default(''),
    notes: z.string().trim().max(2000, copy.maxLen).optional().default(''),
  });
}

export const quoteSubmissionSchema = createQuoteSchema();

export function checkSpamSignals({
  website,
  startedAt,
  now = Date.now(),
}: {
  website?: string | null;
  startedAt?: string | null;
  now?: number;
}): { isSpam: boolean; reason?: 'honeypot' | 'too_fast' } {
  if (typeof website === 'string' && website.trim().length > 0) {
    return { isSpam: true, reason: 'honeypot' };
  }

  const startedMs = Number(startedAt);
  if (!Number.isFinite(startedMs) || startedMs <= 0 || now - startedMs < MIN_FILL_TIME_MS) {
    return { isSpam: true, reason: 'too_fast' };
  }

  return { isSpam: false };
}

export function parseQuoteInput(
  raw: Record<string, unknown>,
  locale: 'ar' | 'en' = 'ar'
):
  | { ok: true; data: ValidatedQuoteData }
  | { ok: false; fieldErrors: Partial<Record<QuoteFieldName, string>> } {
  const schema = createQuoteSchema(locale === 'en' ? DEFAULT_EN_ERRORS : DEFAULT_AR_ERRORS);
  const result = schema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Partial<Record<QuoteFieldName, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as QuoteFieldName | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  const values = result.data;
  const phone = normalizeEgyptianMobile(values.phone)!;
  const paper = paperTypes.find((p) => p.id === values.paperTypeId)!;
  const govId = values.governorate || '';

  return {
    ok: true,
    data: {
      name: values.name,
      company: values.company,
      phoneDisplay: phone.display,
      phoneIntl: phone.intlDigits,
      email: values.email,
      paperTypeId: paper.id,
      paperNameAr: paper.name.ar,
      paperNameEn: paper.name.en,
      gsm: values.gsm,
      size: values.size,
      format: values.format,
      formatLabelAr: FORMAT_LABELS_AR[values.format],
      quantity: values.quantity,
      governorateId: govId,
      governorateAr: govId ? getGovernorateLabel(govId, 'ar') : '',
      notes: values.notes,
    },
  };
}

const notesToHtml = (value: string) =>
  value
    .split(/\r?\n+/)
    .map((line) => `<p style="margin:0 0 8px;">${escapeHtml(line)}</p>`)
    .join('');

/** Build RTL HTML (2-column card grid + inline SVG icons + CID logo) and plain-text email bodies. */
export function buildQuoteEmailContent(data: ValidatedQuoteData): {
  subject: string;
  html: string;
  text: string;
} {
  const safeSubjectName = stripHeaderNewlines(data.name);
  const safeSubjectPaper = stripHeaderNewlines(data.paperNameAr);
  const subject = `طلب عرض سعر جديد — ${safeSubjectName} — ${safeSubjectPaper}`;

  const telHref = `tel:+${data.phoneIntl}`;
  const waHref = `https://wa.me/${data.phoneIntl}`;

  const items: EmailDetailItem[] = [
    {
      icon: 'user',
      label: 'الاسم',
      valueHtml: escapeHtml(data.name),
    },
    {
      icon: 'building',
      label: 'اسم الشركة',
      valueHtml: escapeHtml(data.company || '—'),
    },
    {
      icon: 'phone',
      label: 'رقم الهاتف',
      valueHtml: `<a href="${escapeHtml(telHref)}" dir="ltr" style="color:${mmBrand.navy};text-decoration:underline;">${escapeHtml(data.phoneDisplay)}</a>`,
    },
    ...(data.email ? [{
      icon: 'message' as const,
      label: 'بريد العميل',
      valueHtml: `<a href="mailto:${escapeHtml(encodeURIComponent(data.email).replace('%40', '@'))}" dir="ltr" style="color:${mmBrand.navy};text-decoration:underline;">${escapeHtml(data.email)}</a>`,
    }] : []),
    {
      icon: 'layers',
      label: 'نوع المنتج',
      valueHtml: `${escapeHtml(data.paperNameAr)} <span dir="ltr" style="font-size:12px;color:${mmBrand.muted};font-weight:500;">(${escapeHtml(data.paperNameEn)})</span>`,
    },
    {
      icon: 'package',
      label: 'بكر / شيت',
      valueHtml: escapeHtml(data.formatLabelAr),
    },
    {
      icon: 'hash',
      label: 'الكمية',
      valueHtml: escapeHtml(data.quantity || '—'),
    },
    {
      icon: 'scale',
      label: 'الجرام',
      valueHtml: escapeHtml(data.gsm || '—'),
    },
    {
      icon: 'ruler',
      label: 'المقاس',
      valueHtml: escapeHtml(data.size || '—'),
    },
    {
      icon: 'mapPin',
      label: 'المحافظة',
      valueHtml: escapeHtml(data.governorateAr || '—'),
      fullWidth: !data.notes,
    },
    ...(data.notes
      ? [
          {
            icon: 'message' as const,
            label: 'ملاحظات',
            valueHtml: notesToHtml(data.notes),
            fullWidth: true,
          },
        ]
      : []),
  ];

  const html = renderMmEmailLayout({
    heading: 'طلب عرض سعر جديد',
    preheader: `طلب جديد من ${data.name} — ${data.paperNameAr}${data.quantity ? ` (${data.quantity})` : ''}`,
    bodyHtml: renderEmailDetailGrid(items, 'rtl'),
    primaryCta: {
      label: 'مراسلة العميل عبر واتساب',
      url: waHref,
    },
    secondaryCta: {
      label: `اتصال سريع (${data.phoneDisplay})`,
      url: telHref,
    },
    footerNote: 'تم إرسال هذا الطلب من نموذج «اطلب عرض سعر» على موقع mm-eg.co.',
  });

  const textRows: Array<[string, string]> = [
    ['الاسم', data.name],
    ['اسم الشركة', data.company || '—'],
    ['رقم الهاتف', data.phoneDisplay],
    ['نوع المنتج', `${data.paperNameAr} (${data.paperNameEn})`],
    ['بكر / شيت', data.formatLabelAr],
    ['الكمية', data.quantity || '—'],
    ['الجرام', data.gsm || '—'],
    ['المقاس', data.size || '—'],
    ['المحافظة', data.governorateAr || '—'],
    ['ملاحظات', data.notes || '—'],
  ];
  if (data.email) textRows.splice(3, 0, ['بريد العميل', data.email]);

  const text = [
    'طلب عرض سعر جديد — إم إم لصناعة الورق (MM Paper Industry)',
    '------------------------------------------------------------',
    ...textRows.map(([label, val]) => `${label}: ${val}`),
    '',
    `اتصال سريع بالعميل: ${telHref}`,
    `واتساب العميل: ${waHref}`,
    '',
    `عنوان الشركة: ${COMPANY_LOCATION.address.ar}`,
    `الموقع على الخريطة: ${COMPANY_LOCATION.googleMapsUrl}`,
    `واتساب الشركة: ${COMPANY_CONTACT.whatsappHref}`,
    `بريد الشركة: ${COMPANY_CONTACT.salesEmail}`,
  ].join('\n');

  return { subject, html, text };
}
