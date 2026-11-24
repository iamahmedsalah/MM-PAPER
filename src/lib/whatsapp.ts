import type { ValidatedQuoteData } from './quote-schema.ts';

const DEFAULT_WHATSAPP_NUMBER = '201132332148';

/** Normalize a WhatsApp business number into digits only (international format, no `+`). */
export function sanitizeWhatsAppNumber(raw?: string): string {
  const digits = (raw || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

/** Build a clean prefilled Arabic quotation message from validated data. */
export function buildWhatsAppQuoteMessage(data: ValidatedQuoteData): string {
  const lines: string[] = [
    'السلام عليكم، أرجو عرض سعر بالمواصفات التالية:',
    `• الاسم: ${data.name}`,
  ];

  if (data.company) lines.push(`• الشركة: ${data.company}`);
  lines.push(`• الهاتف: ${data.phoneDisplay}`);
  lines.push(`• نوع الورق: ${data.paperNameAr}`);
  if (data.gsm) lines.push(`• الجرام: ${data.gsm}`);
  if (data.size) lines.push(`• المقاس: ${data.size}`);
  lines.push(`• الشكل: ${data.formatLabelAr}`);
  if (data.quantity) lines.push(`• الكمية: ${data.quantity}`);
  if (data.governorateAr) lines.push(`• المحافظة: ${data.governorateAr}`);
  if (data.notes) lines.push(`• ملاحظات: ${data.notes}`);

  return lines.join('\n');
}

/**
 * Build a clickable wa.me URL carrying the prefilled quotation message.
 *
 * Future WhatsApp Business Cloud API integration point:
 * Inside `src/app/actions/submitQuote.ts`, after `sendQuoteEmail(...)` succeeds,
 * you can also dispatch a template message server-side via Meta Cloud API:
 * `POST https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
 * authenticated with `process.env.WHATSAPP_ACCESS_TOKEN`.
 */
export function buildWhatsAppQuoteUrl(data: ValidatedQuoteData, businessNumber?: string): string {
  const target = sanitizeWhatsAppNumber(businessNumber);
  const message = buildWhatsAppQuoteMessage(data);
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}
