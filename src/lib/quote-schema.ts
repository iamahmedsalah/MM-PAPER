import { z } from 'zod';
import { GOVERNORATE_IDS, getGovernorateLabel } from '../data/governorates.ts';
import { paperTypes } from '../data/papers.ts';

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
  paperBad: 'Please choose a paper grade from the list.',
  formatBad: 'Please select reels, sheets, or both.',
  governorateBad: 'Please select a valid governorate.',
  maxLen: 'Input exceeds the maximum allowed length.',
};

export function createQuoteSchema(copy: QuoteErrorCopy = DEFAULT_AR_ERRORS) {
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

/** Strip CR/LF control characters to prevent SMTP header injection. */
export function stripHeaderNewlines(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/** Escape HTML entities safely before interpolating any user field into email markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

/** Build RTL HTML and plain-text email bodies with customer call & WhatsApp action links. */
export function buildQuoteEmailContent(data: ValidatedQuoteData): {
  subject: string;
  html: string;
  text: string;
} {
  const safeSubjectName = stripHeaderNewlines(data.name);
  const safeSubjectPaper = stripHeaderNewlines(data.paperNameAr);
  const subject = `طلب عرض سعر جديد — ${safeSubjectName} — ${safeSubjectPaper}`;

  const rows: Array<[string, string]> = [
    ['الاسم', data.name],
    ['اسم الشركة', data.company || '—'],
    ['رقم الهاتف', data.phoneDisplay],
    ['نوع المنتج', `${data.paperNameAr} (${data.paperNameEn})`],
    ['الجرام', data.gsm || '—'],
    ['المقاس', data.size || '—'],
    ['بكر / شيت', data.formatLabelAr],
    ['الكمية', data.quantity || '—'],
    ['المحافظة', data.governorateAr || '—'],
    ['ملاحظات', data.notes || '—'],
  ];

  const telHref = `tel:+${data.phoneIntl}`;
  const waHref = `https://wa.me/${data.phoneIntl}`;

  const tableRowsHtml = rows
    .map(
      ([label, val]) =>
        `<tr>
          <th style="text-align:right;padding:10px 14px;background:#F4EFE3;color:#193051;border:1px solid #E2D9C5;width:180px;font-weight:700;">${escapeHtml(label)}</th>
          <td style="text-align:right;padding:10px 14px;background:#FFFFFF;color:#0B1020;border:1px solid #E2D9C5;white-space:pre-line;">${escapeHtml(val)}</td>
        </tr>`
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<body style="margin:0;padding:24px;background:#F7F4EC;font-family:Cairo,Tahoma,Arial,sans-serif;color:#0B1020;direction:rtl;">
  <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #C9A86A;border-radius:4px;overflow:hidden;">
    <div style="background:#193051;color:#F4EFE3;padding:20px 24px;border-bottom:3px solid #C9A86A;">
      <h1 style="margin:0;font-size:20px;line-height:1.4;">طلب عرض سعر جديد — إم إم لصناعة الورق</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#E0C795;">MM Paper Industry · mm-eg.co</p>
    </div>
    <div style="padding:20px 24px;">
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
        ${tableRowsHtml}
      </table>
      <div style="margin-top:22px;padding-top:16px;border-top:1px solid #E2D9C5;">
        <a href="${escapeHtml(telHref)}" style="display:inline-block;margin-left:10px;margin-bottom:8px;padding:10px 18px;background:#193051;color:#F4EFE3;text-decoration:none;border-radius:4px;font-weight:700;font-size:14px;">اتصال سريع بالعميل (<span dir="ltr">${escapeHtml(data.phoneDisplay)}</span>)</a>
        <a href="${escapeHtml(waHref)}" style="display:inline-block;margin-bottom:8px;padding:10px 18px;background:#C9A86A;color:#0B1020;text-decoration:none;border-radius:4px;font-weight:700;font-size:14px;">مراسلة العميل عبر واتساب</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = [
    'طلب عرض سعر جديد — إم إم لصناعة الورق (MM Paper Industry)',
    '------------------------------------------------------------',
    ...rows.map(([label, val]) => `${label}: ${val}`),
    '',
    `اتصال سريع بالعميل: ${telHref}`,
    `واتساب العميل: ${waHref}`,
  ].join('\n');

  return { subject, html, text };
}
